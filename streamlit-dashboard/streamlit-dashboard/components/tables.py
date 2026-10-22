"""Table and list presentation components with pagination support."""

from typing import List, Optional
import pandas as pd
import streamlit as st
from utils.formatting import get_priority_badge_html, get_sentiment_badge_html


def render_paginated_table(
    df: pd.DataFrame,
    page_size: int = 15,
    page_key: str = "table_page",
) -> None:
    """Render a DataFrame with pagination controls."""
    if df.empty:
        st.info("No matching records found.")
        return

    total_records = len(df)
    total_pages = max(1, (total_records + page_size - 1) // page_size)

    if page_key not in st.session_state:
        st.session_state[page_key] = 1

    current_page = st.session_state[page_key]
    if current_page > total_pages:
        current_page = total_pages
        st.session_state[page_key] = current_page

    start_idx = (current_page - 1) * page_size
    end_idx = min(start_idx + page_size, total_records)

    st.caption(f"Showing {start_idx + 1}–{end_idx} of {total_records:,} entries (Page {current_page} of {total_pages})")

    sliced = df.iloc[start_idx:end_idx]
    st.dataframe(sliced, use_container_width=True, hide_index=True)

    # Pagination controls
    col_prev, col_info, col_next = st.columns([1, 2, 1])
    with col_prev:
        if st.button("⬅ Previous", key=f"{page_key}_prev", disabled=(current_page <= 1)):
            st.session_state[page_key] -= 1
            st.rerun()

    with col_info:
        st.markdown(
            f"<div style='text-align: center; color: #94A3B8; font-size: 0.85rem; padding-top: 6px;'>"
            f"Page {current_page} / {total_pages}"
            f"</div>",
            unsafe_allow_html=True,
        )

    with col_next:
        if st.button("Next ➡", key=f"{page_key}_next", disabled=(current_page >= total_pages)):
            st.session_state[page_key] += 1
            st.rerun()


def render_evidence_cards(evidence_list: List[dict]):
    """Render expandable evidence items for RAG and prediction outputs."""
    if not evidence_list:
        st.caption("No supporting evidence items available.")
        return

    for i, ev in enumerate(evidence_list):
        sentiment = ev.get("sentiment", "Unknown")
        domain = ev.get("domain", "Unknown")
        sim = ev.get("similarity_score")
        text = ev.get("text", "")
        review_id = ev.get("review_id", f"Review #{i+1}")

        badge_html = get_sentiment_badge_html(sentiment)
        sim_text = f"· Sim: <code>{sim:.3f}</code>" if sim is not None else ""

        with st.expander(f"📌 {domain} · ID {review_id} {sim_text}", expanded=(i == 0)):
            st.markdown(
                f"""
                <div style="margin-bottom: 6px;">
                    {badge_html}
                    <span style="background: rgba(99, 102, 241, 0.15); color: #A5B4FC; padding: 2px 7px; border-radius: 4px; font-size: 0.75rem; margin-left: 6px;">
                        {domain}
                    </span>
                </div>
                <div style="color: #F1F5F9; font-size: 0.9rem; line-height: 1.5; background: rgba(15, 23, 42, 0.5); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #6366F1;">
                    "{text}"
                </div>
                """,
                unsafe_allow_html=True,
            )
