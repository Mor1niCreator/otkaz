# 🔧 Troubleshooting Guide

## Windows Docker Issues

### "file already closed" Error
This is usually a Docker buildx issue. Try these solutions:

1. **Use the provided scripts:**
   ```cmd
   start.bat
   ```
   or
   ```powershell
   .\start.ps1
   ```

2. **Manual cleanup and rebuild:**
   ```cmd
   docker compose down -v
   docker system prune -f
   docker compose up --build
   ```

3. **Reset Docker buildx:**
   ```cmd
   docker buildx prune -f
   docker compose up --build
   ```

### UTF-8 BOM Error in .env
If you see "unexpected character '\ufeff'":

1. **PowerShell 7+ (recommended):**
   ```powershell
   pwsh -c "(Get-Content .env -Raw) | Set-Content .env -Encoding utf8NoBOM"
   ```

2. **Windows PowerShell 5.1:**
   ```powershell
   $c = Get-Content .env -Raw
   [IO.File]::WriteAllText('.env', $c, (New-Object System.Text.UTF8Encoding($false)))
   ```

3. **Manual fix:**
   - Open .env in VS Code or Notepad++
   - Save as UTF-8 without BOM
   - Or delete .env and recreate it

### Port Already in Use
If port 8080 is busy:

1. **Find what's using the port:**
   ```cmd
   netstat -ano | findstr :8080
   ```

2. **Kill the process:**
   ```cmd
   taskkill /PID <PID_NUMBER> /F
   ```

3. **Or change the port in docker-compose.yml:**
   ```yaml
   ports:
     - "8081:8080"  # Use 8081 instead
   ```

## Build Issues

### Node.js Installation Failed
If Node.js installation fails in Docker:

1. **Clear Docker cache:**
   ```cmd
   docker builder prune -f
   ```

2. **Rebuild without cache:**
   ```cmd
   docker compose build --no-cache
   ```

### Python Dependencies Failed
If pip install fails:

1. **Check requirements.txt exists**
2. **Rebuild the image:**
   ```cmd
   docker compose down
   docker compose up --build
   ```

## Runtime Issues

### Database Migration Failed
If Alembic migration fails:

1. **Check data directory permissions**
2. **Remove data directory and restart:**
   ```cmd
   rmdir /s data
   docker compose up --build
   ```

### Frontend Not Loading
If the frontend doesn't load:

1. **Check if static files were built:**
   ```cmd
   docker compose exec app ls -la /app/static/
   ```

2. **Rebuild frontend:**
   ```cmd
   docker compose exec app sh -c "cd frontend && npm run build"
   ```

### API Not Responding
If API calls fail:

1. **Check container logs:**
   ```cmd
   docker compose logs app
   ```

2. **Test health endpoint:**
   ```cmd
   curl http://localhost:8080/api/health
   ```

## Quick Fixes

### Complete Reset
If nothing works, do a complete reset:

```cmd
docker compose down -v
docker system prune -f
docker volume prune -f
docker compose up --build
```

### Check Docker Status
```cmd
docker --version
docker compose --version
docker ps
```

### Verify Files
Make sure these files exist:
- Dockerfile
- docker-compose.yml
- requirements.txt
- frontend/package.json
- app/main.py

## Still Having Issues?

1. **Check Docker Desktop is running**
2. **Restart Docker Desktop**
3. **Update Docker Desktop**
4. **Check Windows version compatibility**
5. **Try WSL2 backend in Docker Desktop**

## Success Indicators

When everything works, you should see:
- Container starts without errors
- Database migrations complete
- Frontend builds successfully
- Server starts on port 8080
- http://localhost:8080 loads the app
- API docs available at http://localhost:8080/api/docs