from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User
from ..schemas import UserUpdate, User as UserSchema, CurrencyEnum, LocaleEnum
from ..config import settings
from ..points import rank_calculator
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


@router.post("/currency")
async def update_currency(
    payload: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user currency"""
    currency = payload.get("currency")
    if not currency or currency not in settings.supported_currencies:
        raise HTTPException(status_code=400, detail="Unsupported currency")
    
    user.currency = currency
    db.commit()
    
    return {"message": "Currency updated successfully", "currency": currency}


@router.post("/locale")
async def update_locale(
    payload: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user locale"""
    locale = payload.get("locale")
    if locale not in [LocaleEnum.RU, LocaleEnum.EN]:
        raise HTTPException(status_code=400, detail="Unsupported locale")
    user.locale = locale
    db.commit()
    
    return {"message": "Locale updated successfully", "locale": locale}


@router.post("/timezone")
async def update_timezone(
    payload: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user timezone"""
    timezone = payload.get("timezone")
    if not timezone:
        raise HTTPException(status_code=400, detail="Invalid timezone")
    user.timezone = timezone
    db.commit()
    
    return {"message": "Timezone updated successfully", "timezone": timezone}


@router.post("/reminder")
async def update_reminder_time(
    payload: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update reminder time"""
    
    # Validate time format (HH:MM)
    try:
        reminder_time = payload.get("reminder_time", "")
        hour, minute = map(int, reminder_time.split(":"))
        if not (0 <= hour <= 23 and 0 <= minute <= 59):
            raise ValueError
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")
    
    user.reminder_time = reminder_time
    db.commit()
    
    return {"message": "Reminder time updated successfully", "reminder_time": reminder_time}