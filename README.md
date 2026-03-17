# FitAI – AI-Powered Fitness Ecosystem

An AI-powered full-stack fitness web app that generates personalised weekly workout and nutrition plans, supports an AI chat coach, finds nearby gyms, lists fitness events, and emails the generated plan directly to you.

**Live Demo**
- Frontend: https://fitness-six-psi.vercel.app
- Backend API: https://fitness-us06.onrender.com

---

## Features

- **AI Plan Generator** — Personalised 7-day workout + nutrition plan via Groq (LLaMA 3.3 70B)
- **Email Delivery** — Full plan emailed automatically on generation via Gmail SMTP
- **AI Chat Coach** — Real-time fitness Q&A powered by the same LLM
- **Nearby Gyms** — Location-based gym finder using TomTom Maps API
- **Fitness Events** — Browse local fitness events and workshops
- **Workout Videos** — Curated exercise video library

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.12, Uvicorn |
| AI / LLM | Groq Cloud — `llama-3.3-70b-versatile` |
| Email | Python `smtplib` + Gmail SMTP |
| Maps | TomTom Maps API |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
fitai_app/
├── frontend/               ← React app (Tailwind CSS, Framer Motion)
│   ├── src/
│   │   ├── pages/          ← GeneratePlanPage, ChatPage, GymsPage, …
│   │   ├── services/api.js ← Axios API client
│   │   └── index.css
│   └── vercel.json
└── backend/                ← FastAPI
    ├── app/
    │   ├── main.py
    │   ├── config.py
    │   ├── routers/        ← plan, chat, events, gyms, videos
    │   ├── services/       ← ai_service, email_service, maps_service
    │   └── models/schemas.py
    ├── requirements.txt
    └── render.yaml
```

---

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
venv\Scripts\activate        # Windows
pip install -r requirements.txt
copy .env.example .env       # then fill in your API keys
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

TOMTOM_API_KEY=your_tomtom_api_key_here

APP_ENV=development
ALLOWED_ORIGINS=http://localhost:3000

# Gmail for plan email (use a Gmail App Password — not your regular password)
EMAIL_ADDRESS=your_gmail@gmail.com
EMAIL_APP_PASSWORD=your_16char_app_password
```

> **Gmail App Password:** Go to [myaccount.google.com/security](https://myaccount.google.com/security) → 2-Step Verification → App passwords → generate one for "Mail".

---

## Deployment

| Service | Config file | Notes |
|---------|------------|-------|
| Render (backend) | `backend/render.yaml` | Set `GROQ_API_KEY`, `EMAIL_ADDRESS`, `EMAIL_APP_PASSWORD` in Render dashboard → Environment |
| Vercel (frontend) | `frontend/vercel.json` | Set `REACT_APP_API_URL=https://your-render-url.onrender.com` in Vercel dashboard |
