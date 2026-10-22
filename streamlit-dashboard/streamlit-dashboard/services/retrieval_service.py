"""Retrieval service for RAG evidence synthesis and semantic search."""

from collections import Counter
from typing import Any, Dict, List, Optional
import pandas as pd
from services.api_client import APIClient
from services.data_loader import load_reviews_dataset
from utils.validation import validate_question_text


class RetrievalService:
    """Provides evidence-grounded feedback retrieval and assistant responses."""

    def __init__(self, api_client: APIClient):
        self.api = api_client

    def ask(
        self,
        question: str,
        top_k: int = 8,
        domain: Optional[str] = None,
        sentiment: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Query AI research assistant for grounded synthesis and review citations.
        Prefers FastAPI backend; falls back to local corpus matching if offline.
        """
        is_valid, err = validate_question_text(question)
        if not is_valid:
            return {"success": False, "error": err}

        # 1. Try FastAPI backend
        api_res = self.api.ask_assistant(question, top_k=top_k, domain=domain, sentiment=sentiment)
        if api_res.get("success") and "data" in api_res:
            data = api_res["data"]
            return {
                "success": True,
                "source": "api",
                "question": data.get("question", question),
                "summary": data.get("summary", ""),
                "retrieved_count": data.get("retrieved_count", 0),
                "sentiment_distribution": data.get("sentiment_distribution", {}),
                "negative_share": data.get("negative_share", 0.0),
                "evidence": data.get("evidence", []),
                "limitations": data.get("limitations", []),
            }

        # 2. Local fallback using loaded reviews dataframe
        reviews_df, ok = load_reviews_dataset()
        if not ok or reviews_df.empty:
            return {
                "success": False,
                "error": "Review dataset unavailable and API is unreachable.",
            }

        # Filter by domain and sentiment
        df = reviews_df.copy()
        if domain and domain.lower() != "all":
            df = df[df["domain"].str.lower() == domain.strip().lower()]
        if sentiment and sentiment.lower() != "all":
            df = df[df["overall_sentiment"].str.lower() == sentiment.strip().lower()]

        # Token-based relevance search
        query_terms = [w.lower() for w in question.split() if len(w) > 3]
        if not query_terms:
            query_terms = [question.lower().strip()]

        def score_text(txt: str) -> int:
            t = txt.lower()
            return sum(1 for term in query_terms if term in t)

        df["match_score"] = df["text"].apply(score_text)
        matched = df[df["match_score"] > 0].sort_values("match_score", ascending=False).head(top_k)

        if matched.empty:
            # Fallback to top head rows if no direct keyword match
            matched = df.head(min(top_k, len(df)))

        evidence_items: List[Dict[str, Any]] = []
        for _, row in matched.iterrows():
            evidence_items.append({
                "review_id": row.get("review_id", row.get("row_index")),
                "domain": row.get("domain", "Unknown"),
                "sentiment": row.get("overall_sentiment", "Unknown"),
                "text": row.get("text", ""),
                "similarity_score": round(float(row.get("match_score", 1.0)) / max(len(query_terms), 1), 2),
            })

        sent_counts = Counter(item["sentiment"] for item in evidence_items)
        neg_count = sum(v for k, v in sent_counts.items() if "negative" in str(k).lower())
        total = len(evidence_items)
        neg_share = neg_count / total if total > 0 else 0.0

        summary = (
            f"Found {total} student reviews relevant to your query. "
            f"Sentiment breakdown: {dict(sent_counts)}. "
            f"Negative feedback constitutes {neg_share*100:.0f}% of the retrieved sample."
        )

        return {
            "success": True,
            "source": "local_corpus",
            "warning": "API backend offline. Displaying evidence retrieved from local corpus using keyword matching.",
            "question": question,
            "summary": summary,
            "retrieved_count": total,
            "sentiment_distribution": dict(sent_counts),
            "negative_share": neg_share,
            "evidence": evidence_items,
            "limitations": [
                "Based on local keyword matching over the 6,500 review dataset.",
                "Full dense semantic embeddings require the deployed backend service.",
            ],
        }
