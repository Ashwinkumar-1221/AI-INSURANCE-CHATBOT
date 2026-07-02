from enum import Enum

from sqlalchemy import Column, DateTime, Float, Integer, String, Text, func
from sqlalchemy.sql.sqltypes import Enum as SQLAlchemyEnum

from app.database.database import Base


class PolicyCategory(str, Enum):
    HEALTH = "Health"
    VEHICLE = "Vehicle"
    LIFE = "Life"
    TRAVEL = "Travel"
    HOME = "Home"


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_name = Column(String(255), nullable=False, index=True)
    category = Column(SQLAlchemyEnum(PolicyCategory), nullable=False)
    provider = Column(String(255), nullable=False)
    coverage_amount = Column(Float, nullable=False)
    premium = Column(Float, nullable=False)
    tenure = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
