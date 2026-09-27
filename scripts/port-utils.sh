#!/usr/bin/env bash
# Portable helpers: find a free TCP port on the host (macOS / Linux with lsof or ss).

port_in_use() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    lsof -iTCP:"$port" -sTCP:LISTEN -P -n >/dev/null 2>&1
    return $?
  fi
  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "$port" >/dev/null 2>&1
    return $?
  fi
  # Last resort: bash TCP probe (open port often accepts)
  (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1
}

# Prints first free port in [start, start+max_tries] or returns 1.
find_free_port() {
  local start=${1:-3000}
  local max_tries=${2:-200}
  local p="$start"
  local end=$((start + max_tries))
  while [ "$p" -le "$end" ]; do
    if ! port_in_use "$p"; then
      echo "$p"
      return 0
    fi
    p=$((p + 1))
  done
  return 1
}

# Respects explicit env override if that port is free; otherwise scans from default_start.
pick_host_port() {
  local default_start=$1
  local explicit=${2:-}
  if [ -n "$explicit" ]; then
    if ! port_in_use "$explicit"; then
      echo "$explicit"
      return 0
    fi
    echo -e "\033[1;33m⚠️  Port ${explicit} is in use; picking another port starting from ${default_start}...\033[0m" >&2
  fi
  find_free_port "$default_start" || return 1
}
