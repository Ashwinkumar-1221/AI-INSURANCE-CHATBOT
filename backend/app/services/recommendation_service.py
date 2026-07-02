from typing import Any

from sqlalchemy.orm import Session

from app.models.policy import Policy, PolicyCategory


class RecommendationService:
    def __init__(self, db: Session):
        self.db = db

    def get_recommendations(self, data: dict[str, Any]) -> list[Policy]:
        policies = self.db.query(Policy).all()
        if not policies:
            return []

        preferred_category = data.get("preferred_category")
        age = int(data.get("age", 0))
        annual_income = float(data.get("annual_income", 0))
        marital_status = str(data.get("marital_status", "")).lower()
        number_of_dependents = int(data.get("number_of_dependents", 0))
        existing_medical_conditions = str(data.get("existing_medical_conditions", "")).lower()
        occupation = str(data.get("occupation", "")).lower()

        scored: list[tuple[float, Policy]] = []

        for policy in policies:
            score = 0.0
            policy_category = policy.category.value.lower()

            if preferred_category:
                if policy_category == str(preferred_category).lower():
                    score += 5

            if policy_category in {"health", "life"} and existing_medical_conditions:
                score += 2
            if policy_category == "vehicle" and "driver" in occupation:
                score += 2
            if policy_category == "travel" and annual_income >= 50000:
                score += 1
            if policy_category == "home" and marital_status in {"married", "partnered"}:
                score += 2

            if age >= 30 and policy_category in {"life", "health"}:
                score += 1
            if annual_income >= 100000 and policy_category in {"life", "health", "travel"}:
                score += 1
            if number_of_dependents > 0 and policy_category in {"life", "health", "home"}:
                score += 1

            scored.append((score, policy))

        scored.sort(key=lambda item: (-item[0], item[1].premium))
        top_policies = [policy for _, policy in scored[:3]]
        return top_policies
