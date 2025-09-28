from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import User, Entry, UserAchievement
from .config import settings
from .fx import fx_manager
import logging

logger = logging.getLogger(__name__)


class PointsCalculator:
    """Calculates points based on savings and streaks"""
    
    def calculate_daily_points(self, user: User, entries: List[Entry], rates: Dict[str, float]) -> int:
        """Calculate points for a day's entries"""
        
        # Calculate total savings in USD
        total_saved_usd = 0.0
        has_habit_category = False
        
        for entry in entries:
            # Convert entry amount to USD using historical rate
            amount_usd = entry.unit_price * entry.quantity * entry.fx_rate_to_usd
            total_saved_usd += amount_usd
            
            # Check for habit category
            if entry.category == "habits":
                has_habit_category = True
        
        # Base points calculation
        base_points = int(total_saved_usd / settings.points_k_usd)
        
        # Streak multiplier
        streak_mult = self._calculate_streak_multiplier(user)
        
        # Habit bonus
        habit_bonus = settings.habit_bonus_rate if has_habit_category else 0.0
        
        # Final calculation
        daily_points = int(base_points * streak_mult * (1 + habit_bonus))
        
        return daily_points
    
    def _calculate_streak_multiplier(self, user: User) -> float:
        """Calculate streak multiplier based on consecutive days"""
        # This would need to be implemented based on your streak calculation logic
        # For now, return a simple multiplier
        return min(1.0 + 0.05 * (user.total_points // 100), settings.streak_max_mult)


class AchievementChecker:
    """Checks and awards achievements"""
    
    ACHIEVEMENTS = {
        "coffee_breaker": {
            "title": "Coffee Breaker",
            "description": "First coffee refusal",
            "icon": "coffee",
            "check": "_check_coffee_breaker"
        },
        "sugar_free": {
            "title": "Sugar Free",
            "description": "7 days without sugary drinks",
            "icon": "soda",
            "check": "_check_sugar_free"
        },
        "smoke_out": {
            "title": "Smoke Out",
            "description": "14 days without smoking",
            "icon": "cigarette",
            "check": "_check_smoke_out"
        },
        "budget_ninja": {
            "title": "Budget Ninja",
            "description": "Saved $40+",
            "icon": "ninja",
            "check": "_check_budget_ninja"
        },
        "momentum": {
            "title": "Momentum",
            "description": "21 day streak",
            "icon": "momentum",
            "check": "_check_momentum"
        },
        "ref_hero": {
            "title": "Ref Hero",
            "description": "3 successful referrals",
            "icon": "referral",
            "check": "_check_ref_hero"
        },
        "consistency_king": {
            "title": "Consistency King/Queen",
            "description": "60 days of entries",
            "icon": "consistency",
            "check": "_check_consistency"
        },
        "iron_will": {
            "title": "Iron Will",
            "description": "30 days without gaps",
            "icon": "iron",
            "check": "_check_iron_will"
        }
    }
    
    def check_achievements(self, db: Session, user: User) -> List[str]:
        """Check all achievements for a user"""
        new_achievements = []
        
        for achievement_key, achievement_data in self.ACHIEVEMENTS.items():
            # Skip if already achieved
            existing = db.query(UserAchievement).filter(
                UserAchievement.user_id == user.id,
                UserAchievement.achievement_key == achievement_key
            ).first()
            
            if existing:
                continue
            
            # Check achievement condition
            check_method = getattr(self, achievement_data["check"])
            if check_method(db, user):
                # Award achievement
                new_achievement = UserAchievement(
                    user_id=user.id,
                    achievement_key=achievement_key
                )
                db.add(new_achievement)
                new_achievements.append(achievement_key)
        
        return new_achievements
    
    def _check_coffee_breaker(self, db: Session, user: User) -> bool:
        """Check if user has refused coffee"""
        coffee_entry = db.query(Entry).filter(
            Entry.user_id == user.id,
            Entry.title.ilike("%coffee%")
        ).first()
        return coffee_entry is not None
    
    def _check_sugar_free(self, db: Session, user: User) -> bool:
        """Check 7 days without sugary drinks"""
        # Implementation would check for 7 consecutive days without soda entries
        return False  # Placeholder
    
    def _check_smoke_out(self, db: Session, user: User) -> bool:
        """Check 14 days without smoking"""
        # Implementation would check for 14 consecutive days without smoking entries
        return False  # Placeholder
    
    def _check_budget_ninja(self, db: Session, user: User) -> bool:
        """Check if user has saved $40+"""
        total_saved_usd = sum(
            entry.unit_price * entry.quantity * entry.fx_rate_to_usd
            for entry in user.entries
        )
        return total_saved_usd >= 40.0
    
    def _check_momentum(self, db: Session, user: User) -> bool:
        """Check 21 day streak"""
        # Implementation would check for 21 consecutive days
        return False  # Placeholder
    
    def _check_ref_hero(self, db: Session, user: User) -> bool:
        """Check 3 successful referrals"""
        # Implementation would check referral events
        return False  # Placeholder
    
    def _check_consistency(self, db: Session, user: User) -> bool:
        """Check 60 days of entries"""
        # Implementation would check for 60 days with entries
        return False  # Placeholder
    
    def _check_iron_will(self, db: Session, user: User) -> bool:
        """Check 30 days without gaps"""
        # Implementation would check for 30 consecutive days
        return False  # Placeholder


class RankCalculator:
    """Calculates user ranks based on total points"""
    
    RANKS = [
        {"name": "Novice Saver", "min_points": 0, "max_points": 99},
        {"name": "Habit Hacker", "min_points": 100, "max_points": 299},
        {"name": "Frugal Master", "min_points": 300, "max_points": 799},
        {"name": "Willpower Pro", "min_points": 800, "max_points": 1999},
        {"name": "Discipline Legend", "min_points": 2000, "max_points": float('inf')}
    ]
    
    def calculate_rank(self, total_points: int) -> Dict[str, any]:
        """Calculate current rank and progress to next rank"""
        
        for i, rank in enumerate(self.RANKS):
            if rank["min_points"] <= total_points <= rank["max_points"]:
                current_rank = rank["name"]
                
                # Calculate next rank
                if i < len(self.RANKS) - 1:
                    next_rank = self.RANKS[i + 1]["name"]
                    points_to_next = self.RANKS[i + 1]["min_points"] - total_points
                    progress = min(1.0, total_points / self.RANKS[i + 1]["min_points"])
                else:
                    next_rank = None
                    points_to_next = None
                    progress = 1.0
                
                return {
                    "current_rank": current_rank,
                    "current_points": total_points,
                    "next_rank": next_rank,
                    "points_to_next": points_to_next,
                    "progress": progress
                }
        
        # Fallback
        return {
            "current_rank": "Novice Saver",
            "current_points": total_points,
            "next_rank": "Habit Hacker",
            "points_to_next": max(0, 100 - total_points),
            "progress": min(1.0, total_points / 100)
        }
    
    def update_user_rank(self, db: Session, user: User):
        """Update user's rank based on current points"""
        rank_info = self.calculate_rank(user.total_points)
        user.current_rank = rank_info["current_rank"]
        db.commit()


# Global instances
points_calculator = PointsCalculator()
achievement_checker = AchievementChecker()
rank_calculator = RankCalculator()