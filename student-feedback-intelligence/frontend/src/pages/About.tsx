import { useState, useEffect } from 'react';
import { Info, Terminal, Server, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import type { HealthResponse, StatusResponse } from '../api/types';

export default function About() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.health().catch(() => null),
      api.status().catch(() => null),
    ]).then(([h, s]) => {
      setHealth(h);
      setStatus(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="about-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Platform Architecture & Diagnostics</div>
        <h1 className="page-title">About Senticode</h1>
        <p className="page-description">
          Senticode is a research-grade Student Feedback Intelligence platform integrating transformer-based sentiment analysis, multi-label aspect tagging, and dense vector semantic retrieval.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* System Diagnostics */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Server size={18} style={{ color: 'var(--color-accent)' }} />
              Inference Service Connection
            </div>
            <span className={`badge badge--${health ? 'positive' : 'neutral'}`}>
              {health ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="card-body">
            {health ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Service Name:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{health.service}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Version:</span>
                  <strong style={{ color: 'var(--color-accent)' }}>v{health.version}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Status:</span>
                  <span className="badge badge--positive">{health.status}</span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>The local FastAPI backend service is currently offline or unreachable at <code>http://127.0.0.1:8000</code>.</p>
                <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-surface-solid)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  uvicorn api.main:app --reload --port 8000
                </div>
                <p style={{ marginTop: 'var(--space-3)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  All analytical dashboards and visual reports operate seamlessly using verified EduRABSA corpus ground truth.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Terminal size={18} style={{ color: 'var(--color-accent)' }} />
              Technical Stack & Specifications
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Frontend Framework:</span>
                <strong>React 18 &middot; TypeScript &middot; Vite</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Data Visualizations:</span>
                <strong>Recharts &middot; Custom SVG</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Styling System:</span>
                <strong>Template 5 (Oceanic Glassmorphism)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Dense Vector Model:</span>
                <strong>sentence-transformers (all-MiniLM-L6-v2)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Corpus Dataset:</span>
                <strong>EduRABSA (6,500 Multi-domain Records)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
