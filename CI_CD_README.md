# CI/CD Pipeline Documentation

## Overview

This project implements a comprehensive CI/CD pipeline using GitHub Actions with separate workflows for Continuous Integration, Continuous Deployment, and Code Quality checks.

## Pipeline Architecture

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Trigger**: Runs on every push and pull request to `main` or `develop` branches

**Workflow**:
```
┌─────────────────────────────────────────┐
│         CI Pipeline Execution           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Backend Tests                    │ │
│  │  - Setup PostgreSQL              │ │
│  │  - Install dependencies          │ │
│  │  - Run migrations                │ │
│  │  - Execute pytest (170 tests)    │ │
│  │  - Generate coverage report      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Frontend Tests                   │ │
│  │  - Setup Node.js                  │ │
│  │  - Install dependencies           │ │
│  │  - Run linter                    │ │
│  │  - Run type check                │ │
│  │  - Execute Jest (32 tests)       │ │
│  │  - Generate coverage report      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Security Scan                    │ │
│  │  - Run Trivy scanner             │ │
│  │  - Upload to GitHub Security     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Build Docker Images (on push)    │ │
│  │  - Build backend image           │ │
│  │  - Build frontend image          │ │
│  │  - Push to Docker Hub            │ │
│  │  - Tag with latest + commit SHA  │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Features**:
- Parallel job execution for faster CI
- Database service for backend tests
- Coverage reporting to Codecov
- Docker image caching for faster builds
- Security vulnerability scanning

### 2. CD Pipeline (`.github/workflows/cd.yml`)

**Trigger**: Runs on push to `main` branch or manual workflow dispatch

**Workflow**:
```
┌─────────────────────────────────────────┐
│         CD Pipeline Execution           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Deploy to Staging                │ │
│  │  - SSH to staging server          │ │
│  │  - Pull latest images             │ │
│  │  - Run docker-compose up          │ │
│  │  - Execute migrations             │ │
│  │  - Collect static files           │ │
│  │  - Run smoke tests               │ │
│  └───────────────────────────────────┘ │
│              │                           │
│              │ Success                    │
│              ▼                           │
│  ┌───────────────────────────────────┐ │
│  │  Deploy to Production              │ │
│  │  - Create database backup          │ │
│  │  - SSH to production server        │ │
│  │  - Pull latest images              │ │
│  │  - Run docker-compose up           │ │
│  │  - Execute migrations              │ │
│  │  - Collect static files            │ │
│  │  - Run health checks              │ │
│  │  - Send Slack notification        │ │
│  │  - Rollback on failure            │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Features**:
- Staged deployment (staging → production)
- Automatic database backups before production deploy
- Health checks after deployment
- Automatic rollback on failure
- Slack notifications

### 3. Code Quality Pipeline (`.github/workflows/code-quality.yml`)

**Trigger**: Runs on every push and pull request

**Workflow**:
```
┌─────────────────────────────────────────┐
│      Code Quality Checks                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Backend Linting                   │ │
│  │  - Black (code formatting)        │ │
│  │  - isort (import sorting)         │ │
│  │  - Flake8 (linting)               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Frontend Linting                 │ │
│  │  - ESLint                         │ │
│  │  - Prettier                       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Required GitHub Secrets

Configure these in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Docker Hub
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

### Staging Server
- `STAGING_HOST`: Staging server IP address or hostname
- `STAGING_USER`: SSH username for staging server
- `STAGING_SSH_KEY`: SSH private key for staging server

### Production Server
- `PRODUCTION_HOST`: Production server IP address or hostname
- `PRODUCTION_USER`: SSH username for production server
- `PRODUCTION_SSH_KEY`: SSH private key for production server

### Notifications (Optional)
- `SLACK_WEBHOOK_URL`: Slack webhook URL for deployment notifications

## Setting Up SSH Keys

### Generate SSH Key Pair

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
```

### Add Public Key to Server

```bash
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server.com
```

### Add Private Key to GitHub Secrets

1. Copy the private key:
```bash
cat ~/.ssh/github_actions
```

2. Go to GitHub → Settings → Secrets → Actions
3. Add new secret: `STAGING_SSH_KEY` or `PRODUCTION_SSH_KEY`
4. Paste the entire private key content

## Pipeline Execution Flow

### On Pull Request
1. CI Pipeline runs (tests, linting, security scan)
2. Code Quality Pipeline runs
3. PR cannot be merged if any check fails

### On Push to Main
1. CI Pipeline runs (tests, builds images)
2. Code Quality Pipeline runs
3. CD Pipeline triggers:
   - Deploys to staging
   - If successful, deploys to production

### Manual Deployment
1. Go to Actions tab in GitHub
2. Select "CD Pipeline"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Monitoring Pipeline Status

### GitHub Actions Dashboard
- View all workflow runs: `https://github.com/your-org/your-repo/actions`
- View specific workflow: Click on workflow name
- View job logs: Click on job name

### Pipeline Status Badge

Add to your README:
```markdown
![CI](https://github.com/your-org/your-repo/workflows/CI%20Pipeline/badge.svg)
```

## Troubleshooting

### CI Pipeline Fails

**Backend Tests Failing**:
- Check PostgreSQL service is running
- Verify database credentials
- Check test logs for specific errors

**Frontend Tests Failing**:
- Verify Node.js version matches
- Check for dependency issues
- Review test logs

**Docker Build Failing**:
- Check Dockerfile syntax
- Verify build context
- Check for missing files

### CD Pipeline Fails

**SSH Connection Issues**:
- Verify SSH key is correct
- Check server firewall rules
- Ensure SSH service is running

**Deployment Fails**:
- Check server disk space
- Verify Docker is installed
- Review server logs

**Health Checks Failing**:
- Verify services are running
- Check port availability
- Review application logs

## Best Practices

1. **Never commit secrets**: Use GitHub Secrets
2. **Test locally first**: Run tests before pushing
3. **Review PRs carefully**: Ensure all checks pass
4. **Monitor deployments**: Watch for errors
5. **Keep backups**: Regular database backups
6. **Update dependencies**: Regular security updates
7. **Review logs**: Check pipeline logs regularly

## Pipeline Optimization

### Caching
- Docker layer caching enabled
- npm cache for frontend
- pip cache for backend

### Parallel Execution
- Backend and frontend tests run in parallel
- Code quality checks run in parallel

### Conditional Execution
- Docker builds only on push (not PR)
- Production deploy only after staging success

## Next Steps

1. Configure GitHub Secrets
2. Set up staging server
3. Set up production server
4. Test CI pipeline with a PR
5. Test CD pipeline with a push to main
6. Monitor first production deployment

