import { ShieldAlert, Calculator, CheckCircle2, Info } from 'lucide-react';

export default function SeverityPriority() {
  return (
    <div className="severity-priority-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Decision Science & Algorithmic Formulation</div>
        <h1 className="page-title">Severity & Priority Scoring</h1>
        <p className="page-description">
          Deterministic institutional priority formulation combining empirical negative volume, aspect sentiment polarity, and rule-based severity weighting.
        </p>
      </div>

      {/* Formula Glass Card */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">
            <Calculator size={18} style={{ color: 'var(--color-accent)' }} />
            The SentiCode Priority Formulation
          </div>
        </div>
        <div className="card-body">
          <div
            style={{
              padding: 'var(--space-5)',
              background: 'var(--color-surface-solid)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              color: 'var(--color-accent)',
              textAlign: 'center',
              letterSpacing: '0.04em',
              marginBottom: 'var(--space-4)',
            }}
          >
            P(c) = log₂(1 + Frequency) &times; [1 + 1.5 &times; (Negative Share)] &times; SeverityMultiplier
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Rather than relying on uninterpretable black-box heuristics, SentiCode calculates an institutional Priority Score from three auditable parameters:
          </p>
          <ul style={{ paddingLeft: 'var(--space-5)', marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <li><strong>Frequency Weight:</strong> Logarithmic dampening prevents high-enrollment generic introductory classes from drowning out specialized critical issues.</li>
            <li><strong>Negative Share:</strong> The proportion of negative reviews mentioning aspect category <em>c</em> over all mentions of <em>c</em>.</li>
            <li><strong>Severity Multiplier:</strong> A discrete weighting factor assigned based on pedagogical or institutional disruption.</li>
          </ul>
        </div>
      </div>

      {/* Severity Tiers Grid */}
      <div className="grid-2">
        <div className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div className="card-header">
            <div className="card-title">
              <span className="badge badge--critical">Critical Tier (Weight: 2.0x)</span>
            </div>
          </div>
          <div className="card-body" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p><strong>Criteria:</strong> Systemic failures directly impeding course completion or academic accreditation, such as widespread exam grading disputes, server/Wi-Fi outages during proctored finals, or unannounced cancellations of required labs.</p>
            <p style={{ marginTop: '8px' }}><strong>Action SLA:</strong> Requires mandatory Dean / Vice Provost review within 7 academic days.</p>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div className="card-header">
            <div className="card-title">
              <span className="badge badge--high">High Tier (Weight: 1.5x)</span>
            </div>
          </div>
          <div className="card-body" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p><strong>Criteria:</strong> Persistent pedagogical friction impacting student learning curves, including TA pacing in recitation labs, concurrent deadline stacking across core courses, or cafeteria nutritional shortages.</p>
            <p style={{ marginTop: '8px' }}><strong>Action SLA:</strong> Department Chair and Faculty Senate discussion within 14 academic days.</p>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-info)' }}>
          <div className="card-header">
            <div className="card-title">
              <span className="badge badge--medium">Medium Tier (Weight: 1.2x)</span>
            </div>
          </div>
          <div className="card-body" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p><strong>Criteria:</strong> Operational or secondary inconveniences that degrade student satisfaction without halting progression (e.g., textbook editions, library outlet density).</p>
            <p style={{ marginTop: '8px' }}><strong>Action SLA:</strong> Scheduled for routine mid-term or end-of-semester curriculum review.</p>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-text-muted)' }}>
          <div className="card-header">
            <div className="card-title">
              <span className="badge badge--low">Low / Monitor Tier (Weight: 1.0x)</span>
            </div>
          </div>
          <div className="card-body" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p><strong>Criteria:</strong> Isolated single-student preferences, aesthetic opinions, or minor feedback where positive commendations comfortably exceed 80%.</p>
            <p style={{ marginTop: '8px' }}><strong>Action SLA:</strong> Maintained in historical telemetry for trend tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
