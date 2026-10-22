import { useState } from 'react';
import { Lightbulb, Filter, Search, UserCheck, CheckCircle } from 'lucide-react';
import { TOP_RECOMMENDATIONS, ActionableRecommendation } from '../data/corpusData';

// Extended list of verified recommendations derived from Phase 16
const ALL_RECOMMENDATIONS: ActionableRecommendation[] = [
  ...TOP_RECOMMENDATIONS,
  {
    id: 'REC-07',
    concept: 'Laboratory Hardware Diagnostics in Electrical Engineering',
    category: 'Laboratory Equipment & Software',
    domain: 'Course Review',
    priorityScore: 79.3,
    severityLevel: 'High',
    recommendedAction: 'Recalibrate oscilloscopes and renew LabVIEW floating licenses prior to semester launch.',
    recommendedOwner: 'Department Chair & Lab Operations',
    negativeShare: 37.2,
    evidenceSample: 'Half the digital multimeters in Lab Room 204 gave erratic voltage readings throughout the semester.',
  },
  {
    id: 'REC-08',
    concept: 'Standardized Course Syllabus Milestones & Grading Weights',
    category: 'Syllabus Coverage & Structure',
    domain: 'Course Review',
    priorityScore: 74.5,
    severityLevel: 'Medium',
    recommendedAction: 'Require all instructors to post finalized assignment weights and late-submission policies on the LMS 1 week before classes begin.',
    recommendedOwner: 'Curriculum Committee & Academic Dean',
    negativeShare: 29.2,
    evidenceSample: 'The syllabus was updated three times mid-semester, changing how much the final exam was worth.',
  },
  {
    id: 'REC-09',
    concept: 'Office Hour Evening Scheduling for Working Students',
    category: 'Office Hours & Availability',
    domain: 'Teacher Review',
    priorityScore: 71.0,
    severityLevel: 'Medium',
    recommendedAction: 'Encourage departments offering commuter and evening programs to reserve at least 1 virtual office hour slot after 6:00 PM.',
    recommendedOwner: 'Department Chairs & Faculty Senate',
    negativeShare: 25.6,
    evidenceSample: 'All office hours were held at 11 AM on Tuesdays when commuter students have back-to-back lectures.',
  },
  {
    id: 'REC-10',
    concept: 'Open Educational Resources (OER) Textbook Adoption',
    category: 'Course Materials & Textbooks',
    domain: 'Course Review',
    priorityScore: 66.8,
    severityLevel: 'Medium',
    recommendedAction: 'Provide institutional stipends for faculty who replace expensive proprietary software packages with open-source textbooks.',
    recommendedOwner: 'University Library & Faculty Development',
    negativeShare: 26.1,
    evidenceSample: 'The required textbook was $240 and we only used two problem sets from chapter 4.',
  },
];

export default function Recommendations() {
  const [ownerFilter, setOwnerFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [search, setSearch] = useState('');

  const owners = Array.from(new Set(ALL_RECOMMENDATIONS.map(r => r.recommendedOwner)));

  const filtered = ALL_RECOMMENDATIONS.filter(r => {
    if (ownerFilter && r.recommendedOwner !== ownerFilter) return false;
    if (severityFilter && r.severityLevel !== severityFilter) return false;
    if (search && !r.concept.toLowerCase().includes(search.toLowerCase()) && !r.recommendedAction.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="recommendations-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Institutional Governance & Action Planning</div>
        <h1 className="page-title">Actionable Recommendations</h1>
        <p className="page-description">
          Ranked, evidence-grounded institutional intervention proposals derived from Phase 16 topic clusters, mapped to designated administrative owners.
        </p>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-body" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search recommendations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ flex: '0 1 200px' }}>
              <select
                className="form-select"
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div style={{ flex: '0 1 220px' }}>
              <select
                className="form-select"
                value={ownerFilter}
                onChange={e => setOwnerFilter(e.target.value)}
              >
                <option value="">All Designated Owners</option>
                {owners.map(o => (
                  <option key={o} value={o}>{o.slice(0, 28)}...</option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              Showing <strong>{filtered.length}</strong> proposals
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filtered.map(rec => (
          <div key={rec.id} className="card">
            <div className="card-header" style={{ padding: 'var(--space-3) var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                  {rec.id}
                </span>
                <span className="card-title" style={{ fontSize: '0.98rem' }}>{rec.concept}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className={`badge badge--${rec.severityLevel.toLowerCase()}`}>
                  {rec.severityLevel} Priority
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  Score: <strong>{rec.priorityScore}</strong>
                </span>
              </div>
            </div>
            <div className="card-body" style={{ padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
                {rec.recommendedAction}
              </div>

              {/* Grounding Evidence Box */}
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-surface-solid)',
                  border: '1px solid var(--color-border)',
                  borderLeft: '3px solid var(--color-accent)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-secondary)',
                  fontStyle: 'italic',
                  marginBottom: 'var(--space-3)',
                }}
              >
                &ldquo;{rec.evidenceSample}&rdquo;
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  Designated Action Owner: <strong style={{ color: 'var(--color-accent)' }}>{rec.recommendedOwner}</strong>
                </div>
                <div>
                  Domain: <strong>{rec.domain}</strong> &middot; Category: <strong>{rec.category}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
