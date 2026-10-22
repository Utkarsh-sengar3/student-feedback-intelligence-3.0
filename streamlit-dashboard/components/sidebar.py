"""Clean, boxed navigation for the FeedbackIntel research SaaS."""
import streamlit as st
from services.api_client import APIClient, get_api_base_url

NAV_PAGES = [
    ("Overview", "Overview"),
    ("Graphs & Clusters", "Graphs & Clusters"),
    ("Model Performance & Errors", "Model Performance & Errors"),
    ("Reviews Explorer", "Reviews Explorer"),
    ("AI Research Assistant", "AI Research Assistant"),
    ("Feedback Prediction", "Feedback Prediction"),
    ("Model Workflow", "Model Workflow"),
]


def render_sidebar(api_client: APIClient) -> str:
    with st.sidebar:
        st.markdown("""<div class='brand-block'><div class='brand-mark'>SFI</div><div><div class='brand-title'>FeedbackIntel</div><div class='brand-subtitle'>Student Feedback Intelligence</div></div></div>""", unsafe_allow_html=True)
        st.markdown("<div class='nav-caption'>WORKSPACE</div>", unsafe_allow_html=True)
        if "selected_page" not in st.session_state or st.session_state["selected_page"] not in [x[0] for x in NAV_PAGES]:
            st.session_state["selected_page"] = "Overview"
        keys = [x[0] for x in NAV_PAGES]
        selected = st.radio("Workspace navigation", keys, index=keys.index(st.session_state["selected_page"]), label_visibility="collapsed", key="workspace_nav")
        st.session_state["selected_page"] = selected
        st.markdown("<div class='sidebar-spacer'></div><div class='sidebar-section-title'>SYSTEM STATUS</div>", unsafe_allow_html=True)
        with st.expander("Backend connection", expanded=False):
            st.caption(f"API target: {get_api_base_url()}")
            health = api_client.check_health()
            if health.get("success"):
                st.success("Backend online")
            else:
                st.warning("Backend offline Â· local data mode")
            st.caption("Review corpus: 6,500 indexed records")
        st.markdown("<div class='sidebar-footer'><b>Research workspace</b><br/>Supervised learning Â· Evaluation Â· Retrieval</div>", unsafe_allow_html=True)
    return selected
