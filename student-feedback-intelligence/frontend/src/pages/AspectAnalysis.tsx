import { useState } from 'react';
import { Layers, Search, Filter, BarChart2 } from 'lucide-react';
import { ASPECT_CATEGORIES } from '../data/corpusData';

export default function AspectAnalysis() {
  const [domainFilter, setDomainFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = ASPECT_CATEGORIES.filter(a => {
    if (domainFilter && a.domain !== domainFilter) return false;
    if (search && !a.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="aspect-analysis-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Taxonomy & Multi-Label Classification</div>
        <h1 className="page-title">Aspect Category Analysis</h1>
        <p className="page-description">
          Multi-label classification of 24 educational aspect categories spanning Course, Teacher, and University dimensions, benchmarked with 71.6% Micro F1.
        </p>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-body" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search aspect categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ flex: '0 1 200px' }}>
              <select
                className="form-select"
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
              >
                <option value="">All Domains</option>
                <option value="Course Review">Course Review</option>
                <option value="Teacher Review">Teacher Review</option>
                <option value="University Review">University Review</option>
              </select>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
              Showing <strong>{filtered.length}</strong> of 24 categories
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Layers size={18} style={{ color: 'var(--color-accent)' }} />
            Aspect Category Taxonomy & Negative Impact
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Domain</th>
                  <th>Total Mentions</th>
                  <th>Negative Mentions</th>
                  <th>Negative Rate</th>
                  <th>Severity Tier</th>
                  <th>Priority Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.category}>
                    <td style={{ fontWeight: 600 }}>{a.category}</td>
                    <td>
                      <span className="badge badge--accent">{a.domain.replace(' Review', '')}</span>
                    </td>
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
    </div>
  );
}
