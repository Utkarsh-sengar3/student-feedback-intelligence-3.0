"""API Client for Student Feedback Intelligence FastAPI backend."""

import os
from typing import Any, Dict, Optional
import requests
import streamlit as st


def get_api_base_url() -> str:
    """Resolve API base URL from Streamlit secrets, environment, or default."""
    try:
        if hasattr(st, "secrets") and "API_BASE_URL" in st.secrets:
            return st.secrets["API_BASE_URL"].rstrip("/")
    except Exception:
        pass
    return os.getenv("API_BASE_URL", "http://127.0.0.1:8000").rstrip("/")


class APIClient:
    """Client for interacting with the FastAPI backend."""

    def __init__(self, base_url: Optional[str] = None, timeout: int = 10):
        self.base_url = (base_url or get_api_base_url()).rstrip("/")
        self.timeout = timeout

    def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Perform GET request with structured error handling."""
        url = f"{self.base_url}{endpoint}"
        try:
            resp = requests.get(url, params=params, timeout=self.timeout)
            if resp.status_code == 200:
                return {"success": True, "data": resp.json(), "status_code": 200}
            return {
                "success": False,
                "error": f"API returned status {resp.status_code}: {resp.text}",
                "status_code": resp.status_code,
            }
        except requests.exceptions.Timeout:
            return {"success": False, "error": f"Request to {url} timed out ({self.timeout}s).", "status_code": 408}
        except requests.exceptions.ConnectionError:
            return {
                "success": False,
                "error": f"Could not connect to API server at {self.base_url}. Service may be offline or starting up.",
                "status_code": 503,
            }
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}", "status_code": 500}

    def _post(self, endpoint: str, json_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform POST request with structured error handling."""
        url = f"{self.base_url}{endpoint}"
        try:
            resp = requests.post(url, json=json_data, timeout=self.timeout)
            if resp.status_code == 200:
                return {"success": True, "data": resp.json(), "status_code": 200}
            return {
                "success": False,
                "error": f"API returned status {resp.status_code}: {resp.text}",
                "status_code": resp.status_code,
            }
        except requests.exceptions.Timeout:
            return {"success": False, "error": f"Request to {url} timed out ({self.timeout}s).", "status_code": 408}
        except requests.exceptions.ConnectionError:
            return {
                "success": False,
                "error": f"Could not connect to API server at {self.base_url}. Service may be offline.",
                "status_code": 503,
            }
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}", "status_code": 500}

    def check_health(self) -> Dict[str, Any]:
        """Ping /health endpoint."""
        return self._get("/health")

    def get_status(self) -> Dict[str, Any]:
        """Check model and service statuses at /api/v1/status."""
        return self._get("/api/v1/status")

    def analyze_feedback(self, text: str) -> Dict[str, Any]:
        """Submit student feedback to /api/v1/analyze."""
        return self._post("/api/v1/analyze", {"text": text})

    def get_reviews(
        self,
        page: int = 1,
        page_size: int = 20,
        domain: Optional[str] = None,
        sentiment: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Fetch paginated reviews from /api/v1/reviews/."""
        params = {"page": page, "page_size": page_size}
        if domain and domain.lower() != "all":
            params["domain"] = domain
        if sentiment and sentiment.lower() != "all":
            params["sentiment"] = sentiment
        if search and search.strip():
            params["search"] = search.strip()
        return self._get("/api/v1/reviews/", params=params)

    def get_insights(self) -> Dict[str, Any]:
        """Fetch all actionable insights from /api/v1/insights/."""
        return self._get("/api/v1/insights/")

    def get_top_insights(self, limit: int = 10) -> Dict[str, Any]:
        """Fetch top actionable insights from /api/v1/insights/top."""
        return self._get("/api/v1/insights/top", params={"limit": limit})

    def get_insights_summary(self) -> Dict[str, Any]:
        """Fetch summary statistics from /api/v1/insights/summary."""
        return self._get("/api/v1/insights/summary")

    def get_model_metrics(self) -> Dict[str, Any]:
        """Fetch benchmark model metrics from /api/v1/model-metrics/."""
        return self._get("/api/v1/model-metrics/")

    def search_reviews(
        self,
        query: str,
        top_k: int = 10,
        domain: Optional[str] = None,
        sentiment: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Perform semantic search via /api/v1/search/."""
        params = {"query": query, "top_k": top_k}
        if domain and domain.lower() != "all":
            params["domain"] = domain
        if sentiment and sentiment.lower() != "all":
            params["sentiment"] = sentiment
        return self._get("/api/v1/search/", params=params)

    def ask_assistant(
        self,
        question: str,
        top_k: int = 8,
        domain: Optional[str] = None,
        sentiment: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Send question to RAG Assistant at /api/v1/assistant/."""
        payload = {"question": question, "top_k": top_k}
        if domain and domain.lower() != "all":
            payload["domain"] = domain
        if sentiment and sentiment.lower() != "all":
            payload["sentiment"] = sentiment
        return self._post("/api/v1/assistant/", payload)
