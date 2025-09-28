@echo off
echo ========================================
echo    ОТКАЗНИК - Refusal Tracker
echo ========================================
echo.

echo Очистка старых контейнеров...
docker compose down -v

echo.
echo Сборка и запуск приложения...
docker compose up --build

echo.
echo Приложение запущено!
echo Откройте браузер: http://localhost:8080
echo.
pause