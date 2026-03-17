import os
import re
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


async def generate_fitness_plan(user_data: dict) -> dict:
    prompt = f"""You are an expert personal trainer and certified nutritionist.
Create a detailed personalised weekly fitness plan for:
- Age: {user_data.get('age')}, Gender: {user_data.get('gender')}
- Weight: {user_data.get('weight')} kg, Height: {user_data.get('height', 'N/A')} cm
- Goal: {user_data.get('goal')}, Activity: {user_data.get('activity_level')}
- Diet: {user_data.get('diet_preference', 'none')}, Sleep: {user_data.get('sleep_hours', 'N/A')} hrs
- Stress: {user_data.get('stress_level', 'N/A')}/10, Conditions: {user_data.get('health_conditions', 'none')}

Respond with EXACTLY three sections separated by ---
Use ONLY clean HTML tags. NO markdown, NO asterisks, NO dashes as bullets.

SECTION 1 - WORKOUT PLAN:
For each of the 7 days wrap content with <!-- DAY:DayName --> and <!-- END_DAY --> like this:
<!-- DAY:Monday -->
<h3>Monday – Chest &amp; Triceps</h3>
<ul>
  <li><strong>Bench Press</strong> – 4 sets × 8 reps</li>
  <li><strong>Push-ups</strong> – 3 sets × 15 reps</li>
</ul>
<!-- END_DAY -->
(repeat for Tuesday through Sunday)

---

SECTION 2 - NUTRITION PLAN:
Return clean HTML using <h3>, <ul>, <li>, <strong>, <p> only.

---

SECTION 3 - TIPS & RECOMMENDATIONS:
Return clean HTML using <h3>, <ul>, <li>, <strong>, <p> only."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=2500,
    )
    content = response.choices[0].message.content or ""
    parts = [p.strip() for p in content.split("---")]

    workout_raw = parts[0] if len(parts) > 0 else content
    nutrition_html = parts[1] if len(parts) > 1 else ""
    tips_html = parts[2] if len(parts) > 2 else ""

    day_pattern = re.compile(r'<!--\s*DAY:(\w+)\s*-->(.*?)<!--\s*END_DAY\s*-->', re.DOTALL)
    workout_days = [
        {"day": m.group(1), "html": m.group(2).strip()}
        for m in day_pattern.finditer(workout_raw)
    ]
    if not workout_days:
        workout_days = [{"day": "Full Plan", "html": workout_raw}]

    return {
        "workout_days": workout_days,
        "nutrition_plan": nutrition_html,
        "tips": tips_html,
    }


async def chat_with_ai(messages: list[dict]) -> str:
    """Forward a conversation to the LLM and return the reply."""
    system_msg = {
        "role": "system",
        "content": (
            "You are FitAI, an expert AI fitness coach and nutritionist. "
            "Answer questions about workouts, nutrition, recovery, and healthy lifestyle. "
            "Keep responses concise, practical, and motivating. "
            "If asked about medical conditions, recommend consulting a doctor."
        ),
    }
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[system_msg, *messages],
        temperature=0.7,
        max_tokens=800,
    )
    return response.choices[0].message.content or "Sorry, I could not generate a response."
