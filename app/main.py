from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.gzip import GZipMiddleware
import os
from .middleware import setup_middleware
from .routers import (
    auth, users, entries, goals, presets, stats, 
    referrals, fx, crypto, export, health
)
from .config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Отказник - Refusal Tracker",
    description="Track your daily refusals and see crypto ROI potential",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Setup middleware
setup_middleware(app)

# Add gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include API routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(entries.router)
app.include_router(goals.router)
app.include_router(presets.router)
app.include_router(stats.router)
app.include_router(referrals.router)
app.include_router(fx.router)
app.include_router(crypto.router)
app.include_router(export.router)
app.include_router(health.router)

# Mount static files (built frontend)
if os.path.exists("/app/static"):
    app.mount("/static", StaticFiles(directory="/app/static"), name="static")

# Serve frontend files
@app.get("/")
async def serve_frontend():
    """Serve the main frontend page"""
    if os.path.exists("/app/static/index.html"):
        return FileResponse("/app/static/index.html")
    else:
        return {"message": "Frontend not built yet. Run 'npm run build' in frontend directory."}

@app.get("/manifest.json")
async def serve_manifest():
    """Serve PWA manifest"""
    if os.path.exists("/app/static/manifest.json"):
        return FileResponse("/app/static/manifest.json")
    else:
        return {"message": "Manifest not found"}

@app.get("/sw.js")
async def serve_service_worker():
    """Serve service worker"""
    if os.path.exists("/app/static/sw.js"):
        return FileResponse("/app/static/sw.js")
    else:
        return {"message": "Service worker not found"}

# Catch-all route for SPA
@app.get("/{path:path}")
async def serve_spa(path: str):
    """Serve SPA for all other routes"""
    if os.path.exists("/app/static/index.html"):
        return FileResponse("/app/static/index.html")
    else:
        return {"message": "Frontend not built yet"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)