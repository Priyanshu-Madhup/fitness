from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import PlanRequest, PlanResponse
from app.services.ai_service import generate_fitness_plan
from app.services.email_service import send_plan_email
from app.config import settings

router = APIRouter()


@router.post("/generate-plan", response_model=PlanResponse)
async def generate_plan(payload: PlanRequest, background_tasks: BackgroundTasks):
    try:
        result = await generate_fitness_plan(payload.model_dump())
        background_tasks.add_task(
            send_plan_email,
            result,
            settings.email_address,
            settings.email_app_password,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
