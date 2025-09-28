from fastapi import Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response as StarletteResponse
import time
import logging
from .config import settings

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple rate limiting middleware"""
    
    def __init__(self, app, calls_per_second: int = 5, burst: int = 20):
        super().__init__(app)
        self.calls_per_second = calls_per_second
        self.burst = burst
        self.tokens = {}
        self.last_update = {}
    
    async def dispatch(self, request: Request, call_next):
        # Only apply to API routes
        if not request.url.path.startswith("/api/"):
            return await call_next(request)
        
        client_ip = request.client.host
        
        # Initialize token bucket for new IP
        if client_ip not in self.tokens:
            self.tokens[client_ip] = self.burst
            self.last_update[client_ip] = time.time()
        
        current_time = time.time()
        time_passed = current_time - self.last_update[client_ip]
        
        # Add tokens based on time passed
        self.tokens[client_ip] = min(
            self.burst,
            self.tokens[client_ip] + time_passed * self.calls_per_second
        )
        self.last_update[client_ip] = current_time
        
        # Check if request is allowed
        if self.tokens[client_ip] >= 1:
            self.tokens[client_ip] -= 1
            return await call_next(request)
        else:
            return StarletteResponse(
                content="Rate limit exceeded",
                status_code=429,
                headers={"Retry-After": "1"}
            )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Add CSP if enabled
        if settings.csp_enabled:
            csp = (
                "default-src 'self'; "
                "img-src 'self' data:; "
                "font-src 'self'; "
                "connect-src 'self' https://api.coingecko.com https://api.exchangerate.host https://rates.ecb.europa.eu; "
                "frame-ancestors 'none';"
            )
            response.headers["Content-Security-Policy"] = csp
        
        return response


class AuditLogMiddleware(BaseHTTPMiddleware):
    """Log API requests for audit purposes"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Log request
        process_time = time.time() - start_time
        
        logger.info(
            f"{request.method} {request.url.path} "
            f"Status: {response.status_code} "
            f"Time: {process_time:.3f}s "
            f"IP: {request.client.host}"
        )
        
        return response


def setup_middleware(app):
    """Setup all middleware"""
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Trusted hosts
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"]  # Configure appropriately for production
    )
    
    # Rate limiting
    app.add_middleware(
        RateLimitMiddleware,
        calls_per_second=settings.rate_limit_rps,
        burst=settings.rate_limit_burst
    )
    
    # Security headers
    app.add_middleware(SecurityHeadersMiddleware)
    
    # Audit logging
    app.add_middleware(AuditLogMiddleware)