@echo off
REM Velora AI - Docker Setup Script for Windows
REM This script sets up the entire project with Docker

echo.
echo ========================================
echo   Velora AI Docker Setup
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker found: 
docker --version
echo.

REM Navigate to backend
cd backend
if errorlevel 1 (
    echo [ERROR] Could not navigate to backend directory
    pause
    exit /b 1
)

echo [1/5] Checking for .env file...
if not exist .env (
    echo [CREATING] .env file from template
    if exist .env.example (
        copy .env.example .env
        echo [OK] .env file created. Please edit it with your API keys.
    ) else (
        echo [WARNING] .env.example not found. Creating basic .env...
        (
            echo DATABASE_URL=postgresql+asyncpg://velora:velora_password@postgres:5432/velora_db
            echo REDIS_URL=redis://redis:6379/0
            echo SECRET_KEY=your-secret-key-change-this-to-32-characters-minimum
            echo GEMINI_API_KEY=your-gemini-api-key
            echo BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
            echo ENVIRONMENT=development
            echo DEBUG=True
        ) > .env
        echo [OK] .env file created with defaults
    )
) else (
    echo [OK] .env file already exists
)
echo.

echo [2/5] Checking Docker daemon...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker daemon is not running
    echo Please start Docker Desktop
    pause
    exit /b 1
)
echo [OK] Docker daemon is running
echo.

echo [3/5] Building images...
docker-compose build
if errorlevel 1 (
    echo [ERROR] Failed to build Docker images
    pause
    exit /b 1
)
echo [OK] Images built successfully
echo.

echo [4/5] Starting services...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services
    docker-compose logs
    pause
    exit /b 1
)
echo [OK] Services started
echo.

timeout /t 5 /nobreak
echo [5/5] Verifying services...

REM Check if backend is responding
for /l %%i in (1,1,30) do (
    curl -s http://localhost:8000/health >nul 2>&1
    if errorlevel 0 (
        echo [OK] Backend is responding
        goto success
    )
    echo [WAITING] Attempt %%i/30 - waiting for backend to start...
    timeout /t 1 /nobreak
)

echo [WARNING] Backend not responding yet. Checking logs...
docker-compose logs backend
goto end

:success
echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo Services running:
docker-compose ps
echo.
echo Next steps:
echo 1. Edit .env with your API keys
echo 2. View logs: docker-compose logs -f backend
echo 3. API Docs: http://localhost:8000/docs
echo 4. ReDoc: http://localhost:8000/redoc
echo.
echo Create your first user in Swagger UI:
echo - POST /api/v1/auth/register
echo.
echo Happy coding! 🚀
echo.

:end
cd ..
pause
