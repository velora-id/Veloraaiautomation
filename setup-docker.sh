#!/bin/bash

# Velora AI - Docker Setup Script for Mac/Linux
# This script sets up the entire project with Docker

set -e

echo ""
echo "========================================"
echo "  Velora AI Docker Setup"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "[OK] Docker found:"
docker --version
echo ""

# Check if Docker daemon is running
if ! docker ps &> /dev/null; then
    echo "[ERROR] Docker daemon is not running"
    echo "Please start Docker Desktop"
    exit 1
fi
echo "[OK] Docker daemon is running"
echo ""

# Navigate to backend
if [ ! -d "backend" ]; then
    echo "[ERROR] backend directory not found"
    exit 1
fi

cd backend

echo "[1/5] Checking for .env file..."
if [ ! -f .env ]; then
    echo "[CREATING] .env file from template"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "[OK] .env file created. Please edit it with your API keys."
    else
        echo "[WARNING] .env.example not found. Creating basic .env..."
        cat > .env << EOF
DATABASE_URL=postgresql+asyncpg://velora:velora_password@postgres:5432/velora_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-secret-key-change-this-to-32-characters-minimum
GEMINI_API_KEY=your-gemini-api-key
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
ENVIRONMENT=development
DEBUG=True
EOF
        echo "[OK] .env file created with defaults"
    fi
else
    echo "[OK] .env file already exists"
fi
echo ""

echo "[2/5] Building images..."
docker-compose build
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to build Docker images"
    exit 1
fi
echo "[OK] Images built successfully"
echo ""

echo "[3/5] Starting services..."
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to start services"
    docker-compose logs
    exit 1
fi
echo "[OK] Services started"
echo ""

echo "[4/5] Waiting for services to be ready..."
sleep 5

echo "[5/5] Verifying services..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "[OK] Backend is responding"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "[WARNING] Backend not responding. Checking logs..."
        docker-compose logs backend
    else
        echo "[WAITING] Attempt $i/30 - waiting for backend to start..."
        sleep 1
    fi
done

echo ""
echo "========================================"
echo "  Setup Complete! 🎉"
echo "========================================"
echo ""
echo "Services running:"
docker-compose ps
echo ""
echo "Next steps:"
echo "1. Edit .env with your API keys (if needed)"
echo "2. View logs: docker-compose logs -f backend"
echo "3. API Docs: http://localhost:8000/docs"
echo "4. ReDoc: http://localhost:8000/redoc"
echo ""
echo "Create your first user in Swagger UI:"
echo "- POST /api/v1/auth/register"
echo ""
echo "Happy coding! 🚀"
echo ""

cd ..
