"""
Semantic retriever using sentence-transformers and precomputed numpy embeddings.
"""
from __future__ import annotations

import re
import threading
from pathlib import Path
from typing import Optional, Union, Tuple

import numpy as np
import pandas as pd


def parse_query_intent(
    query: str,
    domain: Optional[str] = None,
    sentiment: Optional[str] = None,
    top_k: int = 10,
) -> Tuple[str, Optional[str], Optional[str], int]:
    """
    Extracts semantic intent from natural language queries:
    - Target sentiment ('positive', 'negative', 'neutral')
    - Target domain ('teacher review', 'course review', 'university review')
    - Requested count (e.g. '5', '10')
    - Cleaned query for dense vector encoding
    """
    q_lower = query.lower().strip()

    # 1. Detect requested count if present in query
    count_match = re.search(r'\b([1-9]|1[0-9]|20)\s+(?:positive|negative|neutral|feedback|reviews?|examples?|student|comments?)\b', q_lower)
    if not count_match:
        count_match = re.search(r'^(?:give\s+(?:me\s+)?)?([1-9]|1[0-9]|20)\b', q_lower)
    
    extracted_k = top_k
    if count_match:
        try:
            val = int(count_match.group(1))
            if 1 <= val <= 50:
                extracted_k = val
        except (ValueError, TypeError):
            pass

    # 2. Sentiment intent resolution
    resolved_sentiment = sentiment if sentiment and sentiment.lower() not in ("all", "none", "") else None
    
    if resolved_sentiment is None:
        neg_patterns = [
            r'\b(negative|bad|worst|poor|terrible|horrible|awful)\b',
            r'\b(complaint|complaints|criticism|criticisms|issue|issues|concern|concerns|problem|problems)\b',
            r'\b(waste\s+of\s+time|frustrating|disappointing|unfair)\b',
            r'\bnot\s+(good|great|helpful|clear|fair|worth)\b',
        ]
        pos_patterns = [
            r'\b(positive|good|great|best|excellent|awesome|amazing|wonderful|superb|outstanding)\b',
            r'\b(praise|compliment|compliments|love|loved|helpful|inspiring|favorite|favourite)\b',
        ]
        neu_patterns = [
            r'\b(neutral|mixed|average|moderate|mediocre)\b',
        ]

        is_neg = any(re.search(pat, q_lower) for pat in neg_patterns)
        is_pos = any(re.search(pat, q_lower) for pat in pos_patterns)
        is_neu = any(re.search(pat, q_lower) for pat in neu_patterns)

        if re.search(r'\bnot\s+positive\b', q_lower):
            is_pos = False
            is_neg = True

        if is_pos and not is_neg:
            resolved_sentiment = "positive"
        elif is_neg and not is_pos:
            resolved_sentiment = "negative"
        elif is_neu:
            resolved_sentiment = "neutral"

    # 3. Domain intent resolution
    resolved_domain = domain if domain and domain.lower() not in ("all", "none", "") else None
    
    if resolved_domain is None:
        if re.search(r'\b(teacher|teachers|professor|professors|prof|faculty|instructor|instructors|lecturer|lecturers|teaching|staff)\b', q_lower):
            resolved_domain = "teacher review"
        elif re.search(r'\b(course|courses|class|classes|syllabus|curriculum|exam|exams|midterm|midterms|grading|grades|homework|assignment|assignments|textbook|textbooks|quiz|quizzes)\b', q_lower):
            resolved_domain = "course review"
        elif re.search(r'\b(university|campus|college|admin|administration|library|cafeteria|canteen|food|wifi|wi-fi|internet|hostel|dorm|dormitory|facilities|facility|gym)\b', q_lower):
            resolved_domain = "university review"

    # 4. Cleaned query for dense vector encoding
    cleaned_query = re.sub(r'^(?:give\s+(?:me\s+)?)?[0-9]+\s*', '', query, flags=re.IGNORECASE)
    cleaned_query = re.sub(r'\b(positive|negative|neutral)\s+(?:feedback|reviews?|comments?)\b', 'feedback', cleaned_query, flags=re.IGNORECASE)
    cleaned_query = re.sub(r'\b(positive|negative|neutral)\b', '', cleaned_query, flags=re.IGNORECASE)
    cleaned_query = cleaned_query.strip()
    if not cleaned_query:
        cleaned_query = query

    return cleaned_query, resolved_domain, resolved_sentiment, extracted_k



class SemanticRetriever:
    """
    Loads precomputed review embeddings and supports cosine-similarity search.
    """

    def __init__(
        self,
        embeddings_path: Union[str, Path],
        metadata_path: Union[str, Path],
        model_name: str = "all-MiniLM-L6-v2",
    ):
        self._embeddings_path = Path(embeddings_path)
        self._metadata_path = Path(metadata_path)
        self._model_name = model_name
        self._model = None
        self._model_lock = threading.Lock()

        if not self._embeddings_path.exists():
            raise FileNotFoundError(
                f"Embeddings file not found: {self._embeddings_path}. "
                "Run the Phase 17 embedding script to generate it."
            )
        if not self._metadata_path.exists():
            raise FileNotFoundError(
                f"Metadata file not found: {self._metadata_path}."
            )

        self._embeddings: np.ndarray = np.load(
            str(self._embeddings_path), allow_pickle=False
        ).astype(np.float32)

        # L2-normalize for cosine similarity via dot product
        norms = np.linalg.norm(self._embeddings, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1.0, norms)
        self._embeddings = self._embeddings / norms

        self.metadata: pd.DataFrame = pd.read_csv(str(self._metadata_path))
        # Ensure row_index column
        if "row_index" not in self.metadata.columns:
            self.metadata["row_index"] = range(len(self.metadata))
        self.metadata["row_index"] = self.metadata["row_index"].astype(int)
        self.metadata["text"] = self.metadata.get("text", pd.Series("", index=self.metadata.index)).fillna("").astype(str)
        self.metadata["domain"] = self.metadata.get("domain", pd.Series("unknown", index=self.metadata.index)).fillna("unknown").astype(str)
        self.metadata["overall_sentiment"] = self.metadata.get("overall_sentiment", pd.Series("unknown", index=self.metadata.index)).fillna("unknown").astype(str)

    def _get_model(self):
        """Lazy-load the sentence transformer model."""
        if self._model is None:
            with self._model_lock:
                if self._model is None:
                    from sentence_transformers import SentenceTransformer
                    self._model = SentenceTransformer(self._model_name)
        return self._model

    def warm_up(self):
        """Pre-warm the sentence transformer model in background."""
        try:
            self._get_model()
        except Exception as e:
            print(f"Retriever warm-up notice: {e}")

    def _encode_query(self, query: str) -> Optional[np.ndarray]:
        try:
            model = self._get_model()
            vec = model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
            return vec[0].astype(np.float32)
        except Exception as exc:
            print(f"Dense vector encoding notice ({exc}); using lexical fallback.")
            return None

    def search(
        self,
        query: str,
        top_k: int = 10,
        domain: Optional[str] = None,
        sentiment: Optional[str] = None,
    ) -> pd.DataFrame:
        """
        Cosine-similarity search over precomputed embeddings with intent extraction and lexical fallback.

        Returns a DataFrame with columns:
            row_index, similarity_score, text, domain, overall_sentiment
        """
        cleaned_query, resolved_domain, resolved_sentiment, resolved_k = parse_query_intent(
            query=query,
            domain=domain,
            sentiment=sentiment,
            top_k=top_k,
        )

        query_vec = self._encode_query(cleaned_query)

        if query_vec is not None:
            # Cosine similarity via dot product (embeddings are L2-normalized)
            scores: np.ndarray = self._embeddings @ query_vec
            n = len(scores)
            df = pd.DataFrame(
                {
                    "row_index": np.arange(n),
                    "similarity_score": scores,
                }
            )
            meta = self.metadata[["row_index", "text", "domain", "overall_sentiment"]].copy()
            df = df.merge(meta, on="row_index", how="left")
        else:
            # Lexical keyword matching fallback
            terms = [w.lower() for w in cleaned_query.split() if len(w) > 3 and w.lower() not in {"give", "from", "perspective", "about", "what", "with", "this", "that"}]
            if not terms:
                terms = [w.lower() for w in cleaned_query.split() if len(w) > 1]

            def lexical_score(text: str) -> float:
                t = text.lower()
                matches = sum(1 for term in terms if term in t)
                return float(matches) / max(len(terms), 1)

            meta = self.metadata[["row_index", "text", "domain", "overall_sentiment"]].copy()
            meta["similarity_score"] = meta["text"].apply(lexical_score)
            df = meta

        # Apply domain filter if resolved
        if resolved_domain and resolved_domain.lower() not in ("all", "none", ""):
            filtered_domain = df[df["domain"].str.lower() == resolved_domain.strip().lower()]
            if not filtered_domain.empty:
                df = filtered_domain

        # Apply sentiment filter if resolved
        if resolved_sentiment and resolved_sentiment.lower() not in ("all", "none", ""):
            filtered_sentiment = df[df["overall_sentiment"].str.lower() == resolved_sentiment.strip().lower()]
            if not filtered_sentiment.empty:
                df = filtered_sentiment

        # Sort by similarity descending
        df = df.sort_values("similarity_score", ascending=False)

        # Return the top resolved_k rows
        return df.head(resolved_k).reset_index(drop=True)

    def stats(self) -> dict:
        """Return statistics about the index."""
        n_embeddings = len(self._embeddings)
        embedding_dim = self._embeddings.shape[1] if len(self._embeddings.shape) > 1 else 0

        domains = list(self.metadata["domain"].dropna().unique())
        sentiments = list(self.metadata["overall_sentiment"].dropna().unique())

        return {
            "total_reviews": n_embeddings,
            "embedding_dimension": int(embedding_dim),
            "model": self._model_name,
            "domains": domains,
            "sentiments": sentiments,
        }


# Module-level singleton
_retriever: Optional[SemanticRetriever] = None
_retriever_lock = threading.Lock()
_retriever_key: Optional[tuple] = None


def get_shared_retriever(
    embeddings_path: Union[str, Path],
    metadata_path: Union[str, Path],
    model_name: str = "all-MiniLM-L6-v2",
) -> SemanticRetriever:
    """
    Return a module-level singleton SemanticRetriever.
    Creates the retriever on first call; subsequent calls with the same
    arguments return the cached instance.
    """
    global _retriever, _retriever_key

    key = (str(embeddings_path), str(metadata_path), model_name)

    if _retriever is None or _retriever_key != key:
        with _retriever_lock:
            if _retriever is None or _retriever_key != key:
                _retriever = SemanticRetriever(
                    embeddings_path=embeddings_path,
                    metadata_path=metadata_path,
                    model_name=model_name,
                )
                _retriever_key = key

    return _retriever
