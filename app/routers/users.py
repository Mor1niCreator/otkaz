from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import UserUpdate, User as UserSchema, CurrencyEnum, LocaleEnum
from ..config import settings
from ..rank_calculator import rank_calculator
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/users", tags=["users"])


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Get current user from session"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user


@router.get("/me")
async def get_user_profile(user: User = Depends(get_current_user)):
    """Get user profile"""
    return {"user": UserSchema.from_orm(user)}


@router.put("/currency")
async def update_currency(
    currency: CurrencyEnum,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user currency"""
    
    if currency not in settings.supported_currencies:
        raise HTTPException(status_code=400, detail="Unsupported currency")
    
    user.currency = currency
    db.commit()
    
    return {"message": "Currency updated successfully", "currency": currency}


@router.put("/locale")
async def update_locale(
    locale: LocaleEnum,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user locale"""
    
    user.locale = locale
    db.commit()
    
    return {"message": "Locale updated successfully", "locale": locale}


@router.put("/timezone")
async def update_timezone(
    timezone: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user timezone"""
    
    user.timezone = timezone
    db.commit()
    
    return {"message": "Timezone updated successfully", "timezone": timezone}


@router.put("/reminder")
async def update_reminder_time(
    reminder_time: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update reminder time"""
    
    # Validate time format (HH:MM)
    try:
        hour, minute = map(int, reminder_time.split(":"))
        if not (0 <= hour <= 23 and 0 <= minute <= 59):
            raise ValueError
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")
    
    user.reminder_time = reminder_time
    db.commit()
    
    return {"message": "Reminder time updated successfully", "reminder_time": reminder_time}