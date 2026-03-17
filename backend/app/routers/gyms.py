from fastapi import APIRouter, Query
from app.models.schemas import Gym
from app.services.maps_service import get_nearby_places

router = APIRouter()

# Fallback mock data used when no API key is configured
_MOCK_GYMS: list[Gym] = [
    Gym(id=1, name="FitZone Pro Gym",          address="123 Main St, Downtown",       distance="0.8 km", rating=4.8, reviews=342, phone="+1 555-0101", hours="Open 24/7",        type="gym",  lat=40.712, lng=-74.006),
    Gym(id=2, name="Central Park Fitness Area", address="Central Park, North Loop",    distance="1.2 km", rating=4.6, reviews=220, phone=None,          hours="6AM–10PM",         type="park", lat=40.785, lng=-73.968),
    Gym(id=3, name="Iron Forge Gym",            address="456 Elm Ave, Midtown",        distance="1.5 km", rating=4.7, reviews=198, phone="+1 555-0202", hours="Mon–Sun 5AM–11PM", type="gym",  lat=40.754, lng=-73.984),
    Gym(id=4, name="Riverside Park Trail",      address="Riverside Dr & 72nd St",      distance="2.1 km", rating=4.5, reviews=156, phone=None,          hours="Always Open",       type="park", lat=40.777, lng=-73.989),
    Gym(id=5, name="PureFlow Yoga & Fitness",   address="789 Oak Blvd, Upper East",    distance="2.8 km", rating=4.9, reviews=412, phone="+1 555-0303", hours="Mon–Sat 6AM–9PM",  type="gym",  lat=40.773, lng=-73.958),
]


@router.get("/gyms", response_model=list[Gym])
async def get_gyms(
    lat: float = Query(40.712, description="Latitude"),
    lng: float = Query(-74.006, description="Longitude"),
):
    places = await get_nearby_places(lat, lng)
    if places:
        return places
    return _MOCK_GYMS
