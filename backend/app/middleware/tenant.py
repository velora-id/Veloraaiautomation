from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from fastapi import HTTPException, status
from jose import jwt, JWTError
from app.core.config import settings


class TenantMiddleware(BaseHTTPMiddleware):
    """
    Middleware to extract and validate tenant/organization context from JWT
    """

    async def dispatch(self, request: Request, call_next):
        # Skip auth for public routes
        public_routes = [
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/health",
        ]

        if request.url.path in public_routes or request.url.path.startswith("/api/v1/auth/"):
            return await call_next(request)

        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

            try:
                # Decode JWT to get organization_id
                payload = jwt.decode(
                    token,
                    settings.SECRET_KEY,
                    algorithms=[settings.ALGORITHM]
                )

                # Add organization_id to request state for later use
                request.state.organization_id = payload.get("organization_id")
                request.state.user_id = payload.get("sub")

            except JWTError:
                pass  # Let the endpoint handle authentication

        response = await call_next(request)
        return response
