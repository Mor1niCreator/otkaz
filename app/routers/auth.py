from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import User as UserSchema
from ..referrals import referral_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/anon")
async def create_anonymous_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Create anonymous user with session cookie"""
    
    try:
        # Check if user already exists in session
        session_id = request.cookies.get("session_id")
        if session_id:
            existing_user = db.query(User).filter(User.session_id == session_id).first()
            if existing_user:
                return {"user": UserSchema.from_orm(existing_user)}
        
        # Create new user
        new_user = referral_manager.create_user_with_referral(db)
        
        # Set session cookie
        response.set_cookie(
            key="session_id",
            value=new_user.session_id,
            httponly=True,
            samesite="lax",
            secure=False,  # Set to True in production with HTTPS
            max_age=365*24*60*60  # 1 year
        )
        
        return {"user": UserSchema.from_orm(new_user)}
        
    except Exception as e:
        logger.error(f"Failed to create anonymous user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")


@router.get("/me")
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current user from session"""
    
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return {"user": UserSchema.from_orm(user)}