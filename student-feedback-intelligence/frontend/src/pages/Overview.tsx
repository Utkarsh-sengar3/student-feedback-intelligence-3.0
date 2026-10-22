import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Layers,
  Lightbulb,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { api } from '../api/client';
import {
  CORPUS_SUMMARY,
  DOMAIN_BREAKDOWN,
  ASPECT_CATEGORIES,
  TOP_RECOMMENDATIONS,
} from '../data/corpusData';

const SENTIMENT_COLORS = {
  Positive: '#38B879',
  Negative: '#F07878',
  Neutral: '#E9B75C',
};

export default function Overview() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    api.health()
      .then(() => { if (active) setApiOnline(true); })
      .catch(() => { if (active) setApiOnline(false); });
    return () => { active = false; };
  }, []);

  // Sentiment Distribution Donut Data
  const sentimentDonutData = [
    { name: 'Positive', value: CORPUS_SUMMARY.sentiment.positive.count },
    { name: 'Negative', value: CORPUS_SUMMARY.sentiment.negative.count },
    { name: 'Neutral', value: CORPUS_SUMMARY.sentiment.neutral.count },
  ];

  // Grouped Domain Sentiment Data
  const domainSentimentData = DOMAIN_BREAKDOWN.map(d => ({
    domain: d.domain.replace(' Review', ''),
    Positive: d.positive,
    Negative: d.negative,
    Neutral: d.neutral,
  }));

  // Top 5 Highest Priority Concerns
  const topConcerns = ASPECT_CATEGORIES.slice(0, 5);

  return (
    <div className="overview-page">
      {/* 1. Executive Header */}
      <div className="page-header">
        <div className="page-eyebrow">Institutional Analytics Platform</div>
        <h1 className="page-title">Student Feedback Intelligence</h1>
        <p className="page-description">
          Understand student experiences, identify recurring concerns, and turn feedback into actionable institutional insights.
        </p>
      </div>

      {/* 2. System Status Diagnostic Banner */}
      {apiOnline === false && (
        <div className="alert alert--info" style={{ marginBottom: 'var(--space-6)' }}>
          <CheckCircle2 size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <div>
            <strong>Showing Verified EduRABSA Corpus Baseline:</strong> 6,500 student feedback records verified with 0% data leakage. Connect the local FastAPI backend on port 8000 for real-time model inference.
          </div>
        </div>
      )}

      {/* 3. Verified KPI Cards Grid */}
      <div className="stats-grid">
        <div className="kpi-card">
          <div className="kpi-label">
            <span>Total Feedback</span>
            <FileText size={15} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="kpi-value">{CORPUS_SUMMARY.totalRecords.toLocaleString()}</div>
          <div className="kpi-sub">Across 3 academic domains</div>
        </div>

        <div className="kpi-card kpi-card--positive">
          <div className="kpi-label">
            <span>Positive Sentiment</span>
            <TrendingUp size={15} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>
            {CORPUS_SUMMARY.sentiment.positive.percentage.toFixed(1)}%
          </div>
          <div className="kpi-sub">{CORPUS_SUMMARY.sentiment.positive.count.toLocaleString()} records</div>
        </div>

        <div className="kpi-card kpi-card--negative">
          <div className="kpi-label">
            <span>Negative Sentiment</span>
            <TrendingDown size={15} style={{ color: 'var(--color-danger)' }} />
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-danger)' }}>
            {CORPUS_SUMMARY.sentiment.negative.percentage.toFixed(1)}%
          </div>
          <div className="kpi-sub">{CORPUS_SUMMARY.sentiment.negative.count.toLocaleString()} records</div>
        </div>

        <div className="kpi-card kpi-card--neutral">
          <div className="kpi-label">
            <span>Neutral Sentiment</span>
            <Activity size={15} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>
            {CORPUS_SUMMARY.sentiment.neutral.percentage.toFixed(1)}%
          </div>
          <div className="kpi-sub">{CORPUS_SUMMARY.sentiment.neutral.count.toLocaleString()} records</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <span>Aspect Categories</span>
            <Layers size={15} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div className="kpi-value">{CORPUS_SUMMARY.categoriesCount}</div>
          <div className="kpi-sub">Multi-label classification</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            <span>Detected Concerns</span>
            <AlertTriangle size={15} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className="kpi-value">{CORPUS_SUMMARY.detectedConcernsCount}</div>
          <div className="kpi-sub">{CORPUS_SUMMARY.criticalConcernsCount} critical priority</div>
        </div>
      </div>

      {/* 4. Sentiment Section: Charts */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Sentiment Distribution Donut */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Overall Sentiment Distribution</div>
              <div className="card-subtitle">Distribution across all 6,500 indexed reviews</div>
            </div>
            <Link to="/sentiment" className="btn btn--ghost btn--sm">
              Explore <ArrowRight size={13} />
            </Link>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={sentimentDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill={SENTIMENT_COLORS.Positive} />
                  <Cell fill={SENTIMENT_COLORS.Negative} />
                  <Cell fill={SENTIMENT_COLORS.Neutral} />
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} reviews (${((val / CORPUS_SUMMARY.totalRecords) * 100).toFixed(1)}%)`, 'Count']}
                  contentStyle={{
                    background: 'var(--color-surface-solid)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    color: 'var(--color-text-primary)',
                    fontSize: '0.85rem',
                  }}
                />
                <Legend
                  formatter={(val) => <span style={{ color: 'var(--color-text-primary)', fontSize: '0.82rem' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grouped Domain Sentiment Comparison */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Sentiment by Review Domain</div>
              <div className="card-subtitle">Comparative volume across Course, Teacher, and University</div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={domainSentimentData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="domain" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
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
                <Legend
                  formatter={(val) => <span style={{ color: 'var(--color-text-primary)', fontSize: '0.82rem' }}>{val}</span>}
                />
                <Bar dataKey="Positive" fill={SENTIMENT_COLORS.Positive} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Negative" fill={SENTIMENT_COLORS.Negative} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Neutral" fill={SENTIMENT_COLORS.Neutral} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Highest Priority Concerns Section */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
              Highest-Priority Student Concerns
            </div>
            <div className="card-subtitle">
              Ranked by frequency weighting and negative sentiment severity
            </div>
          </div>
          <Link to="/concerns" className="btn btn--ghost btn--sm">
            View All 85 Concerns <ArrowRight size={13} />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Aspect Category</th>
                  <th>Domain</th>
                  <th>Mentions</th>
                  <th>Negative Rate</th>
                  <th>Severity Level</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {topConcerns.map((c) => (
                  <tr key={c.category}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.category}</div>
                    </td>
                    <td>
                      <span className="badge badge--accent">{c.domain.replace(' Review', '')}</span>
                    </td>
                    <td>{c.totalMentions.toLocaleString()}</td>
                    <td>
                      <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>
                        {c.negativeRate.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge--${c.severity.toLowerCase()}`}>
                        {c.severity}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
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

      {/* 6. Actionable Institutional Recommendations Section */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Lightbulb size={18} style={{ color: 'var(--color-accent)' }} />
              Actionable Institutional Recommendations
            </div>
            <div className="card-subtitle">
              Evidence-backed recommendations with assigned owners derived from Phase 16 analysis
            </div>
          </div>
          <Link to="/recommendations" className="btn btn--primary btn--sm">
            View All Action Items <ArrowRight size={13} />
          </Link>
        </div>
        <div className="card-body">
          <div className="grid-2">
            {TOP_RECOMMENDATIONS.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge--${rec.severityLevel.toLowerCase()}`}>
                    {rec.severityLevel} Priority
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    Score: <strong>{rec.priorityScore}</strong>
                  </span>
                </div>

                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--color-text-primary)' }}>
                  {rec.concept}
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {rec.recommendedAction}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                  <span style={{ color: 'var(--color-accent)' }}>{rec.recommendedOwner}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{rec.domain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
