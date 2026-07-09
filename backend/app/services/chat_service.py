import os
from pathlib import Path
from typing import Any
from collections import defaultdict

from dotenv import load_dotenv
from groq import Groq
from sqlalchemy.orm import Session

from app.models.policy import Policy
from app.services.recommendation_service import RecommendationService

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
conversation_memory = defaultdict(list)


class ChatService:
    def __init__(self, db: Session):
        self.db = db

    def get_reply(self, message: str, conversation_id: str | None = None) -> dict[str, Any]:
        recommendation_service = RecommendationService(self.db)
        payload = {
            "age": 35,
            "gender": "unknown",
            "annual_income": 80000,
            "occupation": "professional",
            "marital_status": "single",
            "number_of_dependents": 0,
            "existing_medical_conditions": "none",
            "preferred_category": None,
        }

        message_lower = message.lower()

        if "health" in message_lower or "medical" in message_lower:
            payload["preferred_category"] = "HEALTH"

        elif "life" in message_lower:
            payload["preferred_category"] = "LIFE"

        elif (
            "vehicle" in message_lower
            or "car" in message_lower
            or "bike" in message_lower
            or "motor" in message_lower
        ):
            payload["preferred_category"] = "VEHICLE"

        elif "travel" in message_lower:
            payload["preferred_category"] = "TRAVEL"

        elif "home" in message_lower or "house" in message_lower:
            payload["preferred_category"] = "HOME"

        policies = recommendation_service.get_recommendations(payload)

        try:
            prompt = self._build_prompt(message, policies)
            history = conversation_memory[conversation_id or "default"]

            history.append({
                "role": "user",
                "content": prompt,
            })

            client = Groq(api_key=GROQ_API_KEY)

            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """..."""
                    },
                    *history,
                ],
                temperature=0.4,
                max_tokens=400,
            )
            reply = response.choices[0].message.content.strip()

            history.append({
                "role": "assistant",
                "content": reply,
            })

            if len(history) > 20:
                history[:] = history[-20:]
            return {
                "reply": reply,
                "recommended_policies": [self._policy_to_dict(policy) for policy in policies],
            }
        except Exception as exc:
            return {
                "reply": f"I’m sorry, I couldn’t complete that request right now. {exc}",
                "recommended_policies": [self._policy_to_dict(policy) for policy in policies],
            }

    def _build_prompt(self, message: str, policies: list[Policy]) -> str:
        context = ""

        if policies:
            context = "\n".join(
                [
                    f"- {policy.policy_name} ({policy.category.value}): {policy.description or 'No description'}; provider: {policy.provider}; coverage: {policy.coverage_amount}; premium: {policy.premium}; tenure: {policy.tenure}"
                    for policy in policies
                ]
            )

        return f"""
Previous insurance recommendations:
{context}

Current user message:
{message}

If the user's reply is:
- yes
- no
- okay
- continue
- tell me more
- compare
- which one

Assume they are referring to the previous insurance topic.

Continue the conversation naturally without restarting it.
"""

    def _policy_to_dict(self, policy: Policy) -> dict[str, Any]:
        return {
            "id": policy.id,
            "policy_name": policy.policy_name,
            "category": policy.category.value,
            "provider": policy.provider,
            "coverage_amount": policy.coverage_amount,
            "premium": policy.premium,
            "tenure": policy.tenure,
            "description": policy.description,
        }
