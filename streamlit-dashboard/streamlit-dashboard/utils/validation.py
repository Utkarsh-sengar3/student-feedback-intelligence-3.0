"""Input validation utilities for dashboard inputs."""

from typing import Tuple


def validate_feedback_text(text: str, min_chars: int = 3, max_chars: int = 5000) -> Tuple[bool, str]:
    """Validate student feedback input text."""
    if not text or not text.strip():
        return False, "Feedback text cannot be empty."
    
    clean = text.strip()
    if len(clean) < min_chars:
        return False, f"Feedback text must be at least {min_chars} characters long (currently {len(clean)})."
    
    if len(clean) > max_chars:
        return False, f"Feedback text exceeds maximum length of {max_chars:,} characters (currently {len(clean):,})."
    
    return True, ""


def validate_question_text(question: str, min_chars: int = 3, max_chars: int = 2000) -> Tuple[bool, str]:
    """Validate research assistant question input."""
    if not question or not question.strip():
        return False, "Question cannot be empty."
    
    clean = question.strip()
    if len(clean) < min_chars:
        return False, f"Question must be at least {min_chars} characters long."
    
    if len(clean) > max_chars:
        return False, f"Question exceeds maximum length of {max_chars:,} characters."
        
    return True, ""
