from pydantic import BaseModel, Field
from typing import Optional, List


# ── Generate Plan ─────────────────────────────────────────────────────────

class PlanRequest(BaseModel):
    age: int = Field(..., ge=10, le=100)
    gender: str
    weight: float = Field(..., ge=20)
    height: Optional[float] = None
    goal: str
    activity_level: str
    diet_preference: Optional[str] = "no_preference"
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    health_conditions: Optional[str] = None


class WorkoutDay(BaseModel):
    day: str
    html: str


class PlanResponse(BaseModel):
    workout_days: List[WorkoutDay]
    nutrition_plan: str
    tips: str


# ── Chat ──────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


# ── Events ────────────────────────────────────────────────────────────────

class Event(BaseModel):
    id: int
    title: str
    date: str
    time: str
    location: str
    category: str
    attendees: int
    description: str


# ── Gyms ─────────────────────────────────────────────────────────────────

class Gym(BaseModel):
    id: int
    name: str
    address: str
    distance: str
    rating: float
    reviews: int
    phone: Optional[str] = None
    hours: Optional[str] = None
    type: str  # "gym" | "park"
    lat: float
    lng: float


# ── Videos ────────────────────────────────────────────────────────────────

class Video(BaseModel):
    id: int
    title: str
    category: str
    duration: str
    thumbnail: str
    videoId: str
    difficulty: str
    muscle: str
