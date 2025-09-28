from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base
import uuid


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True, nullable=False)
    currency = Column(String(3), nullable=False, default="VND")
    locale = Column(String(5), nullable=False, default="ru")
    timezone = Column(String(50), nullable=False, default="Asia/Ho_Chi_Minh")
    reminder_time = Column(String(5), nullable=True)  # HH:MM format
    ref_code = Column(String(8), unique=True, index=True, nullable=False)
    referred_by = Column(String(8), nullable=True)
    total_points = Column(Integer, default=0)
    current_rank = Column(String(50), default="Novice Saver")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    entries = relationship("Entry", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    presets = relationship("Preset", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    referral_events = relationship("ReferralEvent", back_populates="user", cascade="all, delete-orphan")


class Entry(Base):
    __tablename__ = "entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    currency = Column(String(3), nullable=False)
    fx_rate_to_usd = Column(Float, nullable=False)  # Historical rate at entry time
    category = Column(String(50), nullable=False)
    note = Column(Text, nullable=True)
    entry_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="entries")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_date', 'user_id', 'entry_date'),
        Index('idx_user_category', 'user_id', 'category'),
    )


class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    target_amount_usd = Column(Float, nullable=False)
    icon = Column(String(50), nullable=True)
    is_achieved = Column(Boolean, default=False)
    achieved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="goals")


class Preset(Base):
    __tablename__ = "presets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    unit_price = Column(Float, nullable=False)
    currency = Column(String(3), nullable=False)
    category = Column(String(50), nullable=False)
    icon = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="presets")


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_key = Column(String(50), nullable=False)
    achieved_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    
    # Unique constraint
    __table_args__ = (
        Index('idx_user_achievement', 'user_id', 'achievement_key', unique=True),
    )


class ReferralEvent(Base):
    __tablename__ = "referral_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_type = Column(String(50), nullable=False)  # FIRST_ACTION, WELCOME, WEEKLY_ACTIVE
    points_awarded = Column(Integer, nullable=False)
    referred_user_id = Column(Integer, nullable=True)  # For tracking who triggered the event
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="referral_events")


class FXRate(Base):
    __tablename__ = "fx_rates"
    
    id = Column(Integer, primary_key=True, index=True)
    currency = Column(String(3), nullable=False)
    rate_to_usd = Column(Float, nullable=False)
    provider = Column(String(50), nullable=False)
    cached_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Unique constraint
    __table_args__ = (
        Index('idx_currency_provider', 'currency', 'provider', unique=True),
    )


class CryptoData(Base):
    __tablename__ = "crypto_data"
    
    id = Column(Integer, primary_key=True, index=True)
    coin_id = Column(String(50), nullable=False)
    symbol = Column(String(10), nullable=False)
    name = Column(String(100), nullable=False)
    current_price_usd = Column(Float, nullable=False)
    price_5y_ago_usd = Column(Float, nullable=True)
    market_cap_rank = Column(Integer, nullable=True)
    cached_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Unique constraint
    __table_args__ = (
        Index('idx_coin_id', 'coin_id', unique=True),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())