import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  BookOpen,
  CheckCircle,
  AlertTriangle,
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

export default function CourseIntelligence() {
  const courseAspects = ASPECT_CATEGORIES.filter(c => c.domain === 'Course Review');
  const courseRecommendations = TOP_RECOMMENDATIONS.filter(r => r.domain === 'Course Review');

  const chartData = courseAspects.map(a => ({
    name: a.category.replace(' & ', ' / ').slice(0, 18) + '...',
    fullName: a.category,
    Mentions: a.totalMentions,
    Negative: a.negativeCount,
  }));

  return (
    <div className="course-intelligence-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Academic Domain Analytics</div>
        <h1 className="page-title">Course Intelligence</h1>
        <p className="page-description">
          Empirical analytics across 3,000 student course reviews evaluating curriculum rigor, exam difficulty, workload balance, and instructional materials.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="kpi-card">
          <div className="kpi-label">Course Reviews</div>
          <div className="kpi-value">3,000</div>
          <div className="kpi-sub">46.15% of dataset corpus</div>
        </div>

        <div className="kpi-card kpi-card--positive">
          <div className="kpi-label">Positive Sentiment</div>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>61.3%</div>
          <div className="kpi-sub">1,840 positive feedback records</div>
        </div>

        <div className="kpi-card kpi-card--negative">
          <div className="kpi-label">Negative Sentiment</div>
          <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>27.0%</div>
          <div className="kpi-sub">810 negative feedback records</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Top Recurring Issue</div>
          <div className="kpi-value" style={{ fontSize: '1.2rem', color: 'var(--color-danger)' }}>
            Exam Fairness
          </div>
          <div className="kpi-sub">51.8% negative sentiment rate</div>
        </div>
      </div>

      {/* Chart: Course Aspect Mentions and Negatives */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">
            <GraduationCap size={18} style={{ color: 'var(--color-accent)' }} />
            Course Aspect Frequency & Negative Disruption
          </div>
          <div className="card-subtitle">
            Total feedback volume versus negative sentiment frequency
          </div>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
              <Tooltip
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

      {/* Course Aspects Data Table */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">Detailed Course Aspect Breakdown</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course Aspect</th>
                  <th>Mentions</th>
                  <th>Negative Mentions</th>
                  <th>Negative Rate</th>
                  <th>Severity Tier</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {courseAspects.map(a => (
                  <tr key={a.category}>
                    <td style={{ fontWeight: 600 }}>{a.category}</td>
                    <td>{a.totalMentions.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-danger)' }}>{a.negativeCount}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: a.negativeRate > 40 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
                        {a.negativeRate.toFixed(1)}%
                      </span>
                    </td>
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

      {/* Course Action Items */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Curriculum & Exam Action Items</div>
        </div>
        <div className="card-body">
          <div className="grid-2">
            {courseRecommendations.map(r => (
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
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Owner: {r.recommendedOwner}</span>
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
