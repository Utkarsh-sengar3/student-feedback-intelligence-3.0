"""Page 4: Reviews Explorer with search, filters, pagination, and export."""

import streamlit as st
from components.tables import render_paginated_table
from services.data_loader import load_reviews_dataset
from utils.formatting import get_sentiment_badge_html


def render_reviews_explorer_page():
    """Render searchable, filterable reviews explorer."""
    st.markdown(
        """
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; letter-spacing: -0.02em;">
                Reviews Explorer
            </h1>
            <div style="font-size: 0.95rem; color: #94A3B8;">
                Search, filter, inspect, and export all 6,500 annotated student feedback entries.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    reviews_df, ok = load_reviews_dataset()
    if not ok or reviews_df.empty:
        st.error("Failed to load review metadata. Ensure `review_metadata.csv` exists.")
        return

    # Filter Controls
    with st.expander("🔍 Search & Filter Controls", expanded=True):
        col_s1, col_s2, col_s3, col_s4 = st.columns([2, 1, 1, 1])

        with col_s1:
            search_query = st.text_input(
                "Search text",
                placeholder="Search keywords (e.g. grading, homework, library, Wi-Fi)...",
                key="rev_search",
            )

        with col_s2:
            domains = ["All"] + sorted(reviews_df["domain"].unique().tolist())
            selected_domain = st.selectbox("Domain", options=domains, index=0, key="rev_domain")

        with col_s3:
            sentiments = ["All"] + sorted(reviews_df["overall_sentiment"].unique().tolist())
            selected_sentiment = st.selectbox("Sentiment", options=sentiments, index=0, key="rev_sentiment")

        with col_s4:
            page_size = st.selectbox("Items per page", options=[10, 20, 50, 100], index=1, key="rev_page_size")

    # Apply Filters
    df = reviews_df.copy()

    if selected_domain != "All":
        df = df[df["domain"] == selected_domain]

    if selected_sentiment != "All":
        df = df[df["overall_sentiment"] == selected_sentiment]

    if search_query.strip():
        q = search_query.strip().lower()
        df = df[df["text"].str.lower().str.contains(q, regex=False)]

    total_filtered = len(df)

    col_stat1, col_stat2 = st.columns([3, 1])
    with col_stat1:
        st.markdown(
            f"<div style='color: #94A3B8; font-size: 0.9rem; padding: 6px 0;'>"
            f"Matching reviews: <strong>{total_filtered:,}</strong> of {len(reviews_df):,}"
            f"</div>",
            unsafe_allow_html=True,
        )

    with col_stat2:
        # Export filtered subset
        csv_data = df[["review_id", "domain", "overall_sentiment", "text"]].to_csv(index=False).encode("utf-8")
        st.download_button(
            label="📥 Download CSV",
            data=csv_data,
            file_name="student_feedback_filtered.csv",
            mime="text/csv",
            use_container_width=True,
        )

    st.markdown("<div style='height: 10px;'></div>", unsafe_allow_html=True)

    # Display Table with expandable rows
    if df.empty:
        st.info("No reviews match your query and filter criteria.")
    else:
        # Display cleaner columns
        display_cols = ["review_id", "domain", "overall_sentiment", "text"]
        render_paginated_table(df[display_cols], page_size=page_size, page_key="reviews_explorer_page")

        # Detail Inspector
        st.markdown("---")
        st.markdown("### 🔎 Review Detail Inspector")
        st.caption("Select a row index or ID from the filtered set to view full metadata:")

        first_ids = df["review_id"].head(20).tolist()
        inspect_id = st.selectbox("Select Review ID to inspect", options=first_ids)

        if inspect_id is not None:
            match = df[df["review_id"] == inspect_id]
            if not match.empty:
                r = match.iloc[0]
                badge = get_sentiment_badge_html(r["overall_sentiment"])
                st.markdown(
                    f"""
                    <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; padding: 18px; margin-top: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <div>
                                <span style="font-weight: 700; color: #F1F5F9; font-size: 1.1rem;">Review ID #{r['review_id']}</span>
                                <span style="color: #94A3B8; font-size: 0.85rem; margin-left: 8px;">Domain: {r['domain']}</span>
                            </div>
                            <div>{badge}</div>
                        </div>
                        <div style="font-size: 0.95rem; line-height: 1.6; color: #E2E8F0; background: rgba(10, 15, 30, 0.6); padding: 14px; border-radius: 8px; border-left: 4px solid #6366F1;">
                            "{r['text']}"
                        </div>
                        <div style="margin-top: 10px; font-size: 0.75rem; color: #64748B;">
                            Length: {len(r['text'])} characters · Word Count: {len(r['text'].split())} words
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
