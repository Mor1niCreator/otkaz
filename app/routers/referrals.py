from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import ReferralResponse, ReferralClaimRequest
from ..referrals import referral_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/referrals", tags=["referrals"])


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Get current user from session"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user


@router.get("/")
async def get_referral_info(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's referral information"""
    
    try:
        stats = referral_manager.get_referral_stats(db, user)
        
        return ReferralResponse(
            ref_code=stats["ref_code"],
            ref_link=stats["ref_link"],
            total_referrals=stats["total_referrals"],
            total_points_from_referrals=stats["total_points_from_referrals"],
            events=stats["events"]
        )
        
    except Exception as e:
        logger.error(f"Failed to get referral info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get referral information")


@router.post("/claim")
async def claim_referral_code(
    request_data: ReferralClaimRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Claim a referral code"""
    
    try:
        success = referral_manager.process_referral_claim(db, user, request_data.ref_code)
        
        if success:
            return {"message": "Referral code claimed successfully"}
        else:
            raise HTTPException(status_code=400, detail="Invalid or already used referral code")
        
    except Exception as e:
        logger.error(f"Failed to claim referral code: {e}")
        raise HTTPException(status_code=500, detail="Failed to claim referral code")