# FeedbackIntel — Standalone Streamlit Analytics Dashboard

A dedicated, research-grade Streamlit web application providing deep visual analytics, interactive metric inspection, review exploration, RAG evidence grounding, and live feedback prediction for the **Student Feedback Intelligence** project.

---

## 🏛 Architecture & Independence

This Streamlit application is **completely separate** from:
- The **React/Vite Frontend** deployed on Vercel (`student-feedback-intelligence/frontend/`)
- The **FastAPI Backend** deployed on Render (`student-feedback-intelligence/api/`)

It operates in **Dual-Mode**:
1. **Live API Connected Mode**: When configured with `API_BASE_URL`, queries the deployed Render backend for live DistilBERT sequence inference, multilabel classification, and dense vector semantic search.
2. **Standalone Local Data Mode**: Reads directly from the local EduRABSA processed benchmark datasets (`review_metadata.csv`, `actionable_insights.csv`, and Phase evaluation reports) to ensure uninterrupted offline exploration.

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- Python 3.10+
- The `streamlit-dashboard/requirements.txt` dependencies:
  ```bash
  cd streamlit-dashboard
  pip install -r requirements.txt
  ```

### 2. Launching the Dashboard
From the repository root or from inside `streamlit-dashboard`:
```bash
# From repository root
streamlit run streamlit-dashboard/app.py

# Or from inside streamlit-dashboard/
cd streamlit-dashboard
streamlit run app.py
```

The application will launch in your browser at `http://localhost:8501`.

---

## 🌐 Deploying to Streamlit Community Cloud

Follow these steps to deploy on Streamlit Community Cloud:

1. **Sign in to Streamlit Cloud**: Go to [share.streamlit.io](https://share.streamlit.io/) and log in with your GitHub account.
2. **New App**: Click the **"New app"** button.
3. **Repository Settings**:
   - **Repository**: `Utkarsh-sengar3/student-feedback-intelligence-2.0`
   - **Branch**: `main`
   - **Main file path**: `streamlit-dashboard/app.py`
4. **Environment Secrets (Advanced Settings)**:
   Add your deployed Render backend URL in the Secrets panel:
   ```toml
   API_BASE_URL = "https://student-feedback-intelligence-api.onrender.com"
   ```
5. **Deploy**: Click **"Deploy!"**. Streamlit will install `streamlit-dashboard/requirements.txt` and launch the app.

---

## 📑 Feature Inventory & Working Status

| Page / Capability | Working Status | Underlying Data / Method |
| :--- | :---: | :--- |
| **Executive Overview** | ✅ Fully Functional | Reads real 6,500 EduRABSA reviews & 85 Phase 16 Actionable Insights |
| **Graphs & Visual Analytics** | ✅ Fully Functional | Interactive Plotly charts filtering by domain, sentiment, text length, and priority |
| **Model Performance** | ✅ Fully Functional | Genuine evaluation reports: DistilBERT (81.6% acc), LinearSVC (71.6% F1), MiniLM (95.8% MRR) |
| **Reviews Explorer** | ✅ Fully Functional | Full text search, multi-attribute filtering, pagination, inspection, and CSV export |
| **AI Research Assistant** | ✅ Fully Functional | Dual-mode: API RAG synthesis with dense embeddings or local corpus keyword relevance fallback |
| **Feedback Prediction** | ✅ Fully Functional | Queries Render FastAPI `/api/v1/analyze` when online; provides heuristic aspect tagging when offline |

---

## ⚙️ Configuration & Secrets

The application looks for the backend URL in the following order:
1. `st.secrets["API_BASE_URL"]` (configured in Streamlit Cloud dashboard or `.streamlit/secrets.toml`)
2. `os.environ["API_BASE_URL"]` (environment variable)
3. Default: `http://127.0.0.1:8000`

---

## 🛠 Troubleshooting

- **"FastAPI Backend: Offline" Badge**: The dashboard continues to function using local data files. Check that your Render web service has finished building and is listening on its port.
- **Port Conflict**: If port 8501 is in use, pass a custom port: `streamlit run streamlit-dashboard/app.py --server.port 8502`.
