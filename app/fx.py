import httpx
import asyncio
from typing import Dict, Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import FXRate
from .config import settings
import logging

logger = logging.getLogger(__name__)


class FXProvider:
    """Base class for FX rate providers"""
    
    async def get_rates(self) -> Dict[str, float]:
        """Get exchange rates to USD"""
        raise NotImplementedError


class ExchangeRateHostProvider(FXProvider):
    """Primary FX provider using exchangerate.host"""
    
    async def get_rates(self) -> Dict[str, float]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.exchangerate.host/latest",
                    params={"base": "USD"}
                )
                response.raise_for_status()
                data = response.json()
                
                if not data.get("success", False):
                    raise Exception(f"API error: {data.get('error', 'Unknown error')}")
                
                rates = data.get("rates", {})
                # Convert to USD-based rates (invert for non-USD currencies)
                usd_rates = {"USD": 1.0}
                
                for currency, rate in rates.items():
                    if currency != "USD":
                        usd_rates[currency] = 1.0 / rate
                
                return usd_rates
                
        except Exception as e:
            logger.error(f"ExchangeRateHostProvider error: {e}")
            raise


class ECBProvider(FXProvider):
    """Fallback FX provider using European Central Bank"""
    
    async def get_rates(self) -> Dict[str, float]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://rates.ecb.europa.eu/api/latest"
                )
                response.raise_for_status()
                data = response.json()
                
                # ECB provides EUR-based rates
                eur_rates = {}
                for rate in data.get("rates", []):
                    currency = rate.get("currency")
                    value = rate.get("rate")
                    if currency and value:
                        eur_rates[currency] = value
                
                # Convert EUR-based rates to USD-based
                # We need EUR/USD rate to convert
                eur_usd_rate = eur_rates.get("USD", 1.0)
                usd_rates = {"USD": 1.0, "EUR": eur_usd_rate}
                
                for currency, eur_rate in eur_rates.items():
                    if currency not in ["USD", "EUR"]:
                        usd_rates[currency] = eur_rate * eur_usd_rate
                
                return usd_rates
                
        except Exception as e:
            logger.error(f"ECBProvider error: {e}")
            raise


class FXManager:
    """Manages FX rate fetching, caching, and conversion"""
    
    def __init__(self):
        self.providers = {
            "exchangerate_host": ExchangeRateHostProvider(),
            "ecb": ECBProvider()
        }
        self.cache: Dict[str, float] = {}
        self.last_update: Optional[datetime] = None
    
    async def get_rates(self, db: Session, force_refresh: bool = False) -> Dict[str, float]:
        """Get cached rates or fetch new ones"""
        
        # Check if we need to refresh
        if not force_refresh and self.last_update:
            cache_age = datetime.utcnow() - self.last_update
            if cache_age < timedelta(minutes=settings.fx_refresh_minutes):
                return self.cache
        
        # Try to get from database first
        if not force_refresh:
            cached_rates = db.query(FXRate).filter(
                FXRate.cached_at > datetime.utcnow() - timedelta(hours=settings.fx_cache_ttl_hours)
            ).all()
            
            if cached_rates:
                self.cache = {rate.currency: rate.rate_to_usd for rate in cached_rates}
                self.last_update = max(rate.cached_at for rate in cached_rates)
                return self.cache
        
        # Fetch new rates
        rates = await self._fetch_rates()
        
        # Cache in database
        self._cache_rates(db, rates)
        
        # Update memory cache
        self.cache = rates
        self.last_update = datetime.utcnow()
        
        return rates
    
    async def _fetch_rates(self) -> Dict[str, float]:
        """Fetch rates from providers with fallback"""
        
        # Try primary provider
        try:
            provider = self.providers[settings.fx_primary]
            rates = await provider.get_rates()
            
            # Filter to supported currencies only
            filtered_rates = {
                currency: rate for currency, rate in rates.items()
                if currency in settings.supported_currencies
            }
            
            if filtered_rates:
                return filtered_rates
                
        except Exception as e:
            logger.warning(f"Primary FX provider failed: {e}")
        
        # Try fallback provider
        try:
            provider = self.providers[settings.fx_fallback]
            rates = await provider.get_rates()
            
            # Filter to supported currencies only
            filtered_rates = {
                currency: rate for currency, rate in rates.items()
                if currency in settings.supported_currencies
            }
            
            if filtered_rates:
                return filtered_rates
                
        except Exception as e:
            logger.error(f"Fallback FX provider failed: {e}")
        
        # Return empty rates if all providers fail
        return {"USD": 1.0}
    
    def _cache_rates(self, db: Session, rates: Dict[str, float]):
        """Cache rates in database"""
        try:
            for currency, rate in rates.items():
                existing_rate = db.query(FXRate).filter(
                    FXRate.currency == currency,
                    FXRate.provider == settings.fx_primary
                ).first()
                
                if existing_rate:
                    existing_rate.rate_to_usd = rate
                    existing_rate.cached_at = datetime.utcnow()
                else:
                    new_rate = FXRate(
                        currency=currency,
                        rate_to_usd=rate,
                        provider=settings.fx_primary,
                        cached_at=datetime.utcnow()
                    )
                    db.add(new_rate)
            
            db.commit()
            
        except Exception as e:
            logger.error(f"Failed to cache FX rates: {e}")
            db.rollback()
    
    def convert_to_usd(self, amount: float, from_currency: str, rates: Dict[str, float]) -> float:
        """Convert amount from given currency to USD"""
        if from_currency == "USD":
            return amount
        
        rate = rates.get(from_currency, 1.0)
        return amount * rate
    
    def convert_from_usd(self, amount_usd: float, to_currency: str, rates: Dict[str, float]) -> float:
        """Convert amount from USD to given currency"""
        if to_currency == "USD":
            return amount_usd
        
        rate = rates.get(to_currency, 1.0)
        return amount_usd / rate
    
    def convert_currency(self, amount: float, from_currency: str, to_currency: str, rates: Dict[str, float]) -> float:
        """Convert amount from one currency to another"""
        if from_currency == to_currency:
            return amount
        
        # Convert to USD first, then to target currency
        amount_usd = self.convert_to_usd(amount, from_currency, rates)
        return self.convert_from_usd(amount_usd, to_currency, rates)


# Global FX manager instance
fx_manager = FXManager()