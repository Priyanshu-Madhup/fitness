# FitAI Backend

FastAPI backend for the FitAI application.

## Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env file and fill in your keys
copy .env.example .env

# Run development server
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/generate-plan` | Generate personalised workout & nutrition plan |
| POST | `/chat` | AI chatbot – fitness Q&A |
| GET | `/events` | List upcoming fitness events |
| GET | `/gyms` | Nearby gyms / parks (lat, lng params) |
| GET | `/videos` | Exercise demo videos |
| GET | `/health` | Health check |

## Project Structure

```
backend/
├── app/
│   ├── main.py          ← FastAPI app entry point
│   ├── config.py        ← Settings via pydantic-settings
│   ├── routers/
│   │   ├── plan.py      ← /generate-plan
│   │   ├── chat.py      ← /chat
│   │   ├── events.py    ← /events
│   │   ├── gyms.py      ← /gyms
│   │   └── videos.py    ← /videos
│   ├── models/
│   │   └── schemas.py   ← Pydantic request/response models
│   └── services/
│       ├── ai_service.py    ← OpenAI / LLM integration
│       └── maps_service.py  ← TomTom / Maps integration
├── requirements.txt
└── .env.example
```
