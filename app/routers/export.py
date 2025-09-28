from fastapi import APIRouter, Depends, HTTPException, Request, Response, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, date
import csv
import io
from ..db import get_db
from ..models import User, Entry
from ..fx import fx_manager
from ..i18n import get_i18n_text
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/export", tags=["export"])


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Get current user from session"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="No session found")
    
    user = db.query(User).filter(User.session_id == session_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return user


@router.get("/csv")
async def export_csv(
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export entries as CSV"""
    
    try:
        # Get FX rates
        rates = await fx_manager.get_rates(db)
        
        # Build query
        query = db.query(Entry).filter(Entry.user_id == user.id)
        
        if from_date:
            query = query.filter(Entry.entry_date >= datetime.combine(from_date, datetime.min.time()))
        
        if to_date:
            query = query.filter(Entry.entry_date <= datetime.combine(to_date, datetime.max.time()))
        
        entries = query.order_by(Entry.entry_date.desc()).all()
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers in user's locale
        headers = [
            get_i18n_text("export.date", user.locale),
            get_i18n_text("export.title", user.locale),
            get_i18n_text("export.unit_price", user.locale),
            get_i18n_text("export.quantity", user.locale),
            get_i18n_text("export.currency", user.locale),
            get_i18n_text("export.category", user.locale),
            get_i18n_text("export.note", user.locale),
            get_i18n_text("export.total_usd", user.locale),
            get_i18n_text("export.total_currency", user.locale)
        ]
        writer.writerow(headers)
        
        # Write data
        for entry in entries:
            total_usd = entry.unit_price * entry.quantity * entry.fx_rate_to_usd
            total_currency = fx_manager.convert_from_usd(total_usd, user.currency, rates)
            
            row = [
                entry.entry_date.strftime("%Y-%m-%d"),
                entry.title,
                entry.unit_price,
                entry.quantity,
                entry.currency,
                get_i18n_text(f"categories.{entry.category}", user.locale),
                entry.note or "",
                round(total_usd, 2),
                round(total_currency, 2)
            ]
            writer.writerow(row)
        
        # Prepare response
        csv_content = output.getvalue()
        output.close()
        
        # Generate filename
        filename = f"entries_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        logger.error(f"Failed to export CSV: {e}")
        raise HTTPException(status_code=500, detail="Failed to export data")