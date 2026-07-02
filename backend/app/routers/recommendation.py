from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.policy import PolicyResponse
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommend", tags=["recommendations"])


@router.post("", response_model=RecommendationResponse, status_code=status.HTTP_200_OK)
def recommend_policies(
    request_data: RecommendationRequest,
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    service = RecommendationService(db)
    policies = service.get_recommendations(request_data.model_dump())
    response_items = [PolicyResponse.model_validate(policy).model_dump() for policy in policies]
    return RecommendationResponse(recommendations=response_items)
