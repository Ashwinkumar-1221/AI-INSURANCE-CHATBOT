from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyResponse, PolicyUpdate

router = APIRouter(prefix="/policies", tags=["policies"])


@router.get("", response_model=list[PolicyResponse])
def list_policies(db: Session = Depends(get_db)) -> list[Policy]:
    return db.query(Policy).order_by(Policy.created_at.desc()).all()


@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy(policy_id: int, db: Session = Depends(get_db)) -> Policy:
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return policy


@router.post("", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def create_policy(policy_data: PolicyCreate, db: Session = Depends(get_db)) -> PolicyResponse:
    db_policy = Policy(**policy_data.model_dump())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return PolicyResponse.model_validate(db_policy)


@router.put("/{policy_id}", response_model=PolicyResponse)
def update_policy(policy_id: int, policy_data: PolicyUpdate, db: Session = Depends(get_db)) -> PolicyResponse:
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")

    for field, value in policy_data.model_dump(exclude_unset=True).items():
        setattr(policy, field, value)

    db.commit()
    db.refresh(policy)
    return PolicyResponse.model_validate(policy)


@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_policy(policy_id: int, db: Session = Depends(get_db)) -> None:
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")

    db.delete(policy)
    db.commit()
