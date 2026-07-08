import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine, verify_db_connection
from app.models import policy, user  # noqa: F401
from app.routers.auth import router as auth_router
from app.routers.chat import router as chat_router
from app.routers.policies import router as policies_router
from app.routers.recommendation import router as recommendation_router
from app.routers.voice import router as voice_router
from app.routers import upload

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_insurance")

app = FastAPI(
    title="AI Insurance API",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-insurance-chatbot.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(policies_router)
app.include_router(recommendation_router)
app.include_router(chat_router)
app.include_router(voice_router)
app.include_router(upload.router)

@app.on_event("startup")
async def startup_event() -> None:
    try:
        verify_db_connection()
        Base.metadata.create_all(bind=engine)
        logger.info("Database connection verified successfully and tables initialized.")
    except Exception as exc:
        logger.error("Database connection verification failed: %s", exc)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Welcome to AI Insurance API"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
