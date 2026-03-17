from fastapi import APIRouter
from app.models.schemas import Event

router = APIRouter()

# Static seed data – replace with DB queries as needed
_EVENTS: list[Event] = [
    Event(id=1, title="5K Community Run",       date="2026-04-05", time="7:00 AM",  location="Central Park, NY",       category="Running",   attendees=320, description="Join hundreds of runners for a fun community 5K run through Central Park."),
    Event(id=2, title="CrossFit Open Qualifier", date="2026-04-12", time="9:00 AM",  location="Iron Forge Gym, NY",     category="CrossFit",  attendees=150, description="Test your fitness in this regional CrossFit Open qualifier event."),
    Event(id=3, title="Yoga in the Park",        date="2026-04-19", time="8:30 AM",  location="Riverside Park, NY",     category="Yoga",      attendees=80,  description="A free outdoor yoga session suitable for all levels."),
    Event(id=4, title="Nutrition Workshop",       date="2026-04-26", time="2:00 PM",  location="FitZone Pro Gym",        category="Education", attendees=60,  description="Learn from certified nutritionists how to fuel your body."),
    Event(id=5, title="Powerlifting Meet",        date="2026-05-03", time="10:00 AM", location="Barbell Club, Brooklyn", category="Strength",  attendees=90,  description="Amateur and experienced lifters compete across three weight categories."),
    Event(id=6, title="Half Marathon Training Camp", date="2026-05-10", time="6:00 AM", location="Hudson River Trail", category="Running", attendees=200, description="3-day intensive training camp for half marathon preparation."),
]


@router.get("/events", response_model=list[Event])
async def get_events():
    return _EVENTS
