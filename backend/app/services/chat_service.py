import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from groq import Groq
from sqlalchemy.orm import Session

from app.models.policy import Policy
from app.services.recommendation_service import RecommendationService

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


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
            client = Groq(api_key=GROQ_API_KEY)
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """
                           You are InsureAI, a professional AI Insurance Assistant.

Your personality:
- Friendly, calm, confident and natural.
- Speak like a helpful human, not like a chatbot.
- Never sound robotic or overly formal.
- Keep conversations short unless the user asks for details.

Rules:

1. Greetings
If the user says:
- Hi
- Hello
- Hey
- Good morning
- Good afternoon
- Good evening

Reply naturally in one short sentence.

Examples:
"Hello! 👋"
"Hi! How can I help you today?"
"Good morning! How may I assist you?"

Do NOT explain insurance after a greeting.

2. Small Talk

If the user asks:
- How are you?
- What's up?
- Who are you?
- Thank you
- Bye

Reply naturally in one or two short sentences.

Examples:

User: How are you?
Assistant:
"I'm doing well, thank you! How can I help you today?"

User: Thanks
Assistant:
"You're welcome! Happy to help."

User: Bye
Assistant:
"Goodbye! Have a wonderful day."

3. Insurance Questions

Only when the user asks about insurance:

- Health Insurance
- Life Insurance
- Vehicle Insurance
- Claims
- Premiums
- Coverage
- Policies
- Renewals

Provide concise answers.

Default length:
2–4 short sentences.

Use bullet points only when comparing multiple options.

4. Recommendations

When recommending insurance:

- Explain why it suits the user.
- Mention only the important benefits.
- Avoid long paragraphs.

5. Unknown Questions

If the question is unrelated to insurance:

Answer briefly and politely, then guide the conversation back.

Example:

"I'd be happy to help with insurance-related questions. Is there anything about policies or claims you'd like to know?"

6. Language

Always reply in the same language the user uses.

If the user speaks:
- English → English
- Hindi → Hindi
- Telugu → Telugu

Never switch languages unless asked.

7. Style

Be conversational.

Never write huge paragraphs.

Avoid unnecessary disclaimers.

Avoid repeating yourself.

Sound like Alexa, ChatGPT Voice, or Gemini Live.

Keep responses quick, natural, and pleasant.
Response Length Rules:

- Greetings: maximum 1 sentence.
- Small talk: maximum 2 sentences.
- Insurance answers: maximum 4 short sentences.
- Comparisons: maximum 5 bullet points.
- Never generate paragraphs longer than 80 words unless the user explicitly asks for detailed information.
                        """,
                    },
                   {
    "role": "user",
    "content": f"""
Previous topic:
{context}

Current user message:
{message}

If the user replies with words like:
yes, no, okay, continue, tell me more, compare, which one

assume they are referring to the previous topic above.

Continue the conversation naturally.
"""
},
                ],
                temperature=0.4,
                max_tokens=400,
            )
            reply = response.choices[0].message.content.strip()
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
Previous topic:
{context}

Current user message:
{message}

If the user's reply is short like:
yes, no, okay, continue, tell me more, compare, which one

assume they are referring to the previous topic.

Continue the conversation naturally.
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
