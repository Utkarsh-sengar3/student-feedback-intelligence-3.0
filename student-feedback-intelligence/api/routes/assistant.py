from fastapi import APIRouter, HTTPException
from api.schemas.feedback import AssistantRequest, AssistantResponse, EvidenceItem
from src.retrieval.rag_pipeline import RAGPipeline

router = APIRouter(
    prefix="/api/v1/assistant",
    tags=["AI Assistant"],
)

_rag_pipeline = None


def get_rag() -> RAGPipeline:
    global _rag_pipeline
    if _rag_pipeline is None:
        _rag_pipeline = RAGPipeline()
    return _rag_pipeline


@router.post("/", response_model=AssistantResponse)
def ask_assistant(payload: AssistantRequest):
    question = payload.question.strip()
    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    try:
        rag = get_rag()
        result = rag.ask(
            query=question,
            domain=payload.domain,
            sentiment=payload.sentiment,
            top_k=payload.top_k,
        )

        evidence_items = []
        for item in result.get("supporting_evidence", []):
            rev_id = item.get("review_id")
            if hasattr(rev_id, "item"):
                rev_id = rev_id.item()
            sim_score = item.get("similarity_score")
            if hasattr(sim_score, "item"):
                sim_score = float(sim_score.item())
            evidence_items.append(
                EvidenceItem(
                    review_id=rev_id,
                    similarity_score=float(sim_score) if sim_score is not None else None,
                    domain=str(item.get("domain")) if item.get("domain") is not None else None,
                    sentiment=str(item.get("sentiment")) if item.get("sentiment") is not None else None,
                    text=str(item.get("text", "")),
                )
            )

        raw_dist = result.get("sentiment_distribution", {})
        cleaned_dist = {}
        if isinstance(raw_dist, dict):
            for k, v in raw_dist.items():
                val = v.item() if hasattr(v, "item") else v
                cleaned_dist[str(k)] = int(val)

        ret_count = result.get("retrieved_feedback_count", 0)
        if hasattr(ret_count, "item"):
            ret_count = ret_count.item()

        neg_share = result.get("negative_share", 0.0)
        if hasattr(neg_share, "item"):
            neg_share = neg_share.item()

        return AssistantResponse(
            question=question,
            answer_type=str(result.get("answer_type", "deterministic_evidence_grounded")),
            summary=str(result.get("summary", "")),
            retrieved_count=int(ret_count),
            sentiment_distribution=cleaned_dist,
            negative_share=float(neg_share),
            evidence=evidence_items,
            evidence_context=str(result.get("evidence_context")) if result.get("evidence_context") is not None else None,
            limitations=[str(l) for l in result.get("limitations", [])],
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Assistant retrieval failure: {str(exc)}",
        )
