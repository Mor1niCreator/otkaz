from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


class CurrencyEnum(str, Enum):
    USD = "USD"
    EUR = "EUR"
    JPY = "JPY"
    GBP = "GBP"
    AUD = "AUD"
    CAD = "CAD"
    CHF = "CHF"
    CNY = "CNY"
    HKD = "HKD"
    SGD = "SGD"
    SEK = "SEK"
    KRW = "KRW"
    NOK = "NOK"
    NZD = "NZD"
    INR = "INR"
    MXN = "MXN"
    BRL = "BRL"
    ZAR = "ZAR"
    TRY = "TRY"
    PLN = "PLN"
    TWD = "TWD"
    THB = "THB"
    IDR = "IDR"
    MYR = "MYR"
    PHP = "PHP"
    VND = "VND"
    AED = "AED"
    SAR = "SAR"
    DKK = "DKK"
    ILS = "ILS"
    RUB = "RUB"
    BYN = "BYN"
    KZT = "KZT"
    KGS = "KGS"
    TJS = "TJS"
    TMT = "TMT"
    UZS = "UZS"
    AMD = "AMD"
    AZN = "AZN"
    MDL = "MDL"
    UAH = "UAH"


class LocaleEnum(str, Enum):
    RU = "ru"
    EN = "en"


class CategoryEnum(str, Enum):
    FOOD = "food"
    DRINKS = "drinks"
    HABITS = "habits"
    ENTERTAINMENT = "entertainment"
    TRANSPORT = "transport"
    SHOPPING = "shopping"
    OTHER = "other"


# User schemas
class UserBase(BaseModel):
    currency: CurrencyEnum = CurrencyEnum.VND
    locale: LocaleEnum = LocaleEnum.RU
    timezone: str = "Asia/Ho_Chi_Minh"
    reminder_time: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    currency: Optional[CurrencyEnum] = None
    locale: Optional[LocaleEnum] = None
    timezone: Optional[str] = None
    reminder_time: Optional[str] = None


class User(UserBase):
    id: int
    session_id: str
    ref_code: str
    referred_by: Optional[str]
    total_points: int
    current_rank: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Entry schemas
class EntryBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    unit_price: float = Field(..., gt=0)
    quantity: int = Field(1, ge=1)
    currency: CurrencyEnum
    category: CategoryEnum
    note: Optional[str] = Field(None, max_length=1000)
    entry_date: datetime


class EntryCreate(EntryBase):
    pass


class EntryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    unit_price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=1)
    currency: Optional[CurrencyEnum] = None
    category: Optional[CategoryEnum] = None
    note: Optional[str] = Field(None, max_length=1000)
    entry_date: Optional[datetime] = None


class Entry(EntryBase):
    id: int
    user_id: int
    fx_rate_to_usd: float
    created_at: datetime

    class Config:
        from_attributes = True


# Goal schemas
class GoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    target_amount_usd: float = Field(..., gt=0)
    icon: Optional[str] = Field(None, max_length=50)


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    target_amount_usd: Optional[float] = Field(None, gt=0)
    icon: Optional[str] = Field(None, max_length=50)


class Goal(GoalBase):
    id: int
    user_id: int
    is_achieved: bool
    achieved_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# Preset schemas
class PresetBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    unit_price: float = Field(..., gt=0)
    currency: CurrencyEnum
    category: CategoryEnum
    icon: Optional[str] = Field(None, max_length=50)


class PresetCreate(PresetBase):
    pass


class PresetUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    unit_price: Optional[float] = Field(None, gt=0)
    currency: Optional[CurrencyEnum] = None
    category: Optional[CategoryEnum] = None
    icon: Optional[str] = Field(None, max_length=50)


class Preset(PresetBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Stats schemas
class StatsResponse(BaseModel):
    period: str
    total_saved_usd: float
    total_saved_currency: float
    currency: str
    entries_count: int
    daily_average_usd: float
    daily_average_currency: float


class StatsSummary(BaseModel):
    today: StatsResponse
    week: StatsResponse
    month: StatsResponse
    all_time: StatsResponse


# Referral schemas
class ReferralEventResponse(BaseModel):
    id: int
    event_type: str
    points_awarded: int
    referred_user_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class ReferralResponse(BaseModel):
    ref_code: str
    ref_link: str
    total_referrals: int
    total_points_from_referrals: int
    events: List[ReferralEventResponse]


class ReferralClaimRequest(BaseModel):
    ref_code: str = Field(..., min_length=6, max_length=8)


# Achievement schemas
class AchievementResponse(BaseModel):
    key: str
    title: str
    description: str
    icon: str
    achieved: bool
    achieved_at: Optional[datetime]
    progress: Optional[float] = None  # 0.0 to 1.0


# Rank schemas
class RankResponse(BaseModel):
    current_rank: str
    current_points: int
    next_rank: Optional[str]
    points_to_next: Optional[int]
    progress: float  # 0.0 to 1.0


# Crypto ROI schemas
class CryptoROIItem(BaseModel):
    coin_id: str
    symbol: str
    name: str
    price_5y_ago_usd: float
    price_now_usd: float
    growth_multiplier: float
    coins_owned: float
    current_value_usd: float
    current_value_currency: float


class CryptoROIResponse(BaseModel):
    saved_total_usd: float
    currency: str
    items: List[CryptoROIItem]
    disclaimer: str


# FX schemas
class FXRateResponse(BaseModel):
    currency: str
    rate_to_usd: float
    provider: str
    cached_at: datetime

    class Config:
        from_attributes = True


class FXRatesResponse(BaseModel):
    base: str = "USD"
    rates: List[FXRateResponse]
    cached_at: datetime


# Export schemas
class ExportRequest(BaseModel):
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    format: str = "csv"