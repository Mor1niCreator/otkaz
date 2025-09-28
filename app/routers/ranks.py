from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import RankResponse
from ..points import rank_calculator
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ranks", tags=["ranks"])


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
async def get_rank_info(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user rank information"""
    
    try:
        rank_info = rank_calculator.calculate_rank(user.total_points)
        
        return RankResponse(**rank_info)
        
    except Exception as e:
        logger.error(f"Failed to get rank info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get rank information")