"""Explainable end-to-end supervised ML workflow page."""
import streamlit as st
import plotly.graph_objects as go


def render_model_workflow_page():
    st.title("Model Workflow")
    st.caption("How raw student feedback moves through the supervised learning and retrieval pipeline.")
    st.markdown("""<div class='workflow-note'><b>Purpose</b><br/>A transparent view of the data, training, evaluation and inference stages. Model scores shown elsewhere should be interpreted against their documented evaluation split.</div>""", unsafe_allow_html=True)
    steps = [
        ("01", "Input data", "EduRABSA feedback records", "Text + sentiment/aspect labels"),
        ("02", "Data preparation", "Quality checks and normalization", "Missing labels, duplicates, text cleanup"),
        ("03", "Feature representation", "Tokenization / TF-IDF / embeddings", "Representation depends on the task"),
        ("04", "Supervised training", "DistilBERT + category classifier", "Learn from labelled examples"),
        ("05", "Evaluation", "Held-out test metrics", "Accuracy, precision, recall, F1, Hamming loss"),
        ("06", "Prediction & insights", "New feedback + evidence retrieval", "Sentiment, aspects and supporting reviews"),
    ]
    for row in range(0, len(steps), 2):
        cols=st.columns(2)
        for col, item in zip(cols, steps[row:row+2]):
            num,title,desc,detail=item
            with col:
                st.markdown(f"<div class='workflow-card'><div class='workflow-number'>{num}</div><div class='workflow-title'>{title}</div><div class='workflow-desc'>{desc}</div><div class='workflow-detail'>{detail}</div></div>", unsafe_allow_html=True)
    st.subheader("Pipeline at a glance")
    fig=go.Figure()
    labels=["Labeled feedback", "Preprocessing", "Representations", "Model training", "Test evaluation", "Inference"]
    x=list(range(len(labels)))
    fig.add_trace(go.Scatter(x=x,y=[0]*len(x),mode="lines",line=dict(color="#5259c9",width=3),hoverinfo="skip",showlegend=False))
    fig.add_trace(go.Scatter(x=x,y=[0]*len(x),mode="markers+text",text=labels,textposition="top center",marker=dict(size=23,color="#7377f2",line=dict(color="#c7d2fe",width=1)),textfont=dict(color="#e2e8f0",size=11),hovertemplate="%{text}<extra></extra>",showlegend=False))
    fig.update_layout(template="plotly_dark",height=230,margin=dict(l=10,r=10,t=55,b=20),xaxis=dict(visible=False),yaxis=dict(visible=False),paper_bgcolor="rgba(0,0,0,0)",plot_bgcolor="rgba(0,0,0,0)")
    st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
    st.subheader("What the evaluation metrics mean")
    metric_cols=st.columns(3)
    definitions=[("Accuracy","Share of predictions that match the true label."),("Macro F1","Average F1 across classes, giving each class equal weight."),("Hamming loss","Fraction of incorrect labels in multilabel classification; lower is better.")]
    for col,(title,desc) in zip(metric_cols,definitions):
        with col: st.markdown(f"<div class='workflow-metric'><b>{title}</b><p>{desc}</p></div>",unsafe_allow_html=True)
    st.info("The workflow view describes the system design; it does not claim that every model artifact is available in every deployment. Check the System Status and Model Performance pages for current availability and reported evaluation results.")
