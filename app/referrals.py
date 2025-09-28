import secrets
import string
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import User, ReferralEvent
from .config import settings
import logging

logger = logging.getLogger(__name__)


class ReferralManager:
    """Manages referral system"""
    
    def generate_ref_code(self, user_id: int) -> str:
        """Generate unique referral code"""
        # Use base36 encoding with user ID and random salt
        salt = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(3))
        code = f"{user_id:04x}{salt}"
        return code[:8]  # Ensure max 8 characters
    
    def create_user_with_referral(self, db: Session, referred_by_code: Optional[str] = None) -> User:
        """Create new user with optional referral"""
        
        # Create new user
        new_user = User(
            session_id=self._generate_session_id(),
            ref_code=self.generate_ref_code(0)  # Will be updated after user creation
        )
        
        # Set referral if provided
        if referred_by_code:
            referrer = db.query(User).filter(User.ref_code == referred_by_code).first()
            if referrer and referrer.id != new_user.id:  # Prevent self-referral
                new_user.referred_by = referred_by_code
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Update ref_code with actual user ID
        new_user.ref_code = self.generate_ref_code(new_user.id)
        db.commit()
        
        return new_user
    
    def _generate_session_id(self) -> str:
        """Generate secure session ID"""
        return secrets.token_urlsafe(32)
    
    def process_referral_claim(self, db: Session, user: User, ref_code: str) -> bool:
        """Process referral code claim"""
        
        # Validate referral code
        if not ref_code or len(ref_code) < 6:
            return False
        
        # Find referrer
        referrer = db.query(User).filter(User.ref_code == ref_code).first()
        if not referrer or referrer.id == user.id:
            return False  # Self-referral not allowed
        
        # Check if user already has a referrer
        if user.referred_by:
            return False  # Already referred
        
        # Set referral
        user.referred_by = ref_code
        db.commit()
        
        # Award welcome points to new user
        self._award_welcome_points(db, user)
        
        return True
    
    def _award_welcome_points(self, db: Session, user: User):
        """Award welcome points to referred user"""
        event = ReferralEvent(
            user_id=user.id,
            event_type="WELCOME",
            points_awarded=settings.ref_welcome_points
        )
        db.add(event)
        
        # Update user points
        user.total_points += settings.ref_welcome_points
        db.commit()
    
    def check_first_action_bonus(self, db: Session, user: User, entry_amount_usd: float):
        """Check and award first action bonus to referrer"""
        
        if not user.referred_by:
            return
        
        # Check if this is a valid entry
        if entry_amount_usd < settings.min_valid_entry_usd:
            return
        
        # Find referrer
        referrer = db.query(User).filter(User.ref_code == user.referred_by).first()
        if not referrer:
            return
        
        # Check if referrer already got first action bonus for this user
        existing_event = db.query(ReferralEvent).filter(
            ReferralEvent.user_id == referrer.id,
            ReferralEvent.event_type == "FIRST_ACTION",
            ReferralEvent.referred_user_id == user.id
        ).first()
        
        if existing_event:
            return  # Already awarded
        
        # Award first action bonus
        event = ReferralEvent(
            user_id=referrer.id,
            event_type="FIRST_ACTION",
            points_awarded=settings.ref_bonus_first_action,
            referred_user_id=user.id
        )
        db.add(event)
        
        # Update referrer points
        referrer.total_points += settings.ref_bonus_first_action
        db.commit()
    
    def check_weekly_active_bonus(self, db: Session, user: User):
        """Check and award weekly active bonus"""
        
        if not user.referred_by:
            return
        
        # Find referrer
        referrer = db.query(User).filter(User.ref_code == user.referred_by).first()
        if not referrer:
            return
        
        # Check if referrer already got weekly bonus recently
        last_week = datetime.utcnow() - timedelta(days=7)
        recent_event = db.query(ReferralEvent).filter(
            ReferralEvent.user_id == referrer.id,
            ReferralEvent.event_type == "WEEKLY_ACTIVE",
            ReferralEvent.created_at > last_week
        ).first()
        
        if recent_event:
            return  # Already awarded this week
        
        # Check if user was active this week (simplified check)
        # In real implementation, you'd check actual entry count
        week_start = datetime.utcnow() - timedelta(days=7)
        recent_entries = db.query(Entry).filter(
            Entry.user_id == user.id,
            Entry.created_at > week_start
        ).count()
        
        if recent_entries >= settings.ref_weekly_active_threshold:
            # Award weekly active bonus
            event = ReferralEvent(
                user_id=referrer.id,
                event_type="WEEKLY_ACTIVE",
                points_awarded=settings.ref_weekly_active_bonus,
                referred_user_id=user.id
            )
            db.add(event)
            
            # Update referrer points
            referrer.total_points += settings.ref_weekly_active_bonus
            db.commit()
    
    def get_referral_stats(self, db: Session, user: User) -> dict:
        """Get referral statistics for user"""
        
        # Get referral events
        events = db.query(ReferralEvent).filter(
            ReferralEvent.user_id == user.id
        ).all()
        
        # Calculate stats
        total_referrals = len(set(event.referred_user_id for event in events if event.referred_user_id))
        total_points = sum(event.points_awarded for event in events)
        
        return {
            "ref_code": user.ref_code,
            "ref_link": f"{settings.app_base_url}/?ref={user.ref_code}",
            "total_referrals": total_referrals,
            "total_points_from_referrals": total_points,
            "events": events
        }


# Global instance
referral_manager = ReferralManager()