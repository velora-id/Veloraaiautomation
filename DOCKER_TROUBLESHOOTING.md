# 🐳 Docker Installation & Troubleshooting Guide

## ⚠️ Docker Daemon Not Running?

If Docker commands hang or fail, **Docker Desktop is not running**.

### Windows: Start Docker Desktop

**Option 1: Start from Applications**
1. Press `Windows + R`
2. Type: `docker-desktop`
3. Press Enter

**Option 2: Start from Terminal**
```powershell
# Start Docker Desktop
& 'C:\Program Files\Docker\Docker\Docker.exe'

# Wait for it to start (takes 30-60 seconds)
# You'll see Docker icon in system tray
```

**Option 3: Start Automatically**
1. Open Settings → Apps → Startup
2. Find "Docker Desktop"
3. Toggle "On"

### Mac: Start Docker Desktop

**Option 1: From Applications**
1. Open Finder
2. Go to Applications
3. Double-click "Docker.app"

**Option 2: From Terminal**
```bash
open -a Docker
# Wait 30-60 seconds for Docker to start
```

### Linux: Start Docker Service

```bash
# Start Docker daemon
sudo systemctl start docker

# Enable on boot
sudo systemctl enable docker

# Verify
sudo systemctl status docker
```

---

## ✅ Verify Docker is Running

```bash
# Should return Docker version immediately
docker --version
docker ps  # Should show running containers (empty list is OK)
```

---

## 🚀 Quick Docker Setup Steps

### Step 1: Navigate to Project

```bash
cd Veloraaiautomation
cd backend
```

### Step 2: Create .env file

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### Step 3: Start All Services

```bash
docker-compose up -d
```

### Step 4: Check Status

```bash
docker-compose ps

# Should show 3 containers:
# velora_postgres    Up
# velora_redis       Up
# velora_backend     Up
```

### Step 5: Test Backend

```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","app":"Velora AI","version":"1.0.0"}
```

### Step 6: Access APIs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🔧 Useful Docker Commands

### View Containers

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Show container details
docker-compose ps
```

### View Logs

```bash
# Follow backend logs
docker-compose logs -f backend

# View specific container
docker logs velora_backend

# View all logs
docker-compose logs
```

### Stop Services

```bash
# Stop without deleting
docker-compose stop

# Stop specific service
docker-compose stop backend

# Stop and remove containers
docker-compose down

# Stop, remove, and delete volumes (WARNING: deletes database!)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose build
docker-compose up -d
```

### Run Commands in Container

```bash
# Open bash shell in backend
docker-compose exec backend bash

# Run Python command
docker-compose exec backend python -m pytest

# Run Python with specific file
docker-compose exec backend python app/main.py
```

---

## 🐛 Common Issues & Fixes

### Issue: "docker: command not found"

**Cause:** Docker not installed or not in PATH

**Solution:**
```bash
# Install Docker Desktop: https://www.docker.com/products/docker-desktop

# Or verify installation
which docker  # Mac/Linux
where docker  # Windows
```

### Issue: "Cannot connect to Docker daemon"

**Cause:** Docker Desktop not running

**Solution:**
```bash
# Windows: Start Docker Desktop
& 'C:\Program Files\Docker\Docker\Docker.exe'

# Mac: Open Docker
open -a Docker

# Linux: Start service
sudo systemctl start docker
```

### Issue: "Port 8000 already in use"

**Solution 1: Stop existing service**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8000
kill -9 <PID>
```

**Solution 2: Use different port**

Edit `docker-compose.yml`:
```yaml
backend:
  ports:
    - "8001:8000"  # Use 8001 locally instead of 8000
```

### Issue: "PostgreSQL connection refused"

**Cause:** Database not ready yet

**Solution:**
```bash
# Restart database
docker-compose restart postgres

# Wait 10 seconds
# Try again
curl http://localhost:8000/health
```

### Issue: "Cannot find .env file"

**Solution:**
```bash
# Navigate to backend directory
cd backend

# Create from template
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux

# Restart
docker-compose restart
```

### Issue: "Out of disk space"

**Solution:**
```bash
# Clean up unused Docker resources
docker system prune

# Remove images and volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Issue: "Container exits immediately"

**Solution:**
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitor Docker Performance

```bash
# Show container stats
docker stats

# Show image sizes
docker images

# Show disk usage
docker system df

# Show container history
docker history velora_backend
```

---

## 🔐 Docker Security Best Practices

1. **Never commit .env to Git**
   ```bash
   # .gitignore should contain:
   # .env
   # .env.local
   ```

2. **Use strong secrets**
   ```bash
   # Generate a strong secret key
   openssl rand -hex 32  # Mac/Linux
   ```

3. **Don't run as root** (already done in Dockerfile)

4. **Keep images updated**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

---

## 📚 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/reference/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🆘 Still Having Issues?

1. **Check Docker status:**
   ```bash
   docker --version
   docker ps
   ```

2. **View detailed logs:**
   ```bash
   docker-compose logs --tail=50 backend
   ```

3. **Rebuild everything:**
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up -d
   ```

4. **Check system resources:**
   - Ensure 4GB+ RAM available
   - Ensure 2GB+ free disk space
   - Close other resource-heavy applications

---

**Need more help? Check [DOCKER_SETUP.md](DOCKER_SETUP.md) for complete setup guide!**
