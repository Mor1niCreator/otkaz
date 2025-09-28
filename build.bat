@echo off
echo ========================================
echo    ОТКАЗНИК - Building Application
echo ========================================
echo.

echo Disabling Docker buildx...
docker buildx prune -f

echo.
echo Building image directly...
docker build -t otkaznik:latest .

echo.
echo Starting container...
docker run -d --name otkaznik-app -p 8080:8080 -v %cd%\data:/data otkaznik:latest

echo.
echo Application started!
echo Open browser: http://localhost:8080
echo.
echo To stop: docker stop otkaznik-app
echo To remove: docker rm otkaznik-app
echo.
pause