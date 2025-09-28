from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Optional
from datetime import datetime, date, timedelta
from ..db import get_db
from ..models import User, Entry
from ..schemas import StatsResponse, StatsSummary
from ..fx import fx_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/stats", tags=["stats"])


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
async def get_stats(
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    
    try:
        # Get FX rates
        rates = await fx_manager.get_rates(db)
        
        # Calculate date ranges
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        
        # Get stats for different periods
        today_stats = await _calculate_period_stats(
            db, user, today, today, rates
        )
        
        week_stats = await _calculate_period_stats(
            db, user, week_start, today, rates
        )
        
        month_stats = await _calculate_period_stats(
            db, user, month_start, today, rates
        )
        
        all_time_stats = await _calculate_period_stats(
            db, user, None, None, rates
        )
        
        return StatsSummary(
            today=today_stats,
            week=week_stats,
            month=month_stats,
            all_time=all_time_stats
        )
        
    except Exception as e:
        logger.error(f"Failed to get stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")


async def _calculate_period_stats(
    db: Session,
    user: User,
    start_date: Optional[date],
    end_date: Optional[date],
    rates: dict
) -> StatsResponse:
    """Calculate statistics for a specific period"""
    
    # Build query
    query = db.query(Entry).filter(Entry.user_id == user.id)
    
    if start_date:
        query = query.filter(Entry.entry_date >= datetime.combine(start_date, datetime.min.time()))
    
    if end_date:
        query = query.filter(Entry.entry_date <= datetime.combine(end_date, datetime.max.time()))
    
    entries = query.all()
    
    # Calculate totals
    total_saved_usd = sum(
        entry.unit_price * entry.quantity * entry.fx_rate_to_usd
        for entry in entries
    )
    
    total_saved_currency = fx_manager.convert_from_usd(
        total_saved_usd, user.currency, rates
    )
    
    # Calculate daily average
    if start_date and end_date:
        days = (end_date - start_date).days + 1
        daily_average_usd = total_saved_usd / days if days > 0 else 0
    else:
        # For all-time stats, calculate average per day with entries
        unique_days = len(set(entry.entry_date.date() for entry in entries))
        daily_average_usd = total_saved_usd / unique_days if unique_days > 0 else 0
    
    daily_average_currency = fx_manager.convert_from_usd(
        daily_average_usd, user.currency, rates
    )
    
    # Determine period name
    if start_date == end_date:
        period = "today"
    elif start_date and end_date and (end_date - start_date).days <= 7:
        period = "week"
    elif start_date and end_date and (end_date - start_date).days <= 31:
        period = "month"
    else:
        period = "all_time"
    
    return StatsResponse(
        period=period,
        total_saved_usd=total_saved_usd,
        total_saved_currency=total_saved_currency,
        currency=user.currency,
        entries_count=len(entries),
        daily_average_usd=daily_average_usd,
        daily_average_currency=daily_average_currency
    )