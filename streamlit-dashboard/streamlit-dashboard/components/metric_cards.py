"""Glassmorphic metric cards component with high-contrast accessibility."""

from typing import List, Optional
import streamlit as st


def render_metric_card(
    label: str,
    value: str,
    subtext: Optional[str] = None,
    badge: Optional[str] = None,
    accent_color: str = "#6366F1",
):
    """Render a single glassmorphic metric card."""
    badge_html = (
        f'<span style="background: {accent_color}20; color: {accent_color}; '
        f'padding: 2px 7px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; '
        f'border: 1px solid {accent_color}40;">{badge}</span>'
        if badge
        else ""
    )

    subtext_html = (
        f'<div style="font-size: 0.8rem; color: #94A3B8; margin-top: 4px;">{subtext}</div>'
        if subtext
        else ""
    )

    card_html = f"""
    <div style="
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(99, 102, 241, 0.2);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 12px;
        padding: 18px 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        margin-bottom: 12px;
    ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em;">
                {label}
            </span>
            {badge_html}
        </div>
        <div style="font-size: 1.85rem; font-weight: 700; color: #F1F5F9; letter-spacing: -0.02em; line-height: 1.1;">
            {value}
        </div>
        {subtext_html}
    </div>
    """
    st.markdown(card_html, unsafe_allow_html=True)


def render_metric_row(cards: List[dict]):
    """Render multiple cards side-by-side in balanced columns."""
    if not cards:
        return
    cols = st.columns(len(cards))
    for col, card in zip(cols, cards):
        with col:
            render_metric_card(
                label=card.get("label", ""),
                value=card.get("value", ""),
                subtext=card.get("subtext"),
                badge=card.get("badge"),
                accent_color=card.get("accent_color", "#6366F1"),
            )
