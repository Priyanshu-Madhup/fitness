from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import plan, chat, events, gyms, videos

app = FastAPI(
    title="FitAI API",
    description="AI-powered fitness ecosystem backend",
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────────────────────────
app.include_router(plan.router,   tags=["Plan"])
app.include_router(chat.router,   tags=["Chat"])
app.include_router(events.router, tags=["Events"])
app.include_router(gyms.router,   tags=["Gyms"])
app.include_router(videos.router, tags=["Videos"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
