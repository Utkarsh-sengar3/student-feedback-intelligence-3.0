"""Prediction service coordinating API-first inference with transparent fallback."""

from typing import Any, Dict
from services.api_client import APIClient
from utils.validation import validate_feedback_text


class PredictionService:
    """Handles feedback sentiment and category prediction."""

    def __init__(self, api_client: APIClient):
        self.api = api_client

    def predict(self, text: str) -> Dict[str, Any]:
        """
        Predict sentiment, aspect categories, severity, and recommendations.
        Tries FastAPI backend first. If unavailable, falls back to deterministic
        Phase 12/15 rulebase and explains artifact status.
        """
        is_valid, err = validate_feedback_text(text)
        if not is_valid:
            return {"success": False, "error": err}

        # 1. Try FastAPI backend
        api_res = self.api.analyze_feedback(text.strip())
        if api_res.get("success") and "data" in api_res:
            data = api_res["data"]
            return {
                "success": True,
                "source": "api",
                "text": data.get("text", text),
                "sentiment": data.get("sentiment"),
                "confidence": data.get("sentiment_confidence"),
                "category": data.get("category"),
                "categories": data.get("categories", []),
                "aspect": data.get("aspect"),
                "aspects": data.get("aspects", []),
                "severity": data.get("severity"),
                "priority_level": data.get("priority_level"),
                "priority_score": data.get("priority_score"),
                "recommendation": data.get("recommendation"),
                "evidence": data.get("evidence", []),
            }

        # 2. Rule-based offline heuristic fallback (matching feedback_service.py rules)
        lower = text.lower()

        # Aspect keyword mapping
        aspect_rules = [
            ("technology", ["wi-fi", "wifi", "internet", "network", "portal", "canvas", "moodle", "blackboard"]),
            ("campus facilities", ["campus", "library", "cafeteria", "facilities", "parking", "dorm", "gym", "classroom"]),
            ("student services", ["student services", "financial aid", "registration", "admissions", "advisor"]),
            ("workload", ["workload", "too much work", "heavy work", "overwhelming"]),
            ("assignment", ["assignment", "essay", "homework", "project", "lab report"]),
            ("exam", ["exam", "midterm", "final", "test", "quiz", "grading"]),
            ("teaching", ["professor", "instructor", "lecturer", "teacher", "teaching", "lecture"]),
            ("difficulty", ["difficult", "hard", "challenging", "complicated"]),
        ]

        detected_aspects = []
        for aspect, keywords in aspect_rules:
            if any(kw in lower for kw in keywords):
                detected_aspects.append(aspect)

        # Basic sentiment heuristic from lexicon
        positive_words = ["great", "excellent", "good", "helpful", "clear", "enjoyed", "amazing", "best", "patient"]
        negative_words = ["terrible", "bad", "poor", "awful", "horrible", "unfair", "confusing", "slow", "broken", "unhelpful"]

        pos_count = sum(1 for w in positive_words if w in lower)
        neg_count = sum(1 for w in negative_words if w in lower)

        if neg_count > pos_count:
            sentiment = "Negative"
        elif pos_count > neg_count:
            sentiment = "Positive"
        else:
            sentiment = "Neutral"

        # Severity heuristic
        severity = "Low"
        if sentiment == "Negative":
            if any(term in lower for term in ["harassment", "unsafe", "abuse", "racist", "threat", "danger"]):
                severity = "Critical"
            elif any(term in lower for term in ["unfair", "bias", "extremely", "unacceptable", "ridiculous"]):
                severity = "High"
            elif any(term in lower for term in ["poor", "bad", "terrible", "difficult", "confusing", "slow"]):
                severity = "Medium"

        return {
            "success": True,
            "source": "offline_heuristic",
            "warning": (
                "FastAPI backend is currently offline. Showing rule-based aspect & severity heuristics. "
                "Full DistilBERT transformer prediction requires the Render API."
            ),
            "text": text,
            "sentiment": sentiment,
            "confidence": None,
            "category": "University - Technology & tools" if "technology" in detected_aspects else None,
            "categories": [f"Aspect: {a}" for a in detected_aspects],
            "aspect": detected_aspects[0] if detected_aspects else None,
            "aspects": detected_aspects,
            "severity": severity,
            "priority_level": "High" if severity in ("Critical", "High") else "Low",
            "priority_score": 0.75 if severity == "High" else 0.25,
            "recommendation": "Review feedback with relevant department lead before taking intervention.",
            "evidence": [],
        }
