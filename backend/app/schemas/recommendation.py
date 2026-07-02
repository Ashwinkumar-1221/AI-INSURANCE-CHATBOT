from typing import Optional

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    age: int = Field(..., ge=0)
    gender: str = Field(..., min_length=1, max_length=50)
    annual_income: float = Field(..., ge=0)
    occupation: str = Field(..., min_length=1, max_length=255)
    marital_status: str = Field(..., min_length=1, max_length=50)
    number_of_dependents: int = Field(..., ge=0)
    existing_medical_conditions: str = Field(..., min_length=1, max_length=500)
    preferred_category: Optional[str] = None


class RecommendationResponse(BaseModel):
    recommendations: list[dict[str, object]]
