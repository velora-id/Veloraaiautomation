from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, List, Any

DataT = TypeVar("DataT")


class APIResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: Optional[str] = None
    data: Optional[DataT] = None
    errors: Optional[List[str]] = None


class PaginatedResponse(BaseModel, Generic[DataT]):
    success: bool = True
    data: List[DataT]
    total: int
    page: int
    page_size: int
    total_pages: int

    class Config:
        from_attributes = True
