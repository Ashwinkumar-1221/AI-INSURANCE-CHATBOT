from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from twilio.twiml.voice_response import Gather, Say, VoiceResponse

from app.database.database import get_db
from app.services.chat_service import ChatService

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("", response_class=PlainTextResponse, status_code=status.HTTP_200_OK)
async def handle_voice(request: Request, db: Session = Depends(get_db)) -> PlainTextResponse:
    form_data = await request.form()
    speech_result = form_data.get("SpeechResult")
    service = ChatService(db)

    if speech_result:
        reply = service.get_reply(str(speech_result)).get("reply", "")
    else:
        reply = "Hello! I am your AI insurance assistant. Tell me what you need help with."

    voice_response = VoiceResponse()
    gather = Gather(input="speech", timeout=5, speech_timeout="auto", action="/voice", method="POST")
    gather.say(reply)
    voice_response.append(gather)
    voice_response.say("Goodbye.")

    return PlainTextResponse(content=str(voice_response), media_type="application/xml")
