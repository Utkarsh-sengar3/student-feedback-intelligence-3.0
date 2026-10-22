"""Page 2: Interactive Analytics, Aspect Breakdown & Concept Distributions."""

import streamlit as st
from components.charts import (
    create_concept_priority_scatter,
    create_length_distribution_chart,
    create_priority_distribution_bar,
    create_sentiment_by_domain_chart,
    create_sentiment_donut_chart,
)
from services.data_loader import load_actionable_insights, load_reviews_dataset


def render_graphs_clusters_page():
    """Render interactive analytics page with responsive Plotly charts."""
    st.markdown(
        """
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; letter-spacing: -0.02em;">
                Graphs & Visual Analytics
            </h1>
            <div style="font-size: 0.95rem; color: #94A3B8;">
                Interactive exploration of sentiment distributions, domain patterns, and concept priority clusters.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # 1. Load Data
    reviews_df, reviews_ok = load_reviews_dataset()
    insights_df, insights_ok = load_actionable_insights()

    if not reviews_ok or reviews_df.empty:
        st.error("Reviews dataset is unavailable. Please verify the `data/processed/edurabsa/` path.")
        return

    # 2. Interactive Filter Bar
    with st.expander("🔍 Interactive Data Filters", expanded=True):
        col_f1, col_f2, col_f3 = st.columns([1, 1, 2])

        with col_f1:
            all_domains = ["All"] + sorted(reviews_df["domain"].unique().tolist())
            selected_domain = st.selectbox("Filter by Domain", options=all_domains, index=0)

        with col_f2:
            all_sentiments = ["All"] + sorted(reviews_df["overall_sentiment"].unique().tolist())
            selected_sentiment = st.selectbox("Filter by Sentiment", options=all_sentiments, index=0)

        with col_f3:
            search_query = st.text_input("Filter by Text Keyword", placeholder="e.g. professor, exam, library...")

    # Apply filters to reviews
    filtered_df = reviews_df.copy()
    if selected_domain != "All":
        filtered_df = filtered_df[filtered_df["domain"] == selected_domain]
    if selected_sentiment != "All":
        filtered_df = filtered_df[filtered_df["overall_sentiment"] == selected_sentiment]
    if search_query.strip():
        q = search_query.strip().lower()
        filtered_df = filtered_df[filtered_df["text"].str.lower().str.contains(q, regex=False)]

    st.caption(f"Displaying analytics for **{len(filtered_df):,}** of {len(reviews_df):,} matching feedback entries.")

    st.markdown("<div style='height: 14px;'></div>", unsafe_allow_html=True)

    # 3. Chart Row 1: Sentiment & Domain Breakdown
    col_r1_1, col_r1_2 = st.columns(2)

    with col_r1_1:
        st.markdown("#### Sentiment Distribution (Filtered)")
        if not filtered_df.empty:
            s_map = filtered_df["overall_sentiment"].value_counts().to_dict()
            st.plotly_chart(create_sentiment_donut_chart(s_map, title=""), use_container_width=True)
        else:
            st.info("No records match the active filter.")

    with col_r1_2:
        st.markdown("#### Sentiment by Domain")
        if not filtered_df.empty:
            st.plotly_chart(create_sentiment_by_domain_chart(filtered_df, title=""), use_container_width=True)
        else:
            st.info("No records match the active filter.")

    st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)

    # 4. Chart Row 2: Text Length Distribution
    st.markdown("#### Review Length & Verbosity Analysis")
    st.caption("Distribution of feedback character length across sentiments to identify verbosity in positive vs. negative feedback.")
    if not filtered_df.empty:
        st.plotly_chart(create_length_distribution_chart(filtered_df, title=""), use_container_width=True)

    st.markdown("<div style='height: 24px;'></div>", unsafe_allow_html=True)

    # 5. Concept & Priority Clusters (from Phase 16 Actionable Insights)
    st.markdown("### 🧬 Concept Priority & Severity Clusters")
    st.info(
        "**Methodological Note on Clusters:** The EduRABSA benchmark uses a structured 24 aspect-category "
        "supervised classification taxonomy and 85 derived Phase 16 concept clusters rather than arbitrary unsupervised k-means. "
        "The cluster chart below maps all 85 identified student feedback concepts across **Impact Severity** and **Action Priority**."
    )

    if insights_ok and not insights_df.empty:
        # Priority filter for insights
        priority_options = sorted(insights_df["priority"].dropna().unique().tolist())
        selected_priorities = st.multiselect(
            "Filter Concepts by Priority Tier",
            options=priority_options,
            default=priority_options,
        )

        filtered_insights = insights_df[insights_df["priority"].isin(selected_priorities)]

        col_ins1, col_ins2 = st.columns([2, 1])
        with col_ins1:
            st.plotly_chart(create_concept_priority_scatter(filtered_insights, title=""), use_container_width=True)

        with col_ins2:
            st.plotly_chart(create_priority_distribution_bar(filtered_insights, title=""), use_container_width=True)
    else:
        st.warning("Actionable insights dataset is unavailable.")
