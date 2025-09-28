from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from typing import Optional, List
from datetime import datetime, date
from ..db import get_db
from ..models import User, Entry
from ..schemas import EntryCreate, EntryUpdate, Entry as EntrySchema
from ..fx import fx_manager
from ..points import points_calculator
from ..referrals import referral_manager
from ..achievement_checker import achievement_checker
from ..rank_calculator import rank_calculator
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/entries", tags=["entries"])


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
async def get_entries(
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user entries with optional date filtering"""
    
    query = db.query(Entry).filter(Entry.user_id == user.id)
    
    if from_date:
        query = query.filter(Entry.entry_date >= datetime.combine(from_date, datetime.min.time()))
    
    if to_date:
        query = query.filter(Entry.entry_date <= datetime.combine(to_date, datetime.max.time()))
    
    entries = query.order_by(desc(Entry.entry_date)).all()
    
    return {"entries": [EntrySchema.from_orm(entry) for entry in entries]}


@router.post("/")
async def create_entry(
    entry_data: EntryCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new entry"""
    
    try:
        # Get current FX rates
        rates = await fx_manager.get_rates(db)
        
        # Calculate FX rate to USD at entry time
        fx_rate_to_usd = rates.get(entry_data.currency, 1.0)
        
        # Create entry
        entry = Entry(
            user_id=user.id,
            title=entry_data.title,
            unit_price=entry_data.unit_price,
            quantity=entry_data.quantity,
            currency=entry_data.currency,
            fx_rate_to_usd=fx_rate_to_usd,
            category=entry_data.category,
            note=entry_data.note,
            entry_date=entry_data.entry_date
        )
        
        db.add(entry)
        db.commit()
        db.refresh(entry)
        
        # Calculate entry amount in USD
        entry_amount_usd = entry.unit_price * entry.quantity * fx_rate_to_usd
        
        # Check for referral bonuses
        referral_manager.check_first_action_bonus(db, user, entry_amount_usd)
        
        # Calculate and update points
        daily_entries = db.query(Entry).filter(
            Entry.user_id == user.id,
            Entry.entry_date == entry.entry_date.date()
        ).all()
        
        daily_points = points_calculator.calculate_daily_points(user, daily_entries, rates)
        user.total_points += daily_points
        
        # Check achievements
        new_achievements = achievement_checker.check_achievements(db, user)
        
        # Update rank
        rank_calculator.update_user_rank(db, user)
        
        db.commit()
        
        return {
            "entry": EntrySchema.from_orm(entry),
            "points_earned": daily_points,
            "new_achievements": new_achievements
        }
        
    except Exception as e:
        logger.error(f"Failed to create entry: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create entry")


@router.put("/{entry_id}")
async def update_entry(
    entry_id: int,
    entry_data: EntryUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing entry"""
    
    entry = db.query(Entry).filter(
        Entry.id == entry_id,
        Entry.user_id == user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    try:
        # Update fields
        if entry_data.title is not None:
            entry.title = entry_data.title
        if entry_data.unit_price is not None:
            entry.unit_price = entry_data.unit_price
        if entry_data.quantity is not None:
            entry.quantity = entry_data.quantity
        if entry_data.currency is not None:
            entry.currency = entry_data.currency
        if entry_data.category is not None:
            entry.category = entry_data.category
        if entry_data.note is not None:
            entry.note = entry_data.note
        if entry_data.entry_date is not None:
            entry.entry_date = entry_data.entry_date
        
        db.commit()
        db.refresh(entry)
        
        return {"entry": EntrySchema.from_orm(entry)}
        
    except Exception as e:
        logger.error(f"Failed to update entry: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update entry")


@router.delete("/{entry_id}")
async def delete_entry(
    entry_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete entry"""
    
    entry = db.query(Entry).filter(
        Entry.id == entry_id,
        Entry.user_id == user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    try:
        db.delete(entry)
        db.commit()
        
        return {"message": "Entry deleted successfully"}
        
    except Exception as e:
        logger.error(f"Failed to delete entry: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete entry")