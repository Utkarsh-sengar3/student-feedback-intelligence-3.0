import { useState } from 'react';
import {
  Activity,
  Send,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { api } from '../api/client';
import type { FeedbackResponse } from '../api/types';
import { CORPUS_SUMMARY, DOMAIN_BREAKDOWN } from '../data/corpusData';

const SAMPLE_PRESETS = [
  'Professor Miller explains complex algorithms with great clarity and provides engaging lab assignments.',
  'The course exams were ridiculously difficult, disorganized, and completely disconnected from lecture notes.',
  'The class followed the syllabus accurately. Office hours were held weekly as scheduled.',
  'Campus Wi-Fi drops connection constantly in the science building, making online exams stressful.',
];

export default function SentimentAnalysis() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.analyze({ text: text.trim() });
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Live API server is offline at localhost:8000. Start backend to compute live DistilBERT inference.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentiment-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Senticode Inference Lab</div>
        <h1 className="page-title">Sentiment Analysis Workspace</h1>
        <p className="page-description">
          Evaluate sentiment polarity, aspect detection, and severity assessment using verified classifiers on custom student feedback.
        </p>
      </div>

      {/* Domain Polarity KPI Row */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {DOMAIN_BREAKDOWN.map(d => {
          const posPct = ((d.positive / d.count) * 100).toFixed(1);
          const negPct = ((d.negative / d.count) * 100).toFixed(1);
          return (
            <div key={d.domain} className="kpi-card">
              <div className="kpi-label">{d.domain}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-success)' }}>
                  {posPct}% Pos
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-danger)' }}>
                  {negPct}% Neg
                </span>
              </div>
              <div className="kpi-sub">{d.count.toLocaleString()} total reviews</div>
            </div>
          );
        })}
      </div>

      {/* Main Inference Workspace */}
      <div className="grid-2">
        {/* Input Box */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={18} style={{ color: 'var(--color-accent)' }} />
              Test Feedback Classification
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handlePredict}>
              <div className="form-group">
                <label htmlFor="sentiment-text" className="form-label">
                  Student Feedback Input
                </label>
                <textarea
                  id="sentiment-text"
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  placeholder="Paste or enter custom student feedback here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={5000}
                  required
                />
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                  {text.length} / 5,000 characters
                </div>
              </div>

              {/* Sample Presets */}
              <div className="form-group">
                <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} style={{ color: 'var(--color-accent)' }} />
                  Quick Presets
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SAMPLE_PRESETS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn--ghost btn--sm"
                      style={{ justifyContent: 'flex-start', textAlign: 'left', whiteSpace: 'normal', fontSize: '0.78rem' }}
                      onClick={() => setText(sample)}
                    >
                      &ldquo;{sample}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading || !text.trim()}
                  style={{ flex: 1 }}
                >
                  <Send size={15} />
                  {loading ? 'Evaluating...' : 'Run Inference'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => { setText(''); setResult(null); setError(null); }}
                  title="Clear input"
                >
                  <RotateCcw size={15} />
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Inference Diagnostics & Output */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={18} style={{ color: 'var(--color-accent)' }} />
              Classification Output
            </div>
            {result && (
              <span className={`badge badge--${(result.sentiment || 'neutral').toLowerCase()}`}>
                {result.sentiment}
              </span>
            )}
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert--warning">
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Inference Offline Notice:</strong>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                    {error}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                    Trained weights are managed by the FastAPI service. Per system design standards, heuristic guessing is prohibited to ensure veracity.
                  </div>
                </div>
              </div>
            )}

            {result ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-surface-solid)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Predicted Polarity
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                    {result.sentiment}
                    {result.sentiment_confidence && (
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-accent)', marginLeft: '8px' }}>
                        ({(result.sentiment_confidence * 100).toFixed(1)}% confidence)
                      </span>
                    )}
                  </div>
                </div>

                {result.categories && result.categories.length > 0 && (
                  <div>
                    <div className="form-label" style={{ marginBottom: '6px' }}>Detected Aspects</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {result.categories.map((c) => (
                        <span key={c} className="badge badge--accent">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendation && (
                  <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 600 }}>
                      Actionable Recommendation
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                      {result.recommendation}
                    </div>
                  </div>
                )}
              </div>
            ) : !error && (
              <div style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)', color: 'var(--color-text-muted)' }}>
                <Activity size={32} style={{ margin: '0 auto var(--space-3) auto', opacity: 0.4 }} />
                <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Awaiting Input
                </div>
                <div style={{ fontSize: '0.82rem', maxWidth: '340px', margin: '0 auto' }}>
                  Select a quick preset or type student review text and click &ldquo;Run Inference&rdquo; to compute predictions.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
