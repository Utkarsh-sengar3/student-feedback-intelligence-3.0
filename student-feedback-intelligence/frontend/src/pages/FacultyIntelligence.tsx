import {
  UserCheck,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ASPECT_CATEGORIES, TOP_RECOMMENDATIONS } from '../data/corpusData';

export default function FacultyIntelligence() {
  const teacherAspects = ASPECT_CATEGORIES.filter(c => c.domain === 'Teacher Review');
  const teacherRecommendations = TOP_RECOMMENDATIONS.filter(r => r.domain === 'Teacher Review');

  const chartData = teacherAspects.map(a => ({
    name: a.category.replace('Instructor ', '').replace('Pedagogical ', ''),
    fullName: a.category,
    Mentions: a.totalMentions,
    Negative: a.negativeCount,
  }));

  return (
    <div className="faculty-intelligence-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Instructional Domain Analytics</div>
        <h1 className="page-title">Faculty Intelligence</h1>
        <p className="page-description">
          Empirical evaluation across 2,000 student reviews regarding teaching effectiveness, office hours accessibility, pedagogical delivery, and student mentorship.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="kpi-card">
          <div className="kpi-label">Teacher Reviews</div>
          <div className="kpi-value">2,000</div>
          <div className="kpi-sub">30.77% of total corpus</div>
        </div>

        <div className="kpi-card kpi-card--positive">
          <div className="kpi-label">Positive Sentiment</div>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>66.0%</div>
          <div className="kpi-sub">1,320 positive commendations</div>
        </div>

        <div className="kpi-card kpi-card--negative">
          <div className="kpi-label">Negative Sentiment</div>
          <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>24.0%</div>
          <div className="kpi-sub">480 negative complaints</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Primary Strength</div>
          <div className="kpi-value" style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>
            Empathy & Care
          </div>
          <div className="kpi-sub">84.1% positive feedback rate</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">
            <UserCheck size={18} style={{ color: 'var(--color-accent)' }} />
            Instructional Aspects: Total vs Negative Volume
          </div>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <Tooltip
                formatter={(val, name) => [val, name === 'Mentions' ? 'Total Mentions' : 'Negative Feedback']}
                contentStyle={{
                  background: 'var(--color-surface-solid)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text-primary)',
                  fontSize: '0.85rem',
                }}
              />
              <Bar dataKey="Mentions" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Negative" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Aspects Table */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">Faculty Pedagogical Aspects</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pedagogical Aspect</th>
                  <th>Mentions</th>
                  <th>Negative Mentions</th>
                  <th>Negative Rate</th>
                  <th>Severity</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {teacherAspects.map(a => (
                  <tr key={a.category}>
                    <td style={{ fontWeight: 600 }}>{a.category}</td>
                    <td>{a.totalMentions.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-danger)' }}>{a.negativeCount}</td>
                    <td>{a.negativeRate.toFixed(1)}%</td>
                    <td>
                      <span className={`badge badge--${a.severity.toLowerCase()}`}>{a.severity}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{a.priorityScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Faculty Recommendations */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Faculty Development Action Items</div>
        </div>
        <div className="card-body">
          <div className="grid-2">
            {teacherRecommendations.map(r => (
              <div
                key={r.id}
                style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className={`badge badge--${r.severityLevel.toLowerCase()}`}>{r.severityLevel} Priority</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Score: {r.priorityScore}</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{r.concept}</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{r.recommendedAction}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
