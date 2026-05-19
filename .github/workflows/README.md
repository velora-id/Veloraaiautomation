# GitHub Workflows Documentation

This directory contains GitHub Actions workflows for the Velora AI automation framework. These workflows automate testing, building, and deployment processes.

## 📋 Available Workflows

### 1. **CI Pipeline** (`ci.yml`)
Main continuous integration workflow that runs on every push and pull request.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- ✅ Frontend build and verification
- ✅ Backend tests with Python 3.11
- ✅ CI status check

**Duration:** ~5-10 minutes

---

### 2. **Frontend CI** (`frontend-ci.yml`)
Dedicated frontend testing and build workflow.

**Triggers:**
- Changes to frontend files
- Changes to package.json or pnpm-lock.yaml
- Changes to Vite configuration

**Jobs:**
- Node.js 20.x and 22.x matrix testing
- Dependency installation with pnpm
- Build with Vite
- Build artifact upload

**Requirements:**
- Node.js (20.x or 22.x)
- pnpm (v11+)

---

### 3. **Backend CI** (`backend-ci.yml`)
Dedicated backend testing and Docker build workflow.

**Triggers:**
- Changes to backend directory
- Changes to requirements.txt

**Jobs:**
- Python 3.11 and 3.12 matrix testing
- Service setup (PostgreSQL 15, Redis 7)
- Unit tests with pytest
- Docker image build

**Requirements:**
- Python (3.11 or 3.12)
- PostgreSQL 15
- Redis 7

---

### 4. **Tests** (`tests.yml`)
Comprehensive testing workflow with integration tests.

**Triggers:**
- Push to main/develop
- Pull requests
- Weekly schedule (Sunday 2 AM UTC)

**Jobs:**
- Frontend tests
- Backend unit tests
- Integration tests
- API endpoint testing

---

### 5. **Code Quality** (`code-quality.yml`)
Code quality analysis and vulnerability checking.

**Jobs:**
- Dependency vulnerability scanning
- Code statistics analysis
- Security checks

---

### 6. **Security** (`security.yml`)
Advanced security scanning and compliance checks.

**Triggers:**
- Every push to main/develop
- Pull requests
- Weekly schedule (Sunday 3 AM UTC)

**Jobs:**
- Dependency security audit (Safety, Bandit)
- CodeQL analysis (JavaScript & Python)
- Secret scanning (TruffleHog)
- Code linting (Black, Flake8, PyLint)

---

### 7. **Deploy** (`deploy.yml`)
Automated deployment workflow.

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
- Build and deploy frontend to GitHub Pages (optional)
- Build and push backend Docker image to GitHub Container Registry
- Deployment notifications

**Requirements:**
- GitHub Pages enabled (optional)
- Container Registry credentials configured

---

## 🚀 Usage

### Running Workflows

#### Manually Trigger a Workflow
```bash
# Via GitHub CLI
gh workflow run deploy.yml --ref main

# Or use GitHub Actions UI:
# 1. Go to Actions tab
# 2. Select workflow
# 3. Click "Run workflow"
```

#### View Workflow Status
```bash
gh workflow view ci.yml
gh run list --workflow ci.yml
```

#### View Run Details
```bash
gh run view <run-id>
gh run view <run-id> --log
```

---

## 🔧 Configuration

### Environment Variables
Set in `.github/workflows/*.yml` or GitHub Secrets:

```yaml
VITE_API_BASE_URL: http://localhost:8000
FRONTEND_API_URL: https://api.example.com
```

### GitHub Secrets (Optional for Deployment)
Navigate to **Settings > Secrets and variables > Actions**:

```
- CONTAINER_REGISTRY_TOKEN: <your-registry-token>
- FRONTEND_DOMAIN: your-domain.com
- DEPLOYMENT_SERVER: your-server.com
- DEPLOYMENT_USER: username
- DEPLOYMENT_KEY: <ssh-private-key>
```

### Customize Workflows

#### Add Python Version Matrix
```yaml
strategy:
  matrix:
    python-version: ['3.10', '3.11', '3.12']
```

#### Add Node.js Version Matrix
```yaml
strategy:
  matrix:
    node-version: ['18.x', '20.x', '22.x']
```

#### Change Trigger Events
```yaml
on:
  push:
    branches: [main, develop, staging]
  pull_request:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

---

## 📊 Workflow Artifacts

### Frontend Build
- **Location:** `dist/` directory
- **Retention:** 1-7 days
- **Size:** ~2-5 MB (typical)

### Backend Docker Image
- **Registry:** GitHub Container Registry (ghcr.io)
- **Tag:** `latest`, branch name, SHA, version
- **Retention:** 90 days (default)

### Security Reports
- **Bandit Report:** `backend/bandit-report.json`
- **Coverage Report:** `backend/coverage.xml`
- **Retention:** 7 days

---

## ⚠️ Troubleshooting

### Build Failures

**Frontend build fails:**
```bash
# Clear cache locally
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

**Backend tests fail:**
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run tests locally
pytest backend/app -v

# Check database connection
psql postgresql://user:password@localhost:5432/velora_db
```

### Workflow Timeouts
- Increase timeout in workflow file:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Increase from default 360
```

### Caching Issues
Clear GitHub Actions cache:
```bash
gh actions-cache list
gh actions-cache delete <cache-key>
```

---

## 📈 Monitoring

### View Workflow Runs
```bash
# List all runs
gh run list

# List runs for specific workflow
gh run list --workflow frontend-ci.yml

# Show last run status
gh run list --limit 1
```

### Set Notifications
1. Go to GitHub **Settings > Notifications**
2. Enable "Workflows"
3. Choose notification preferences

---

## 🔐 Security Best Practices

1. **Secrets Management**
   - Use GitHub Secrets for sensitive data
   - Never commit `.env` files
   - Rotate tokens regularly

2. **Dependency Updates**
   - Enable Dependabot in Settings
   - Review security alerts weekly
   - Keep Python and Node.js updated

3. **Code Review**
   - Require reviews before merge
   - Run all checks before merging
   - Monitor CI/CD logs for warnings

4. **Docker Security**
   - Use official base images
   - Scan images with Trivy
   - Update images regularly

---

## 📝 Examples

### Running Frontend Build Locally
```bash
pnpm install
pnpm build
```

### Running Backend Tests Locally
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# With Docker services
docker-compose up -d postgres redis
pytest app/ -v
```

### Building Docker Image
```bash
docker build -t velora-backend:latest ./backend
docker run -p 8000:8000 velora-backend:latest
```

---

## 📞 Support

For issues or questions:
1. Check GitHub Actions logs
2. Review workflow files for syntax errors
3. Consult GitHub Actions documentation: https://docs.github.com/en/actions

---

**Last Updated:** 2026-05-17
**Workflows Status:** ✅ All configured and ready to use
