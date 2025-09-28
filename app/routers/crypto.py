from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import CryptoROIResponse
from ..crypto import crypto_roi_manager
from ..fx import fx_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/crypto", tags=["crypto"])


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Get current user from session"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user


@router.get("/roi")
async def get_crypto_roi(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get crypto ROI calculation"""
    
    try:
        # Get FX rates for currency conversion
        rates = await fx_manager.get_rates(db)
        
        # Get crypto ROI data
        roi_data = await crypto_roi_manager.get_crypto_roi(db, user, rates)
        
        return CryptoROIResponse(**roi_data)
        
    except Exception as e:
        logger.error(f"Failed to get crypto ROI: {e}")
        raise HTTPException(status_code=500, detail="Failed to get crypto ROI data")