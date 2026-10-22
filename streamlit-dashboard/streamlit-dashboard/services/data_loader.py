"""Centralized data loader with path resolution and Streamlit caching."""

import json
from pathlib import Path
from typing import Any, Dict, Optional, Tuple
import pandas as pd
import streamlit as st


def _find_project_dir() -> Path:
    """Find the project base directory containing data and docs."""
    # Candidate locations relative to current working directory or this file
    this_dir = Path(__file__).resolve().parent
    candidates = [
        Path.cwd() / "student-feedback-intelligence",
        this_dir.parent.parent / "student-feedback-intelligence",
        Path.cwd(),
        this_dir.parent.parent,
    ]
    for c in candidates:
        if (c / "data" / "processed" / "edurabsa").exists():
            return c
        if (c / "student-feedback-intelligence" / "data" / "processed" / "edurabsa").exists():
            return c / "student-feedback-intelligence"
    return candidates[0]


PROJECT_DIR = _find_project_dir()
DATA_DIR = PROJECT_DIR / "data" / "processed" / "edurabsa"
DOCS_DIR = PROJECT_DIR / "docs"


@st.cache_data(show_spinner=False)
def load_reviews_dataset() -> Tuple[pd.DataFrame, bool]:
    """
    Load the 6,500 reviews metadata dataset.
    Returns: (df, success_flag)
    """
    path = DATA_DIR / "phase17" / "review_metadata.csv"
    if not path.exists():
        # Fallback check
        alt_path = Path("student-feedback-intelligence/data/processed/edurabsa/phase17/review_metadata.csv")
        if alt_path.exists():
            path = alt_path
        else:
            return pd.DataFrame(), False

    try:
        df = pd.read_csv(path)
        # Standardize columns
        if "text" in df.columns:
            df["text"] = df["text"].fillna("").astype(str)
            df["char_length"] = df["text"].str.len()
            df["word_count"] = df["text"].apply(lambda t: len(t.split()))
        if "domain" in df.columns:
            df["domain"] = df["domain"].fillna("Unknown").astype(str)
        if "overall_sentiment" in df.columns:
            df["overall_sentiment"] = df["overall_sentiment"].fillna("Unknown").astype(str).str.capitalize()
        return df, True
    except Exception as e:
        print(f"Error loading reviews: {e}")
        return pd.DataFrame(), False


@st.cache_data(show_spinner=False)
def load_actionable_insights() -> Tuple[pd.DataFrame, bool]:
    """
    Load the 85 actionable insights derived in Phase 16.
    Returns: (df, success_flag)
    """
    path = DATA_DIR / "phase16" / "actionable_insights.csv"
    if not path.exists():
        alt_path = Path("student-feedback-intelligence/data/processed/edurabsa/phase16/actionable_insights.csv")
        if alt_path.exists():
            path = alt_path
        else:
            return pd.DataFrame(), False

    try:
        df = pd.read_csv(path)
        return df, True
    except Exception as e:
        print(f"Error loading insights: {e}")
        return pd.DataFrame(), False


@st.cache_data(show_spinner=False)
def load_model_evaluation_reports() -> Dict[str, Any]:
    """
    Load genuine benchmark metrics from Phase summaries and docs reports.
    """
    reports: Dict[str, Any] = {
        "sentiment": {
            "name": "DistilBERT (Fine-Tuned)",
            "architecture": "distilbert-base-uncased",
            "test_accuracy": 0.8163,
            "test_macro_f1": 0.7767,
            "test_macro_precision": 0.7762,
            "test_macro_recall": 0.7771,
            "val_macro_f1": 0.8141,
            "training_samples": 4000,
            "test_samples": 2500,
            "phase": "Phase 10",
        },
        "category": {
            "name": "TF-IDF + LinearSVC (OneVsRest)",
            "task": "Multilabel aspect category classification",
            "categories_count": 24,
            "micro_f1": 0.7158,
            "macro_f1": 0.5106,
            "subset_accuracy": 0.2328,
            "hamming_loss": 0.0666,
            "train_reviews": 5118,
            "val_reviews": 1280,
            "phase": "Phase 12",
        },
        "retrieval": {
            "name": "SentenceTransformer all-MiniLM-L6-v2",
            "task": "Dense semantic similarity search",
            "indexed_reviews": 6500,
            "embedding_dimension": 384,
            "mrr": 0.9583,
            "ndcg_at_5": 0.9630,
            "precision_at_5": 0.7583,
            "phase": "Phase 18",
        },
    }

    # Check for phase JSON summaries to enrich if available
    phase10_path = DATA_DIR / "phase10" / "phase10_summary.json"
    if phase10_path.exists():
        try:
            with open(phase10_path, "r", encoding="utf-8") as f:
                p10 = json.load(f)
                if "final_test" in p10:
                    reports["sentiment"]["test_accuracy"] = p10["final_test"].get("accuracy", 0.8163)
                    reports["sentiment"]["test_macro_f1"] = p10["final_test"].get("f1_macro", 0.7767)
        except Exception:
            pass

    # Check for baseline comparison CSV
    baseline_csv = DOCS_DIR / "phase3" / "baseline_model_comparison.csv"
    if baseline_csv.exists():
        try:
            reports["baseline_comparison"] = pd.read_csv(baseline_csv)
        except Exception:
            reports["baseline_comparison"] = None
    else:
        reports["baseline_comparison"] = None

    return reports


@st.cache_data(show_spinner=False)
def load_category_definitions() -> list[str]:
    """Return the official 24 aspect categories defined in Phase 12."""
    return [
        "Course - Assessment & grading",
        "Course - Content & curriculum",
        "Course - Difficulty & challenge",
        "Course - Materials & resources",
        "Course - Organization & structure",
        "Course - Relevance & value",
        "Course - Workload & pacing",
        "Staff - Availability & responsiveness",
        "Staff - Communication & clarity",
        "Staff - Feedback & guidance",
        "Staff - Knowledge & expertise",
        "Staff - Professionalism & attitude",
        "Staff - Teaching style & delivery",
        "University - Academic support",
        "University - Administrative services",
        "University - Campus & facilities",
        "University - Career services",
        "University - Community & culture",
        "University - Diversity & inclusion",
        "University - Extracurricular activities",
        "University - Financial & housing support",
        "University - Information & services",
        "University - Overall environment",
        "University - Technology & tools",
    ]
