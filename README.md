# FitAI – AI-Powered Fitness Ecosystem

Full-stack project with a React frontend and FastAPI backend.

```
fitai_app/
├── frontend/   ← React app (Tailwind CSS, Framer Motion)
└── backend/    ← FastAPI (Python, OpenAI, TomTom)
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm start        # http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env  # then add your API keys
uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`
