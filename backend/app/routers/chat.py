from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat_with_assistant(
    request_data: ChatRequest,
    db: Session = Depends(get_db),
) -> ChatResponse:
    service = ChatService(db)
    result = service.get_reply(request_data.message, request_data.conversation_id)
    return ChatResponse(**result)
