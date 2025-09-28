@echo off
echo Starting Otkaznik...
echo.

REM Remove any existing containers
docker compose down -v

REM Build and start
docker compose up --build

pause