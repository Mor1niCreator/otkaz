import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App settings
    app_base_url: str = "http://localhost:8080"
    default_timezone: str = "Asia/Ho_Chi_Minh"
    default_locale: str = "ru"
    default_currency: str = "VND"
    
    # Security
    session_secret: str = "change_me"
    csp_enabled: bool = True
    rate_limit_rps: int = 5
    rate_limit_burst: int = 20
    
    # Points system
    points_k_usd: float = 1.0
    habit_bonus_rate: float = 0.20
    streak_max_mult: float = 2.0
    min_valid_entry_usd: float = 1.0
    
    # Referral system
    ref_bonus_first_action: int = 50
    ref_welcome_points: int = 20
    ref_weekly_active_bonus: int = 25
    ref_weekly_active_threshold: int = 5
    ref_bonus_cooldown_days: int = 7
    
    # FX settings
    fx_primary: str = "exchangerate_host"
    fx_fallback: str = "ecb"
    fx_refresh_minutes: int = 180
    fx_cache_ttl_hours: int = 24
    fx_supported: str = "USD,EUR,JPY,GBP,AUD,CAD,CHF,CNY,HKD,SGD,SEK,KRW,NOK,NZD,INR,MXN,BRL,ZAR,TRY,PLN,TWD,THB,IDR,MYR,PHP,VND,AED,SAR,DKK,ILS,RUB,BYN,KZT,KGS,TJS,TMT,UZS,AMD,AZN,MDL,UAH"
    
    # Crypto settings
    crypto_cache_ttl_hours: int = 24
    crypto_top_exclude: str = "USDT,USDC,BUSD,TUSD,DAI,FDUSD,USDP"
    
    @property
    def supported_currencies(self) -> List[str]:
        return [c.strip() for c in self.fx_supported.split(",")]
    
    @property
    def excluded_crypto(self) -> List[str]:
        return [c.strip() for c in self.crypto_top_exclude.split(",")]
    
    class Config:
        env_file = ".env"


settings = Settings()