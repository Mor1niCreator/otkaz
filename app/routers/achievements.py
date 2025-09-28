from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, UserAchievement
from ..schemas import AchievementResponse
from ..points import achievement_checker
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


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
async def get_achievements(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user achievements"""
    
    try:
        # Get all possible achievements
        all_achievements = []
        
        for key, data in achievement_checker.ACHIEVEMENTS.items():
            # Check if user has this achievement
            existing = db.query(UserAchievement).filter(
                UserAchievement.user_id == user.id,
                UserAchievement.achievement_key == key
            ).first()
            
            achievement = AchievementResponse(
                key=key,
                title=data["title"],
                description=data["description"],
                icon=data["icon"],
                achieved=existing is not None,
                achieved_at=existing.achieved_at if existing else None
            )
            
            all_achievements.append(achievement)
        
        return {"achievements": all_achievements}
        
    except Exception as e:
        logger.error(f"Failed to get achievements: {e}")
        raise HTTPException(status_code=500, detail="Failed to get achievements")