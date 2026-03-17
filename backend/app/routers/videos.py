from fastapi import APIRouter, Query
from app.models.schemas import Video

router = APIRouter()

_VIDEOS: list[Video] = [
    Video(id=1, title="Perfect Push-Up Form – Full Tutorial",         category="Upper Body", duration="8:24",  thumbnail="https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg", videoId="IODxDxX7oi4", difficulty="Beginner",     muscle="Chest, Shoulders, Triceps"),
    Video(id=2, title="Deadlift Masterclass for Beginners",           category="Lower Body", duration="12:15", thumbnail="https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg", videoId="op9kVnSso6Q", difficulty="Intermediate", muscle="Hamstrings, Glutes, Lower Back"),
    Video(id=3, title="Full Body HIIT – No Equipment",                category="HIIT",       duration="25:00", thumbnail="https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg", videoId="ml6cT4AZdqI", difficulty="Intermediate", muscle="Full Body"),
    Video(id=4, title="How to Do a Proper Squat",                     category="Lower Body", duration="6:50",  thumbnail="https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg", videoId="aclHkVaku9U", difficulty="Beginner",     muscle="Quads, Glutes, Hamstrings"),
    Video(id=5, title="Pull-Up Progression – From Zero to Ten",       category="Upper Body", duration="10:35", thumbnail="https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg", videoId="eGo4IYlbE5g", difficulty="Intermediate", muscle="Back, Biceps"),
    Video(id=6, title="30-Min Morning Yoga Flow",                     category="Yoga",       duration="30:00", thumbnail="https://img.youtube.com/vi/v7AYKMP6rOE/hqdefault.jpg", videoId="v7AYKMP6rOE", difficulty="Beginner",     muscle="Full Body Flexibility"),
    Video(id=7, title="Bench Press – Technique & Common Mistakes",    category="Upper Body", duration="9:45",  thumbnail="https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg", videoId="rT7DgCr-3pg", difficulty="Intermediate", muscle="Chest, Triceps, Shoulders"),
    Video(id=8, title="Core & Abs – 15-Min Workout",                  category="Core",       duration="15:00", thumbnail="https://img.youtube.com/vi/DHD1-2P94DI/hqdefault.jpg", videoId="DHD1-2P94DI", difficulty="Beginner",     muscle="Core, Abs"),
    Video(id=9, title="Running Form Correction for Speed",            category="Cardio",     duration="7:20",  thumbnail="https://img.youtube.com/vi/wCVSv7UxB2E/hqdefault.jpg", videoId="wCVSv7UxB2E", difficulty="All Levels",   muscle="Full Body"),
]


@router.get("/videos", response_model=list[Video])
async def get_videos(query: str = Query("", description="Search term")):
    if not query:
        return _VIDEOS
    q = query.lower()
    return [v for v in _VIDEOS if q in v.title.lower() or q in v.muscle.lower() or q in v.category.lower()]
