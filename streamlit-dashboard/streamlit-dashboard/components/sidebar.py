"""Persistent sidebar navigation component with API and dataset health status."""

import streamlit as st
from services.api_client import APIClient, get_api_base_url


NAV_PAGES = [
    ("Overview", "📊 Overview"),
    ("Graphs & Clusters", "📈 Graphs & Clusters"),
    ("Model Performance", "🎯 Model Performance"),
    ("Reviews Explorer", "🔍 Reviews Explorer"),
    ("AI Research Assistant", "🤖 AI Research Assistant"),
    ("Feedback Prediction", "⚡ Feedback Prediction"),
]


def render_sidebar(api_client: APIClient) -> str:
    """
    Render persistent left sidebar with brand, navigation, and connection indicators.
    Returns: Currently selected page key.
    """
    with st.sidebar:
        # Header Brand
        st.markdown(
            """
            <div style="padding: 12px 0 16px 0; border-bottom: 1px solid rgba(99, 102, 241, 0.2); margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: #6366F1; color: white; border-radius: 8px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                        SFI
                    </div>
                    <div>
                        <div style="font-weight: 700; font-size: 1.05rem; color: #F1F5F9; letter-spacing: -0.01em;">FeedbackIntel</div>
                        <div style="font-size: 0.72rem; color: #94A3B8;">Student Feedback Intelligence</div>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Navigation Menu
        if "selected_page" not in st.session_state:
            st.session_state["selected_page"] = "Overview"

        page_labels = [label for key, label in NAV_PAGES]
        page_keys = [key for key, label in NAV_PAGES]
        current_idx = page_keys.index(st.session_state["selected_page"]) if st.session_state["selected_page"] in page_keys else 0

        selected_label = st.radio(
            "Navigation",
            options=page_labels,
            index=current_idx,
            label_visibility="collapsed",
        )

        selected_key = page_keys[page_labels.index(selected_label)]
        st.session_state["selected_page"] = selected_key

        st.markdown("<div style='height: 24px;'></div>", unsafe_allow_html=True)

        # Connection & System Status Expander
        with st.expander("⚡ System & API Status", expanded=False):
            api_url = get_api_base_url()
            st.caption(f"Backend Target:\n`{api_url}`")

            # Check health with short timeout
            health = api_client.check_health()
            if health.get("success"):
                st.markdown(
                    """
                    <div style="display: flex; align-items: center; gap: 6px; color: #10B981; font-size: 0.85rem; font-weight: 600;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 6px #10B981;"></span>
                        FastAPI Backend: Online
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
            else:
                st.markdown(
                    """
                    <div style="display: flex; align-items: center; gap: 6px; color: #F59E0B; font-size: 0.85rem; font-weight: 600;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #F59E0B;"></span>
                        FastAPI Backend: Offline
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
                st.caption("Running in Standalone Local Data Mode.")

            st.caption("Datasets: 6,500 reviews | 85 insights")

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

        # Footer
        st.markdown(
            """
            <div style="padding-top: 16px; border-top: 1px solid rgba(99, 102, 241, 0.15); font-size: 0.72rem; color: #64748B;">
                <div>AI-Based Student Feedback Intelligence</div>
                <div>v2.1.0 · Streamlit & Plotly</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    return st.session_state["selected_page"]
