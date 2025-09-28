from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, Entry, FXRate, CryptoData
from sqlalchemy import func
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("/")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "message": "Service is running"}


@router.get("/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Detailed health check with database stats"""
    
    try:
        # Get basic stats
        user_count = db.query(func.count(User.id)).scalar()
        entry_count = db.query(func.count(Entry.id)).scalar()
        fx_rate_count = db.query(func.count(FXRate.id)).scalar()
        crypto_data_count = db.query(func.count(CryptoData.id)).scalar()
        
        return {
            "status": "healthy",
            "database": "connected",
            "stats": {
                "users": user_count,
                "entries": entry_count,
                "fx_rates": fx_rate_count,
                "crypto_data": crypto_data_count
            }
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }