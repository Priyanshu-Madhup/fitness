from fastapi import APIRouter, HTTPException
from app.models.schemas import PlanRequest, PlanResponse
from app.services.ai_service import generate_fitness_plan

router = APIRouter()


@router.post("/generate-plan", response_model=PlanResponse)
async def generate_plan(payload: PlanRequest):
    try:
        result = await generate_fitness_plan(payload.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
