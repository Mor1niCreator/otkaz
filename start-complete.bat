@echo off
echo ========================================
echo    ОТКАЗНИК - Complete Setup
echo ========================================
echo.

echo Step 1: Cleaning up...
docker stop otkaznik-app 2>nul
docker rm otkaznik-app 2>nul
docker rmi otkaznik:latest 2>nul
docker system prune -f

echo.
echo Step 2: Building application...
docker build -t otkaznik:latest .

if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Starting application...
docker run -d --name otkaznik-app -p 8080:8080 -v %cd%\data:/data otkaznik:latest

if %errorlevel% neq 0 (
    echo ERROR: Container start failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SUCCESS! Application is running
echo ========================================
echo.
echo Open your browser: http://localhost:8080
echo API docs: http://localhost:8080/api/docs
echo.
echo To stop: docker stop otkaznik-app
echo To remove: docker rm otkaznik-app
echo.
pause