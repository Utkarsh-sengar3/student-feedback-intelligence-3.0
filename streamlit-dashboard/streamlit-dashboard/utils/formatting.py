"""Formatting utilities for UI badges, numbers, metrics, and text."""

from typing import Optional, Union


def format_pct(val: Optional[Union[float, int]], precision: int = 1) -> str:
    """Format float (0-1 or 0-100) as percentage string."""
    if val is None:
        return "Unavailable"
    # If val <= 1.0, treat as fraction
    pct = val * 100.0 if abs(val) <= 1.0 and val != 0 else val
    return f"{pct:.{precision}f}%"


def format_num(val: Optional[Union[int, float]]) -> str:
    """Format integer with thousands separator."""
    if val is None:
        return "Unavailable"
    try:
        return f"{int(val):,}"
    except (ValueError, TypeError):
        return str(val)


def format_score(val: Optional[Union[float, int]], precision: int = 2) -> str:
    """Format decimal score safely."""
    if val is None:
        return "Unavailable"
    try:
        return f"{float(val):.{precision}f}"
    except (ValueError, TypeError):
        return str(val)


def get_sentiment_color(sentiment: Optional[str]) -> str:
    """Return hex color code for sentiment label."""
    if not sentiment:
        return "#64748B"
    s = sentiment.strip().lower()
    if "positive" in s:
        return "#10B981"  # Emerald
    elif "negative" in s:
        return "#EF4444"  # Rose
    elif "neutral" in s:
        return "#6366F1"  # Indigo
    return "#94A3B8"      # Slate


def get_sentiment_badge_html(sentiment: Optional[str]) -> str:
    """Generate HTML badge for sentiment."""
    if not sentiment:
        return '<span class="badge badge-muted">Unknown</span>'
    s = sentiment.strip()
    color = get_sentiment_color(s)
    bg = f"{color}20"
    border = f"{color}40"
    return (
        f'<span style="background-color: {bg}; color: {color}; '
        f'border: 1px solid {border}; padding: 3px 8px; border-radius: 6px; '
        f'font-size: 0.78rem; font-weight: 600; text-transform: uppercase; '
        f'letter-spacing: 0.04em;">{s}</span>'
    )


def get_priority_color(priority: Optional[str]) -> str:
    """Return hex color code for priority level."""
    if not priority:
        return "#64748B"
    p = priority.strip().lower()
    if "critical" in p:
        return "#EF4444"
    elif "high" in p:
        return "#F59E0B"
    elif "medium" in p:
        return "#EAB308"
    elif "low" in p:
        return "#10B981"
    elif "informational" in p:
        return "#3B82F6"
    return "#94A3B8"


def get_priority_badge_html(priority: Optional[str]) -> str:
    """Generate HTML badge for priority level."""
    if not priority:
        return '<span class="badge badge-muted">None</span>'
    p = priority.strip()
    color = get_priority_color(p)
    bg = f"{color}20"
    border = f"{color}40"
    return (
        f'<span style="background-color: {bg}; color: {color}; '
        f'border: 1px solid {border}; padding: 3px 8px; border-radius: 6px; '
        f'font-size: 0.78rem; font-weight: 600; text-transform: uppercase; '
        f'letter-spacing: 0.04em;">{p}</span>'
    )


def truncate_text(text: str, max_chars: int = 140) -> str:
    """Truncate text to max_chars with ellipsis."""
    if not text:
        return ""
    text = text.strip()
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 3] + "..."
