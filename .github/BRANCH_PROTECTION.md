# GitHub Workflows - Branch Protection Configuration

This guide explains how to set up branch protection rules with required status checks in GitHub.

## Steps to Configure Branch Protection

### 1. Access Repository Settings
1. Go to your GitHub repository
2. Click **Settings** (gear icon)
3. In the left sidebar, click **Branches**
4. Click **Add rule** or edit existing rule

### 2. Create Branch Protection Rule

**Branch name pattern:** `main`

Then configure the following options:

### 3. Require Status Checks
✅ **Enable:**
- Require status checks to pass before merging
- Require branches to be up to date before merging

**Select status checks to require:**
- `frontend-ci / Frontend - Build & Test`
- `backend-ci / Backend - Test & Build`
- `status / CI Status Check`
- `tests / Frontend Tests`
- `tests / Backend Tests`
- `code-quality / quality-check`

### 4. Require Code Reviews
✅ **Enable:**
- Require pull request reviews before merging
- Require review from Code Owners
- Dismiss stale pull request approvals when new commits are pushed
- Require conversation resolution before merging

**Number of reviewers:** 1+

### 5. Additional Rules
✅ **Enable:**
- Require commits to be signed
- Include administrators (optional)
- Allow force pushes: No
- Allow deletions: No

---

## Workflow Status Check Reference

| Workflow | Job | Status Check Name |
|----------|-----|-------------------|
| ci.yml | frontend-ci | `frontend-ci / Frontend - Build & Test` |
| ci.yml | backend-ci | `backend-ci / Backend - Test & Build` |
| ci.yml | status | `status / CI Status Check` |
| tests.yml | frontend-test | `tests / Frontend Tests` |
| tests.yml | backend-test | `tests / Backend Tests` |
| tests.yml | integration-test | `tests / Integration Tests` |
| code-quality.yml | quality-check | `code-quality / quality-check` |
| security.yml | dependency-check | `security / Dependency Security Check` |
| security.yml | codeql | `security / CodeQL Analysis` |

---

## Development Branch Protection (`develop`)

Recommended settings for development branch:

**Branch name pattern:** `develop`

- ✅ Require status checks to pass
- ✅ Require 1 review
- ❌ Do not require signed commits
- ❌ Do not include administrators

---

## Enforce Rules via GitHub API

```bash
# Authenticate with GitHub CLI
gh auth login

# Create branch protection rule (main)
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_status_checks='{"strict":true,"contexts":["frontend-ci / Frontend - Build & Test","backend-ci / Backend - Test & Build","status / CI Status Check"]}' \
  -f required_pull_request_reviews='{"dismissal_restrictions":{},"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"required_approving_review_count":1}' \
  -f enforce_admins=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false

# Verify protection
gh api repos/{owner}/{repo}/branches/main/protection
```

---

## Troubleshooting

### Status checks not appearing
1. Ensure workflows have been triggered at least once
2. Check workflow YAML syntax
3. Verify branch pattern matches (e.g., `main` vs `master`)
4. Wait 5-10 minutes for GitHub to sync

### PR blocked by required checks
1. Push commits that trigger the workflows
2. Wait for all workflows to complete
3. Ensure all checks pass (green checkmark)
4. If failed, click "Details" to view logs

### Remove a status check requirement
1. Go to **Settings > Branches**
2. Edit the branch protection rule
3. Uncheck the status check
4. Scroll down and click **Save changes**

---

## Recommended Status Checks

### Minimum (Recommended)
- ✅ `CI Status Check` - Overall pipeline status

### Standard
- ✅ Frontend build check
- ✅ Backend tests check
- ✅ CodeQL analysis

### Comprehensive
- ✅ All frontend checks
- ✅ All backend checks
- ✅ Security checks
- ✅ Integration tests
- ✅ Code quality checks

---

## GitHub Branch Protection API

Reference: https://docs.github.com/en/rest/branches/branch-protection

---

**Last Updated:** 2026-05-17
