import { GitBranch, ShieldCheck, CheckCircle2, Cpu, Database } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    num: 1,
    name: 'Corpus Aggregation & Ingestion',
    tech: 'Python, Pandas, JSONLines Parser',
    artifact: 'data/processed/edurabsa/review_metadata.csv',
    desc: 'Unification of multi-institutional student feedback records across Course, Teacher, and University domains into a standardized schema of 6,500 records.',
  },
  {
    num: 2,
    name: 'Data Validation & Zero-Leakage Audit',
    tech: 'SHA-256 Hashes, Strict Split Isolation',
    artifact: 'data/audit/dataset_audit.json',
    desc: 'Removed 9 cross-split duplicates between 3,999 train and 2,499 dev/test records. Verified 0% test set contamination.',
  },
  {
    num: 3,
    name: 'Subword Tokenization (WordPiece)',
    tech: 'Hugging Face Tokenizers (DistilBERT)',
    artifact: 'models/sentiment/tokenizer.json',
    desc: 'Whitespace normalization, punctuation isolation, and mapping words to 30,522 subword vocab tokens with 512 max sequence padding.',
  },
  {
    num: 4,
    name: 'Contextual Vector Embeddings',
    tech: 'Sentence-Transformers (all-MiniLM-L6-v2)',
    artifact: 'data/processed/edurabsa/review_embeddings.npy',
    desc: 'Pre-computation of 6,500 x 384 dense semantic vector representations for low-latency cosine similarity search and conceptual matching.',
  },
  {
    num: 5,
    name: 'Supervised Sentiment Classification',
    tech: 'DistilBERT Fine-Tuned & Logistic Regression',
    artifact: 'docs/final_baseline_test_metrics.json',
    desc: 'Production Baseline Winner achieves 72.91% test accuracy and 0.694 Macro F1 across Positive, Negative, and Neutral sentiment categories.',
  },
  {
    num: 6,
    name: 'Multi-Label Aspect Extraction',
    tech: 'Binary Relevance TF-IDF + LinearSVC',
    artifact: 'docs/category_test_metrics.json',
    desc: 'Per-aspect binary classifiers tagging 24 educational aspect categories per feedback record with 71.6% Micro F1.',
  },
  {
    num: 7,
    name: 'Institutional Severity Scoring',
    tech: 'Deterministic Disruption Heuristic',
    artifact: 'docs/severity_scoring_rules.json',
    desc: 'Categorizes feedback into Low, Medium, High, and Critical severity tiers based on pedagogical, administrative, and operational disruption.',
  },
  {
    num: 8,
    name: 'Actionable Insights & Decision Support',
    tech: 'Recommendation Engine & Priority Ranking',
    artifact: 'data/processed/edurabsa/actionable_insights.csv',
    desc: 'Aggregates feedback clusters into 85 ranked institutional action items mapped to academic and operational administrators.',
  },
];

export default function Methodology() {
  return (
    <div className="methodology-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Scientific Rigor & Machine Learning Pipeline</div>
        <h1 className="page-title">Pipeline Methodology</h1>
        <p className="page-description">
          End-to-end architectural walkthrough of the 8-stage supervised machine learning workflow, data hygiene verification, and ethical governance standards.
        </p>
      </div>

      {/* Zero Leakage Audit Banner */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-success)' }}>
        <div className="card-header">
          <div className="card-title" style={{ color: 'var(--color-success)' }}>
            <ShieldCheck size={18} />
            Data Leakage Prevention Certification
          </div>
        </div>
        <div className="card-body" style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          During Phase 1 auditing, cross-split SHA-256 hash checking identified 9 duplicate feedback texts between the 3,999 train candidates and the 2,499 dev/test pool. These duplicates were purged prior to model training. All reported test metrics reflect empirical evaluation on an untouched test partition with <strong>0% data leakage</strong>.
        </div>
      </div>

      {/* 8-Stage Pipeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {PIPELINE_STAGES.map(stage => (
          <div key={stage.num} className="card">
            <div className="card-header" style={{ padding: 'var(--space-3) var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--color-accent-dim)',
                    border: '1px solid var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                  }}
                >
                  {stage.num}
                </div>
                <div className="card-title" style={{ fontSize: '1rem' }}>{stage.name}</div>
              </div>
              <span className="badge badge--positive">Verified</span>
            </div>
            <div className="card-body" style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
                {stage.desc}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>Technology: <strong style={{ color: 'var(--color-text-secondary)' }}>{stage.tech}</strong></div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>{stage.artifact}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
