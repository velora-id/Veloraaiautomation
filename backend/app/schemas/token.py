from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenPayload(BaseModel):
    sub: Optional[UUID] = None
    exp: Optional[int] = None
    type: Optional[str] = None
