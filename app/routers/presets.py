from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, Preset
from ..schemas import PresetCreate, PresetUpdate, Preset as PresetSchema
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/presets", tags=["presets"])


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
async def get_presets(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user presets"""
    
    presets = db.query(Preset).filter(Preset.user_id == user.id).all()
    
    return {"presets": [PresetSchema.from_orm(preset) for preset in presets]}


@router.post("/")
async def create_preset(
    preset_data: PresetCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new preset"""
    
    try:
        preset = Preset(
            user_id=user.id,
            title=preset_data.title,
            unit_price=preset_data.unit_price,
            currency=preset_data.currency,
            category=preset_data.category,
            icon=preset_data.icon
        )
        
        db.add(preset)
        db.commit()
        db.refresh(preset)
        
        return {"preset": PresetSchema.from_orm(preset)}
        
    except Exception as e:
        logger.error(f"Failed to create preset: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create preset")


@router.put("/{preset_id}")
async def update_preset(
    preset_id: int,
    preset_data: PresetUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing preset"""
    
    preset = db.query(Preset).filter(
        Preset.id == preset_id,
        Preset.user_id == user.id
    ).first()
    
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    
    try:
        # Update fields
        if preset_data.title is not None:
            preset.title = preset_data.title
        if preset_data.unit_price is not None:
            preset.unit_price = preset_data.unit_price
        if preset_data.currency is not None:
            preset.currency = preset_data.currency
        if preset_data.category is not None:
            preset.category = preset_data.category
        if preset_data.icon is not None:
            preset.icon = preset_data.icon
        
        db.commit()
        db.refresh(preset)
        
        return {"preset": PresetSchema.from_orm(preset)}
        
    except Exception as e:
        logger.error(f"Failed to update preset: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update preset")


@router.delete("/{preset_id}")
async def delete_preset(
    preset_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete preset"""
    
    preset = db.query(Preset).filter(
        Preset.id == preset_id,
        Preset.user_id == user.id
    ).first()
    
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    
    try:
        db.delete(preset)
        db.commit()
        
        return {"message": "Preset deleted successfully"}
        
    except Exception as e:
        logger.error(f"Failed to delete preset: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete preset")