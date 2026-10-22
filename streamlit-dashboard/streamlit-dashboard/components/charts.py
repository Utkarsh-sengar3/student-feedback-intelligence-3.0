"""Plotly chart components with tailored dark navy styling."""

from typing import Dict, List, Optional
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


DARK_THEME_LAYOUT = {
    "paper_bgcolor": "rgba(0,0,0,0)",
    "plot_bgcolor": "rgba(15, 23, 42, 0.4)",
    "font": {"color": "#94A3B8", "family": "Inter, sans-serif"},
    "title_font": {"color": "#F1F5F9", "size": 15, "family": "Inter, sans-serif"},
    "xaxis": {
        "gridcolor": "rgba(99, 102, 241, 0.1)",
        "zerolinecolor": "rgba(99, 102, 241, 0.15)",
        "tickfont": {"color": "#94A3B8", "size": 11},
    },
    "yaxis": {
        "gridcolor": "rgba(99, 102, 241, 0.1)",
        "zerolinecolor": "rgba(99, 102, 241, 0.15)",
        "tickfont": {"color": "#94A3B8", "size": 11},
    },
    "margin": {"l": 30, "r": 20, "t": 40, "b": 35},
    "legend": {"font": {"color": "#F1F5F9", "size": 11}},
}

SENTIMENT_COLORS = {
    "Positive": "#10B981",  # Emerald
    "Negative": "#EF4444",  # Rose
    "Neutral": "#6366F1",   # Indigo
    "Unknown": "#64748B",   # Slate
}


def apply_dark_theme(fig: go.Figure) -> go.Figure:
    """Apply unified dark palette and compact margins to Plotly figure."""
    fig.update_layout(**DARK_THEME_LAYOUT)
    return fig


def create_sentiment_donut_chart(sentiment_counts: Dict[str, int], title: str = "Sentiment Distribution") -> go.Figure:
    """Create styled donut chart for sentiment distribution."""
    labels = list(sentiment_counts.keys())
    values = list(sentiment_counts.values())
    colors = [SENTIMENT_COLORS.get(label, "#8B5CF6") for label in labels]

    fig = go.Figure(
        data=[
            go.Pie(
                labels=labels,
                values=values,
                hole=0.55,
                marker=dict(colors=colors, line=dict(color="#0A0F1E", width=2)),
                textinfo="percent+label",
                hoverinfo="label+value+percent",
            )
        ]
    )
    fig.update_layout(title=title, showlegend=False, height=280)
    return apply_dark_theme(fig)


def create_sentiment_by_domain_chart(df: pd.DataFrame, title: str = "Sentiment Breakdown by Domain") -> go.Figure:
    """Create grouped bar chart showing sentiment counts by review domain."""
    if df.empty or "domain" not in df.columns or "overall_sentiment" not in df.columns:
        return go.Figure()

    grouped = (
        df.groupby(["domain", "overall_sentiment"])
        .size()
        .reset_index(name="count")
    )

    fig = px.bar(
        grouped,
        x="domain",
        y="count",
        color="overall_sentiment",
        color_discrete_map=SENTIMENT_COLORS,
        barmode="group",
        title=title,
    )
    fig.update_layout(height=320, legend_title_text="Sentiment")
    return apply_dark_theme(fig)


def create_domain_bar_chart(domain_counts: Dict[str, int], title: str = "Reviews by Domain") -> go.Figure:
    """Create horizontal bar chart of reviews by domain."""
    df = pd.DataFrame(list(domain_counts.items()), columns=["Domain", "Count"]).sort_values("Count", ascending=True)

    fig = px.bar(
        df,
        x="Count",
        y="Domain",
        orientation="h",
        color_discrete_sequence=["#8B5CF6"],
        title=title,
    )
    fig.update_layout(height=260)
    return apply_dark_theme(fig)


def create_length_distribution_chart(df: pd.DataFrame, title: str = "Feedback Text Length (Character Count)") -> go.Figure:
    """Create histogram of review lengths."""
    if df.empty or "char_length" not in df.columns:
        return go.Figure()

    fig = px.histogram(
        df,
        x="char_length",
        color="overall_sentiment",
        color_discrete_map=SENTIMENT_COLORS,
        nbins=40,
        title=title,
        opacity=0.8,
    )
    fig.update_layout(height=300, barmode="overlay", xaxis_title="Characters", yaxis_title="Review Count")
    return apply_dark_theme(fig)


def create_concept_priority_scatter(insights_df: pd.DataFrame, title: str = "Feedback Concepts: Priority vs. Severity") -> go.Figure:
    """Create interactive scatter plot of the 85 feedback concepts."""
    if insights_df.empty or "priority_score" not in insights_df.columns or "severity_score" not in insights_df.columns:
        return go.Figure()

    fig = px.scatter(
        insights_df,
        x="severity_score",
        y="priority_score",
        color="priority",
        size="affected_reviews" if "affected_reviews" in insights_df.columns else None,
        hover_name="concept",
        hover_data={
            "priority": True,
            "severity_level": True if "severity_level" in insights_df.columns else False,
            "affected_reviews": True if "affected_reviews" in insights_df.columns else False,
            "recommended_owner": True if "recommended_owner" in insights_df.columns else False,
        },
        color_discrete_map={
            "Critical": "#EF4444",
            "High": "#F59E0B",
            "Medium": "#EAB308",
            "Low": "#10B981",
        },
        title=title,
    )
    fig.update_layout(
        height=380,
        xaxis_title="Severity Score (Impact)",
        yaxis_title="Priority Score (Urgency)",
    )
    return apply_dark_theme(fig)


def create_priority_distribution_bar(insights_df: pd.DataFrame, title: str = "Actionable Insights by Priority Tier") -> go.Figure:
    """Create bar chart of concept priorities."""
    if insights_df.empty or "priority" not in insights_df.columns:
        return go.Figure()

    counts = insights_df["priority"].value_counts().reset_index()
    counts.columns = ["Priority", "Count"]

    fig = px.bar(
        counts,
        x="Priority",
        y="Count",
        color="Priority",
        color_discrete_map={
            "Critical": "#EF4444",
            "High": "#F59E0B",
            "Medium": "#EAB308",
            "Low": "#10B981",
        },
        title=title,
    )
    fig.update_layout(height=280, showlegend=False)
    return apply_dark_theme(fig)
