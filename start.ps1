Write-Host "Starting Otkaznik..." -ForegroundColor Green
Write-Host ""

# Remove any existing containers
Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
docker compose down -v

# Build and start
Write-Host "Building and starting application..." -ForegroundColor Yellow
docker compose up --build

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")