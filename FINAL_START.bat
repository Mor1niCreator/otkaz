@echo off
echo ========================================
echo    ОТКАЗНИК - FINAL START
echo ========================================
echo.

echo Cleaning up everything...
docker stop otkaznik-app 2>nul
docker rm otkaznik-app 2>nul
docker rmi otkaznik:latest 2>nul
docker system prune -f

echo.
echo Building with simple Dockerfile...
docker build -f Dockerfile.simple -t otkaznik:latest .

if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    echo.
    echo Trying alternative build...
    docker build -t otkaznik:latest .
    
    if %errorlevel% neq 0 (
        echo ERROR: All builds failed!
        pause
        exit /b 1
    )
)

echo.
echo Starting application...
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
echo Health check: http://localhost:8080/api/health
echo.
echo To stop: docker stop otkaznik-app
echo To remove: docker rm otkaznik-app
echo.
echo Waiting 5 seconds for startup...
timeout /t 5 /nobreak >nul

echo Opening browser...
start http://localhost:8080

pause