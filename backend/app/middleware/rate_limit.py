from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi import status
import time
from collections import defaultdict
from typing import Dict, List


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiting middleware
    In production, use Redis for distributed rate limiting
    """

    def __init__(self, app, calls_per_minute: int = 60):
        super().__init__(app)
        self.calls_per_minute = calls_per_minute
        self.requests: Dict[str, List[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Get client identifier (IP or user_id from token)
        client_id = request.client.host if request.client else "unknown"

        # Get current timestamp
        now = time.time()
        minute_ago = now - 60

        # Clean old requests
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > minute_ago
        ]

        # Check rate limit
        if len(self.requests[client_id]) >= self.calls_per_minute:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "success": False,
                    "message": "Rate limit exceeded. Please try again later.",
                    "errors": ["Too many requests"]
                }
            )

        # Add current request
        self.requests[client_id].append(now)

        # Process request
        response = await call_next(request)
        return response
