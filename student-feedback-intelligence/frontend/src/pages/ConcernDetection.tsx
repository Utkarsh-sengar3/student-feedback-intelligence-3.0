import { useState } from 'react';
import { AlertTriangle, Filter, Flame } from 'lucide-react';
import { ASPECT_CATEGORIES } from '../data/corpusData';

export default function ConcernDetection() {
  const [severityFilter, setSeverityFilter] = useState('');

  const sortedConcerns = [...ASPECT_CATEGORIES].sort((a, b) => b.priorityScore - a.priorityScore);
  const filtered = severityFilter
    ? sortedConcerns.filter(c => c.severity === severityFilter)
    : sortedConcerns;

  return (
    <div className="concern-detection-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Risk Mitigation & Distress Signals</div>
        <h1 className="page-title">Concern Detection</h1>
        <p className="page-description">
          Automated identification and algorithmic prioritization of recurring negative student feedback themes, isolating severe bottlenecks in the educational experience.
        </p>
      </div>

      {/* Tiers summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="kpi-card kpi-card--negative">
          <div className="kpi-label">Critical Tier Concerns</div>
          <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>18</div>
          <div className="kpi-sub">Priority score &gt; 90.0</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
          <div className="kpi-label">High Tier Concerns</div>
          <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>32</div>
          <div className="kpi-sub">Priority score 75.0 - 89.9</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Medium Tier Concerns</div>
          <div className="kpi-value">25</div>
          <div className="kpi-sub">Priority score 60.0 - 74.9</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Low / Monitor Tier</div>
          <div className="kpi-value">10</div>
          <div className="kpi-sub">Priority score &lt; 60.0</div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Flame size={18} style={{ color: 'var(--color-danger)' }} />
            Ranked Distress Themes by Priority Score
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {['', 'Critical', 'High', 'Medium', 'Low'].map(s => (
              <button
                key={s}
                type="button"
                className={`btn btn--sm ${severityFilter === s ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setSeverityFilter(s)}
              >
                {s || 'All Tiers'}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Distress Category</th>
                  <th>Domain</th>
                  <th>Negative Mentions</th>
                  <th>Negative Dissatisfaction Rate</th>
                  <th>Severity Tier</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr key={c.category}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>#{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.category}</td>
                    <td>
                      <span className="badge badge--accent">{c.domain.replace(' Review', '')}</span>
                    </td>
                    <td style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{c.negativeCount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--color-surface-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.negativeRate}%`, height: '100%', background: 'var(--color-danger)' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.negativeRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge--${c.severity.toLowerCase()}`}>{c.severity}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.95rem' }}>
                        {c.priorityScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
