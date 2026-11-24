#!/usr/bin/env bash
# Deploy Gogir Labs API to the homelab host.
# Required: HOMELAB_HOST, HOMELAB_SSH_KEY, and HOMELAB_BIND_IP inside .env.homelab.
# On the LAN:
#   HOMELAB_HOST=user@host HOMELAB_SSH_KEY=~/.ssh/id_ed25519 ./deploy-homelab.sh
# Off the LAN, also set SSH_JUMP, SSH_JUMP_KEY, and HOMELAB_USE_JUMP=1.
#
# Compatible with macOS Bash 3.2+.

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="docker-compose.homelab.yml"
REMOTE_DIR="${REMOTE_DIR:-/mnt/data/compose/gogirlabs}"

# Hosts and key paths stay in the shell, not in git.
if [[ -z "${HOMELAB_HOST:-}" || -z "${HOMELAB_SSH_KEY:-}" ]]; then
  echo -e "${RED}Set HOMELAB_HOST (user@host) and HOMELAB_SSH_KEY (private key path).${NC}"
  exit 1
fi
HOMELAB_USE_JUMP="${HOMELAB_USE_JUMP:-0}"
if [[ "$HOMELAB_USE_JUMP" == "1" && ( -z "${SSH_JUMP:-}" || -z "${SSH_JUMP_KEY:-}" ) ]]; then
  echo -e "${RED}Jump deploy needs SSH_JUMP and SSH_JUMP_KEY.${NC}"
  exit 1
fi

LOCAL_ENV="${LOCAL_ENV:-$REPO_ROOT/.env.homelab}"
RSYNC_DELETE="${RSYNC_DELETE:-0}"

if [[ ! -f "$HOMELAB_SSH_KEY" ]]; then
  echo -e "${RED}Error: HOMELAB_SSH_KEY not found: $HOMELAB_SSH_KEY${NC}"
  exit 1
fi

if [[ "$HOMELAB_USE_JUMP" == "1" && ! -f "$SSH_JUMP_KEY" ]]; then
  echo -e "${RED}Error: SSH_JUMP_KEY not found: $SSH_JUMP_KEY${NC}"
  exit 1
fi

# Build SSH/SCP/RSYNC transport. Jump uses ProxyCommand so each hop has its own key.
SSH_COMMON=(-o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -i "$HOMELAB_SSH_KEY")
if [[ "$HOMELAB_USE_JUMP" == "1" ]]; then
  SSH_COMMON+=(
    -o "ProxyCommand=ssh -i ${SSH_JUMP_KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -W %h:%p ${SSH_JUMP}"
  )
fi

run_ssh() {
  ssh "${SSH_COMMON[@]}" "$HOMELAB_HOST" "$@"
}

run_rsync() {
  local src="$1"
  local dest="$2"
  local -a rsync_opts
  rsync_opts=(-az)
  rsync_opts+=(--exclude '.git' --exclude '__pycache__' --exclude '*.pyc')
  rsync_opts+=(--exclude '.env' --exclude 'venv' --exclude '.venv' --exclude 'node_modules')
  if [[ "$RSYNC_DELETE" == "1" ]]; then
    rsync_opts+=(--delete)
  fi
  # shellcheck disable=SC2086
  rsync "${rsync_opts[@]}" -e "ssh ${SSH_COMMON[*]}" "$src" "$dest"
}

echo -e "${YELLOW}=========================================="
echo "Deploying Gogir Labs API (homelab)"
echo "Host: $HOMELAB_HOST"
echo "Remote: $REMOTE_DIR"
if [[ "$HOMELAB_USE_JUMP" == "1" ]]; then
  echo "Jump: $SSH_JUMP"
else
  echo "Jump: disabled"
fi
echo -e "==========================================${NC}"

if [[ ! -f "$REPO_ROOT/$COMPOSE_FILE" ]]; then
  echo -e "${RED}Error: $COMPOSE_FILE not found in $REPO_ROOT${NC}"
  exit 1
fi

if [[ ! -f "$LOCAL_ENV" ]]; then
  echo -e "${RED}Error: $LOCAL_ENV not found.${NC}"
  echo "Copy .env.homelab.example to .env.homelab and fill in secrets."
  exit 1
fi

echo -e "${YELLOW}Ensuring remote directories...${NC}"
run_ssh "mkdir -p '$REMOTE_DIR/gogir-labs-be' '/mnt/data/backups/gogirlabs' '/mnt/data/apps/gogirlabs/media'"

echo -e "${YELLOW}Syncing compose file...${NC}"
run_rsync "$REPO_ROOT/$COMPOSE_FILE" "$HOMELAB_HOST:$REMOTE_DIR/$COMPOSE_FILE"

echo -e "${YELLOW}Syncing backend...${NC}"
run_rsync "$REPO_ROOT/gogir-labs-be/" "$HOMELAB_HOST:$REMOTE_DIR/gogir-labs-be/"

echo -e "${YELLOW}Syncing env (mode 600)...${NC}"
scp "${SSH_COMMON[@]}" "$LOCAL_ENV" "$HOMELAB_HOST:$REMOTE_DIR/.env"
run_ssh "chmod 600 '$REMOTE_DIR/.env'"

echo -e "${YELLOW}Building and starting stack...${NC}"
run_ssh "cd '$REMOTE_DIR' && docker compose -f '$COMPOSE_FILE' --env-file .env up -d --build"

echo -e "${YELLOW}Waiting for backend health...${NC}"
sleep 8

echo -e "${YELLOW}Running migrations...${NC}"
run_ssh "cd '$REMOTE_DIR' && docker compose -f '$COMPOSE_FILE' --env-file .env exec -T backend python manage.py migrate --noinput"

echo -e "${YELLOW}Collecting static files...${NC}"
run_ssh "cd '$REMOTE_DIR' && docker compose -f '$COMPOSE_FILE' --env-file .env exec -T backend python manage.py collectstatic --noinput"

echo -e "${YELLOW}Service status:${NC}"
run_ssh "cd '$REMOTE_DIR' && docker compose -f '$COMPOSE_FILE' --env-file .env ps"

echo -e "${YELLOW}LAN API smoke (on host):${NC}"
bind_ip="$(grep -E '^HOMELAB_BIND_IP=' "$LOCAL_ENV" | tail -n 1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
if [[ "$bind_ip" =~ ^[0-9.]+$ ]]; then
  run_ssh "curl -sS -o /dev/null -w '%{http_code}\n' \"http://${bind_ip}:8001/api/v1/\" || true"
else
  echo "Set HOMELAB_BIND_IP in .env.homelab to smoke the LAN listener."
fi

echo -e "${GREEN}Deploy finished.${NC}"
echo "Next: ensure UFW allows 8001 from LAN, install nginx/homelab-api.gogirlabs.uk.conf on ikon"
echo "(replace API_LAN_HOST on the server only), and confirm DNS + Workers per docs/HOMELAB_API.md"
