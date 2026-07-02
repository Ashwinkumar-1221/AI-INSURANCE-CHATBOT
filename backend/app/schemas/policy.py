from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.policy import PolicyCategory


class PolicyBase(BaseModel):
    policy_name: str = Field(..., min_length=1, max_length=255)
    category: PolicyCategory
    provider: str = Field(..., min_length=1, max_length=255)
    coverage_amount: float = Field(..., gt=0)
    premium: float = Field(..., gt=0)
    tenure: int = Field(..., gt=0)
    description: Optional[str] = None
    eligibility: Optional[str] = None


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(PolicyBase):
    policy_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    category: Optional[PolicyCategory] = None
    provider: Optional[str] = Field(default=None, min_length=1, max_length=255)
    coverage_amount: Optional[float] = Field(default=None, gt=0)
    premium: Optional[float] = Field(default=None, gt=0)
    tenure: Optional[int] = Field(default=None, gt=0)


class PolicyResponse(PolicyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
