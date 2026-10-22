# Student Feedback Intelligence 3.0 — Core Package

This directory contains the core full-stack application for the **Student Feedback Intelligence 3.0** platform:
- `api/` — Production FastAPI REST API
- `frontend/` — React 18 + Vite + TypeScript glassmorphic web platform
- `src/retrieval/` — SemanticRetriever and deterministic RAG evidence synthesis pipeline
- `data/processed/edurabsa/` — Precomputed sentence embeddings (`all-MiniLM-L6-v2`) and metadata
- `render.yaml` — Deployment blueprint specification for Render

For comprehensive architecture diagrams, machine learning evaluation benchmarks, live deployment links, and local setup guides, please refer to the primary root documentation:

👉 **[Root Project README.md](../README.md)**

---

## Live Production Links

* **Live Platform (Vercel):** [https://student-feedback-intelligence-3-0.vercel.app/](https://student-feedback-intelligence-3-0.vercel.app/)
* **Backend API (Render):** [https://student-feedback-intelligence-3-0.onrender.com](https://student-feedback-intelligence-3-0.onrender.com)
* **API Documentation (Swagger):** [https://student-feedback-intelligence-3-0.onrender.com/docs](https://student-feedback-intelligence-3-0.onrender.com/docs)
* **Health Check:** [https://student-feedback-intelligence-3-0.onrender.com/health](https://student-feedback-intelligence-3-0.onrender.com/health)
* **GitHub Repository:** [https://github.com/Utkarsh-sengar3/student-feedback-intelligence-3.0](https://github.com/Utkarsh-sengar3/student-feedback-intelligence-3.0)

---

## Quick Local Startup

### Backend (FastAPI)
```powershell
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload
```
*(Or double-click `run_api.bat` on Windows).*

### Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.
