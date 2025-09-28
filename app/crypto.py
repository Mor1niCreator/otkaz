import httpx
import asyncio
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import CryptoData, User, Entry
from .config import settings
from .fx import fx_manager
import logging

logger = logging.getLogger(__name__)


class CryptoROIManager:
    """Manages crypto ROI calculations"""
    
    async def get_crypto_roi(self, db: Session, user: User, rates: Dict[str, float]) -> Dict:
        """Calculate crypto ROI for user's total savings"""
        
        # Calculate total saved amount in USD
        total_saved_usd = sum(
            entry.unit_price * entry.quantity * entry.fx_rate_to_usd
            for entry in user.entries
        )
        
        if total_saved_usd <= 0:
            return {
                "saved_total_usd": 0.0,
                "currency": user.currency,
                "items": [],
                "disclaimer": "This is not financial advice. Past performance does not guarantee future results."
            }
        
        # Get top crypto data
        crypto_data = await self._get_top_crypto_data(db)
        
        # Calculate ROI for each crypto
        roi_items = []
        for crypto in crypto_data:
            if crypto.price_5y_ago_usd and crypto.price_5y_ago_usd > 0:
                # Calculate how many coins we could have bought 5 years ago
                coins_owned = total_saved_usd / crypto.price_5y_ago_usd
                
                # Calculate current value
                current_value_usd = coins_owned * crypto.current_price_usd
                current_value_currency = fx_manager.convert_from_usd(
                    current_value_usd, user.currency, rates
                )
                
                # Calculate growth multiplier
                growth_multiplier = crypto.current_price_usd / crypto.price_5y_ago_usd
                
                roi_items.append({
                    "coin_id": crypto.coin_id,
                    "symbol": crypto.symbol,
                    "name": crypto.name,
                    "price_5y_ago_usd": crypto.price_5y_ago_usd,
                    "price_now_usd": crypto.current_price_usd,
                    "growth_multiplier": growth_multiplier,
                    "coins_owned": coins_owned,
                    "current_value_usd": current_value_usd,
                    "current_value_currency": current_value_currency
                })
        
        # Sort by current value (highest first)
        roi_items.sort(key=lambda x: x["current_value_usd"], reverse=True)
        
        return {
            "saved_total_usd": total_saved_usd,
            "currency": user.currency,
            "items": roi_items[:10],  # Top 10
            "disclaimer": "This is not financial advice. Past performance does not guarantee future results."
        }
    
    async def _get_top_crypto_data(self, db: Session) -> List[CryptoData]:
        """Get top crypto data with 5-year historical prices"""
        
        # Check cache first
        cache_age = datetime.utcnow() - timedelta(hours=settings.crypto_cache_ttl_hours)
        cached_data = db.query(CryptoData).filter(
            CryptoData.cached_at > cache_age
        ).all()
        
        if cached_data:
            return cached_data
        
        # Fetch fresh data
        await self._fetch_and_cache_crypto_data(db)
        
        # Return cached data
        return db.query(CryptoData).all()
    
    async def _fetch_and_cache_crypto_data(self, db: Session):
        """Fetch crypto data from CoinGecko and cache it"""
        
        try:
            # Get top coins (excluding stablecoins)
            top_coins = await self._get_top_coins()
            
            # Get historical prices for 5 years ago
            historical_prices = await self._get_historical_prices(top_coins)
            
            # Clear old cache
            db.query(CryptoData).delete()
            
            # Cache new data
            for coin_id, coin_data in top_coins.items():
                historical_price = historical_prices.get(coin_id, {}).get("usd")
                
                crypto_data = CryptoData(
                    coin_id=coin_id,
                    symbol=coin_data["symbol"].upper(),
                    name=coin_data["name"],
                    current_price_usd=coin_data["current_price"],
                    price_5y_ago_usd=historical_price,
                    market_cap_rank=coin_data.get("market_cap_rank"),
                    cached_at=datetime.utcnow()
                )
                db.add(crypto_data)
            
            db.commit()
            
        except Exception as e:
            logger.error(f"Failed to fetch crypto data: {e}")
            db.rollback()
    
    async def _get_top_coins(self) -> Dict[str, Dict]:
        """Get top coins from CoinGecko"""
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Get top coins by market cap
                response = await client.get(
                    "https://api.coingecko.com/api/v3/coins/markets",
                    params={
                        "vs_currency": "usd",
                        "order": "market_cap_desc",
                        "per_page": 50,
                        "page": 1,
                        "sparkline": False
                    }
                )
                response.raise_for_status()
                coins = response.json()
                
                # Filter out stablecoins
                filtered_coins = {}
                for coin in coins:
                    symbol = coin["symbol"].upper()
                    if symbol not in settings.excluded_crypto:
                        filtered_coins[coin["id"]] = {
                            "symbol": coin["symbol"],
                            "name": coin["name"],
                            "current_price": coin["current_price"],
                            "market_cap_rank": coin.get("market_cap_rank")
                        }
                
                return filtered_coins
                
        except Exception as e:
            logger.error(f"Failed to get top coins: {e}")
            return {}
    
    async def _get_historical_prices(self, coins: Dict[str, Dict]) -> Dict[str, Dict]:
        """Get historical prices for 5 years ago"""
        
        historical_prices = {}
        
        try:
            # Calculate date 5 years ago
            five_years_ago = datetime.utcnow() - timedelta(days=5*365)
            date_str = five_years_ago.strftime("%d-%m-%Y")
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                # Get historical prices for each coin
                for coin_id in coins.keys():
                    try:
                        response = await client.get(
                            f"https://api.coingecko.com/api/v3/coins/{coin_id}/history",
                            params={"date": date_str}
                        )
                        response.raise_for_status()
                        data = response.json()
                        
                        if "market_data" in data and "current_price" in data["market_data"]:
                            historical_prices[coin_id] = data["market_data"]["current_price"]
                        
                        # Rate limiting
                        await asyncio.sleep(0.1)
                        
                    except Exception as e:
                        logger.warning(f"Failed to get historical price for {coin_id}: {e}")
                        continue
                
        except Exception as e:
            logger.error(f"Failed to get historical prices: {e}")
        
        return historical_prices


# Global instance
crypto_roi_manager = CryptoROIManager()