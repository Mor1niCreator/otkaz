from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import User, Goal
from ..schemas import GoalCreate, GoalUpdate, Goal as GoalSchema
from ..fx import fx_manager
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/goals", tags=["goals"])


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
async def get_goals(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user goals"""
    
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    
    # Get FX rates for currency conversion
    rates = await fx_manager.get_rates(db)
    
    # Convert goal amounts to user's currency
    goals_with_currency = []
    for goal in goals:
        goal_dict = GoalSchema.from_orm(goal).dict()
        goal_dict["target_amount_currency"] = fx_manager.convert_from_usd(
            goal.target_amount_usd, user.currency, rates
        )
        goals_with_currency.append(goal_dict)
    
    return {"goals": goals_with_currency}


@router.post("/")
async def create_goal(
    goal_data: GoalCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new goal"""
    
    try:
        goal = Goal(
            user_id=user.id,
            title=goal_data.title,
            target_amount_usd=goal_data.target_amount_usd,
            icon=goal_data.icon
        )
        
        db.add(goal)
        db.commit()
        db.refresh(goal)
        
        return {"goal": GoalSchema.from_orm(goal)}
        
    except Exception as e:
        logger.error(f"Failed to create goal: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create goal")


@router.put("/{goal_id}")
async def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing goal"""
    
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    try:
        # Update fields
        if goal_data.title is not None:
            goal.title = goal_data.title
        if goal_data.target_amount_usd is not None:
            goal.target_amount_usd = goal_data.target_amount_usd
        if goal_data.icon is not None:
            goal.icon = goal_data.icon
        
        db.commit()
        db.refresh(goal)
        
        return {"goal": GoalSchema.from_orm(goal)}
        
    except Exception as e:
        logger.error(f"Failed to update goal: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update goal")


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete goal"""
    
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    try:
        db.delete(goal)
        db.commit()
        
        return {"message": "Goal deleted successfully"}
        
    except Exception as e:
        logger.error(f"Failed to delete goal: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete goal")