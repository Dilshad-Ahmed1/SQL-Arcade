@echo off
REM SQLArcade MongoDB Setup Script for Windows

echo ========================================
echo SQLArcade MongoDB Setup
echo ========================================
echo.

REM Check if MongoDB is installed
where mongosh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo MongoDB is not installed or not in PATH.
    echo.
    echo Please install MongoDB Community Edition:
    echo 1. Visit: https://www.mongodb.com/try/download/community
    echo 2. Download and run the installer
    echo 3. Choose "Install MongoDB as a Service"
    echo 4. Complete the installation
    echo.
    pause
    exit /b 1
)

echo ✓ MongoDB found
echo.

REM Check if MongoDB service is running
sc query MongoDB >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Checking MongoDB service status...
    for /f "tokens=3" %%A in ('sc query MongoDB ^| findstr "STATE"') do set SERVICE_STATE=%%A
    
    if "!SERVICE_STATE!"=="RUNNING" (
        echo ✓ MongoDB service is running
    ) else (
        echo MongoDB service is not running. Starting...
        net start MongoDB
        if %ERRORLEVEL% EQU 0 (
            echo ✓ MongoDB service started successfully
        ) else (
            echo ✗ Failed to start MongoDB service
            pause
            exit /b 1
        )
    )
) else (
    echo MongoDB service not found. Please install MongoDB Community Edition.
    pause
    exit /b 1
)

echo.
echo ========================================
echo MongoDB Setup Complete!
echo ========================================
echo.
echo Connection string: mongodb://localhost:27017/sqlarcade
echo.
echo Next steps:
echo 1. Create .env.local file in project root
echo 2. Add: MONGODB_URI=mongodb://localhost:27017/sqlarcade
echo 3. Run: npm install
echo 4. Run: npm run dev
echo.
echo For MongoDB Atlas (cloud):
echo 1. Visit: https://www.mongodb.com/cloud/atlas
echo 2. Create free account and cluster
echo 3. Get connection string
echo 4. Update .env.local with connection string
echo.
pause
