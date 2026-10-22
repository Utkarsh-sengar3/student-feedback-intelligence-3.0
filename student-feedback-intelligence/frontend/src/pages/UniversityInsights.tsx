import {
  Building2,
  Wifi,
  Utensils,
  BookMarked,
  Headphones,
  AlertOctagon,
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

export default function UniversityInsights() {
  const uniAspects = ASPECT_CATEGORIES.filter(c => c.domain === 'University Review');
  const uniRecommendations = TOP_RECOMMENDATIONS.filter(r => r.domain === 'University Review');

  const chartData = uniAspects.map(a => ({
    name: a.category.replace(' & ', ' / ').slice(0, 18),
    fullName: a.category,
    Mentions: a.totalMentions,
    Negative: a.negativeCount,
  }));

  return (
    <div className="university-insights-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Institutional Operations Analytics</div>
        <h1 className="page-title">University Insights</h1>
        <p className="page-description">
          Operational intelligence from 1,500 student reviews assessing campus Wi-Fi infrastructure, dining halls, study libraries, and administrative offices.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="kpi-card">
          <div className="kpi-label">University Reviews</div>
          <div className="kpi-value">1,500</div>
          <div className="kpi-sub">23.08% of total dataset</div>
        </div>

        <div className="kpi-card kpi-card--positive">
          <div className="kpi-label">Positive Sentiment</div>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>56.5%</div>
          <div className="kpi-sub">848 positive experiences</div>
        </div>

        <div className="kpi-card kpi-card--negative">
          <div className="kpi-label">Negative Sentiment</div>
          <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>30.6%</div>
          <div className="kpi-sub">459 operational complaints</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Highest Distress Rate</div>
          <div className="kpi-value" style={{ fontSize: '1.2rem', color: 'var(--color-danger)' }}>
            Campus Wi-Fi
          </div>
          <div className="kpi-sub">70.8% negative dissatisfaction</div>
        </div>
      </div>

      {/* Infrastructure Disruption Chart */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">
            <Building2 size={18} style={{ color: 'var(--color-accent)' }} />
            Campus Facility & Service Breakdown
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

      {/* Table */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div className="card-title">Campus Operations Metrics</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campus Facility / Service</th>
                  <th>Mentions</th>
                  <th>Negative Mentions</th>
                  <th>Negative Rate</th>
                  <th>Severity Tier</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {uniAspects.map(a => (
                  <tr key={a.category}>
                    <td style={{ fontWeight: 600 }}>{a.category}</td>
                    <td>{a.totalMentions.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-danger)' }}>{a.negativeCount}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: a.negativeRate > 50 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
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

      {/* Recommendations */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Campus Infrastructure Action Items</div>
        </div>
        <div className="card-body">
          <div className="grid-2">
            {uniRecommendations.map(r => (
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
