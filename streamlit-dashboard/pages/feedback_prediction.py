"""Page 6: Interactive Feedback Prediction & Aspect Classification."""

import streamlit as st
from components.tables import render_evidence_cards
from services.prediction_service import PredictionService
from utils.formatting import (
    format_pct,
    format_score,
    get_priority_badge_html,
    get_sentiment_badge_html,
)


EXAMPLE_FEEDBACKS = [
    "The professor explains difficult algorithms with great clarity and always stays late during office hours to help.",
    "The campus Wi-Fi keeps disconnecting during lectures in the engineering building. It's completely unacceptable.",
    "The midterm exam was unreasonably difficult and graded unfairly without a rubric.",
    "Library facilities are modern and quiet, but the cafeteria food quality has degraded this term.",
    "The course workload is overwhelming with multiple project deadlines scheduled on the exact same day.",
]


def render_feedback_prediction_page(prediction_service: PredictionService):
    """Render interactive inference testing interface."""
    st.markdown(
        """
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #F1F5F9; margin-bottom: 4px; letter-spacing: -0.02em;">
                Feedback Prediction & Analysis
            </h1>
            <div style="font-size: 0.95rem; color: #94A3B8;">
                Real-time sentiment classification, aspect tagging, severity scoring, and evidence linking.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Example chips
    st.markdown("##### 💡 Load Sample Feedback")
    cols_ex = st.columns(len(EXAMPLE_FEEDBACKS))
    for i, (col, ex_text) in enumerate(zip(cols_ex, EXAMPLE_FEEDBACKS)):
        with col:
            short_titles = ["Helpful Prof", "Wi-Fi Outage", "Unfair Exam", "Library vs Food", "Overwhelming Work"]
            if st.button(short_titles[i], key=f"ex_pred_{i}", use_container_width=True):
                st.session_state["pred_input"] = ex_text

    # Input Form
    with st.form("prediction_form"):
        current_input = st.session_state.get("pred_input", "")
        feedback_text = st.text_area(
            "Student Feedback Text",
            value=current_input,
            placeholder="Type or paste student feedback here (minimum 3 characters, max 5,000 characters)...",
            height=120,
        )

        char_count = len(feedback_text.strip())
        st.caption(f"Character Count: {char_count:,} / 5,000")

        submitted = st.form_submit_button("⚡ Analyze Feedback", use_container_width=True)

    if submitted:
        if not feedback_text.strip():
            st.error("Please enter student feedback text before analyzing.")
            return

        with st.spinner("Classifying sentiment, aspects, and generating recommendations..."):
            result = prediction_service.predict(feedback_text)

        if not result.get("success"):
            st.error(result.get("error", "An error occurred during inference."))
            return

        if "warning" in result:
            st.warning(result["warning"])

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

        # Main Prediction Output Card
        st.markdown("### 🎯 Analysis Results")

        sentiment = result.get("sentiment", "Unavailable")
        confidence = result.get("confidence")
        category = result.get("category")
        categories = result.get("categories", [])
        aspect = result.get("aspect")
        aspects = result.get("aspects", [])
        severity = result.get("severity", "Low")
        priority = result.get("priority_level", "Low")
        priority_score = result.get("priority_score")
        recommendation = result.get("recommendation", "Review feedback with department.")

        col_res1, col_res2, col_res3 = st.columns(3)

        with col_res1:
            st.markdown(
                f"""
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px; padding: 16px;">
                    <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; font-weight: 600;">Predicted Sentiment</div>
                    <div style="margin: 8px 0;">{get_sentiment_badge_html(sentiment)}</div>
                    <div style="font-size: 0.8rem; color: #94A3B8;">Confidence: {format_pct(confidence) if confidence is not None else 'N/A (Heuristic)'}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with col_res2:
            st.markdown(
                f"""
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px; padding: 16px;">
                    <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; font-weight: 600;">Severity Rating</div>
                    <div style="font-size: 1.4rem; font-weight: 700; color: {'#EF4444' if severity in ('Critical', 'High') else '#10B981'}; margin: 4px 0;">
                        {severity}
                    </div>
                    <div style="font-size: 0.8rem; color: #94A3B8;">Impact level of concern</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        with col_res3:
            st.markdown(
                f"""
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px; padding: 16px;">
                    <div style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; font-weight: 600;">Action Priority</div>
                    <div style="margin: 8px 0;">{get_priority_badge_html(priority)}</div>
                    <div style="font-size: 0.8rem; color: #94A3B8;">Priority Score: {format_score(priority_score)}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown("<div style='height: 14px;'></div>", unsafe_allow_html=True)

        # Aspect & Category Tags
        st.markdown("#### 🏷 Detected Aspects & Categories")
        all_tags = categories if categories else ([category] if category else [])
        if aspects:
            for a in aspects:
                if f"Aspect: {a}" not in all_tags:
                    all_tags.append(f"Aspect: {a}")

        if all_tags:
            tag_html = " ".join(
                f'<span style="background: rgba(99, 102, 241, 0.15); color: #C7D2FE; border: 1px solid rgba(99, 102, 241, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; margin-right: 6px; display: inline-block; margin-bottom: 6px;">{t}</span>'
                for t in all_tags
                if t
            )
            st.markdown(tag_html, unsafe_allow_html=True)
        else:
            st.caption("No specific category or aspect keywords triggered.")

        st.markdown("<div style='height: 14px;'></div>", unsafe_allow_html=True)

        # Recommended Action
        st.markdown("#### 📋 Recommended Action")
        st.markdown(
            f"""
            <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.25); border-left: 4px solid #6366F1; border-radius: 8px; padding: 14px 18px; font-size: 0.95rem; color: #E2E8F0; line-height: 1.5;">
                {recommendation}
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Supporting Evidence if returned
        evidence = result.get("evidence", [])
        if evidence:
            st.markdown("<div style='height: 14px;'></div>", unsafe_allow_html=True)
            st.markdown("#### 🔗 Corpus Evidence Grounding")
            render_evidence_cards(evidence)
