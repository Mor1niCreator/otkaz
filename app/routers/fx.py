from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from datetime import datetime
from ..models import User, FXRate
from ..schemas import FXRatesResponse, FXRateResponse
from ..fx import fx_manager
from ..config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/fx", tags=["fx"])


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Get current user from session"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user


@router.get("/rates")
async def get_fx_rates(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current FX rates"""
    
    try:
        # Get rates from manager
        rates = await fx_manager.get_rates(db)
        
        # Convert to response format
        rate_responses = []
        for currency, rate in rates.items():
            rate_responses.append(FXRateResponse(
                currency=currency,
                rate_to_usd=rate,
                provider=settings.fx_primary,
                cached_at=datetime.utcnow()
            ))
        
        return FXRatesResponse(
            base="USD",
            rates=rate_responses,
            cached_at=datetime.utcnow()
        )
        
    except Exception as e:
        logger.error(f"Failed to get FX rates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get exchange rates")


@router.post("/refresh")
async def refresh_fx_rates(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Force refresh FX rates"""
    
    try:
        # Force refresh rates
        rates = await fx_manager.get_rates(db, force_refresh=True)
        
        return {"message": "FX rates refreshed successfully", "rates_count": len(rates)}
        
    except Exception as e:
        logger.error(f"Failed to refresh FX rates: {e}")
        raise HTTPException(status_code=500, detail="Failed to refresh exchange rates")