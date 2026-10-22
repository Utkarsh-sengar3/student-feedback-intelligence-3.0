"""Page 5: AI Research Assistant with Evidence-Grounded Synthesis."""

import streamlit as st
from components.charts import create_sentiment_donut_chart
from components.tables import render_evidence_cards
from services.retrieval_service import RetrievalService


EXAMPLE_QUESTIONS = [
    "What are the most common complaints about teaching quality?",
    "What do students say about examination difficulty and grading fairness?",
    "What concerns appear in campus facilities and Wi-Fi feedback?",
    "What positive feedback is highlighted about course materials and lectures?",
    "What recurring issues affect student administrative and registration services?",
]


def render_ai_assistant_page(retrieval_service: RetrievalService):
    """Render RAG research assistant page."""
    st.markdown(
        """
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; letter-spacing: -0.02em;">
                AI Research Assistant
            </h1>
            <div style="font-size: 0.95rem; color: #94A3B8;">
                Grounded semantic evidence retrieval across 6,500 student feedback entries.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.info(
        "💡 **Deterministic Evidence Grounding:** Answers are synthesized directly from retrieved student reviews "
        "without hallucinating external facts. Retrieved reviews are cited with verbatim excerpts and source IDs."
    )

    # Preset Question Pills
    st.markdown("##### 📌 Frequently Asked Research Questions")
    cols_btn = st.columns(len(EXAMPLE_QUESTIONS))
    for i, (col, q_text) in enumerate(zip(cols_btn, EXAMPLE_QUESTIONS)):
        with col:
            # Short label
            short_labels = ["Teaching Quality", "Exams & Grading", "Facilities & Wi-Fi", "Course Materials", "Administration"]
            if st.button(short_labels[i], key=f"q_pill_{i}", use_container_width=True):
                st.session_state["ast_query"] = q_text

    # Search Form
    with st.form("ast_form"):
        current_query = st.session_state.get("ast_query", "")
        question = st.text_area(
            "Enter research question about student feedback",
            value=current_query,
            placeholder="e.g. What are the primary concerns students raise regarding lab assignments and pacing?",
            height=90,
        )

        col_f1, col_f2, col_f3 = st.columns([1, 1, 1])
        with col_f1:
            domain_filter = st.selectbox(
                "Filter Domain (Optional)",
                options=["All", "course review", "teacher review", "university review"],
                index=0,
            )
        with col_f2:
            sentiment_filter = st.selectbox(
                "Filter Sentiment (Optional)",
                options=["All", "Positive", "Negative", "Neutral"],
                index=0,
            )
        with col_f3:
            top_k = st.slider("Evidence Count (Top K)", min_value=3, max_value=15, value=8)

        submit = st.form_submit_button("🔍 Search & Synthesize Evidence", use_container_width=True)

    if submit and question.strip():
        with st.spinner("Searching semantic embedding index and synthesizing grounded findings..."):
            res = retrieval_service.ask(
                question=question.strip(),
                top_k=top_k,
                domain=domain_filter if domain_filter != "All" else None,
                sentiment=sentiment_filter if sentiment_filter != "All" else None,
            )

        if not res.get("success"):
            st.error(res.get("error", "Failed to retrieve evidence."))
            return

        if "warning" in res:
            st.warning(res["warning"])

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

        # 1. Summary Card
        st.markdown("### 📋 Evidence-Grounded Findings")
        summary_text = res.get("summary", "No summary generated.")
        neg_share = res.get("negative_share", 0.0)

        st.markdown(
            f"""
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <div style="font-size: 1.05rem; color: #F1F5F9; line-height: 1.6; margin-bottom: 12px;">
                    {summary_text}
                </div>
                <div style="display: flex; gap: 20px; font-size: 0.85rem; color: #94A3B8; border-top: 1px solid rgba(99, 102, 241, 0.15); padding-top: 10px;">
                    <span>Reviews Retrieved: <strong style="color: #F1F5F9;">{res.get('retrieved_count', 0)}</strong></span>
                    <span>Negative Share: <strong style="color: {'#EF4444' if neg_share >= 0.4 else '#10B981'};">{neg_share*100:.1f}%</strong></span>
                    <span>Source: <strong style="color: #818CF8;">{res.get('source', 'corpus')}</strong></span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # 2. Sentiment Breakdown of Evidence
        sent_dist = res.get("sentiment_distribution", {})
        if sent_dist:
            col_chart, col_empty = st.columns([1, 1])
            with col_chart:
                st.plotly_chart(create_sentiment_donut_chart(sent_dist, title="Sentiment of Retrieved Sample"), use_container_width=True)

        # 3. Supporting Evidence Cards
        st.markdown("### 📑 Supporting Verbatim Reviews")
        st.caption("Inspect individual student reviews retrieved by semantic similarity:")
        evidence_items = res.get("evidence", [])
        render_evidence_cards(evidence_items)

        # 4. Methodological Limitations
        limitations = res.get("limitations", [])
        if limitations:
            with st.expander("⚠️ Methodological Scope & Limitations", expanded=False):
                for lim in limitations:
                    st.markdown(f"- {lim}")
                st.caption("Evidence retrieval is grounded strictly in the 6,500 annotated EduRABSA reviews.")
