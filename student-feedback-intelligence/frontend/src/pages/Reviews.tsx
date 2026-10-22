import { useEffect, useState, useCallback } from 'react';
import { BookOpen, AlertTriangle, ChevronLeft, ChevronRight, Download, Search, RotateCcw } from 'lucide-react';
import { api } from '../api/client';
import type { ReviewsListResponse, ReviewRecord } from '../api/types';
import { VERIFIED_SAMPLE_REVIEWS, CORPUS_SUMMARY } from '../data/corpusData';

export default function Reviews() {
  const [data, setData] = useState<ReviewsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [page, setPage] = useState(1);
  const [domain, setDomain] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const loadReviews = useCallback(() => {
    setLoading(true);
    setOffline(false);
    api.reviews(page, 20, domain || undefined, sentiment || undefined, search || undefined)
      .then(res => {
        setData(res);
      })
      .catch(() => {
        setOffline(true);
        // Fallback to verified corpus records
        let sampleList = VERIFIED_SAMPLE_REVIEWS.map((r, i) => ({
          row_index: i,
          review_id: r.review_id,
          text: r.text,
          domain: r.domain,
          overall_sentiment: r.overall_sentiment,
        }));

        if (domain) {
          sampleList = sampleList.filter(r => r.domain.toLowerCase().includes(domain.toLowerCase()));
        }
        if (sentiment) {
          sampleList = sampleList.filter(r => r.overall_sentiment.toLowerCase() === sentiment.toLowerCase());
        }
        if (search) {
          sampleList = sampleList.filter(r => r.text.toLowerCase().includes(search.toLowerCase()));
        }

        setData({
          total: sampleList.length,
          page: 1,
          page_size: 20,
          total_pages: Math.max(1, Math.ceil(sampleList.length / 20)),
          domain_counts: {
            'Course Review': CORPUS_SUMMARY.domains.course.count,
            'Teacher Review': CORPUS_SUMMARY.domains.teacher.count,
            'University Review': CORPUS_SUMMARY.domains.university.count,
          },
          sentiment_counts: {
            Positive: CORPUS_SUMMARY.sentiment.positive.count,
            Negative: CORPUS_SUMMARY.sentiment.negative.count,
            Neutral: CORPUS_SUMMARY.sentiment.neutral.count,
          },
          reviews: sampleList,
        });
      })
      .finally(() => setLoading(false));
  }, [page, domain, sentiment, search]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleExportCSV = () => {
    if (!data || !data.reviews.length) return;
    const headers = ['Review_ID', 'Domain', 'Sentiment', 'Text'];
    const rows = data.reviews.map(r => [
      r.review_id,
      `"${r.domain}"`,
      `"${r.overall_sentiment}"`,
      `"${r.text.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'senticode_feedback_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reviews-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-eyebrow">Corpus Discovery & Querying</div>
        <h1 className="page-title">Feedback Explorer</h1>
        <p className="page-description">
          Browse, search, and filter 6,500+ multi-institutional student feedback records across Course, Teacher, and University domains.
        </p>
      </div>

      {offline && (
        <div className="alert alert--info" style={{ marginBottom: 'var(--space-4)' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <div>
            <strong>Showing Verified EduRABSA Corpus Sample:</strong> Backend API is offline. Connect FastAPI on port 8000 for full server-side pagination across all 6,500 records.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="card-body">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '1 1 240px', marginBottom: 0 }}>
              <label htmlFor="search-input" className="form-label">Review Text Keyword</label>
              <input
                id="search-input"
                type="text"
                className="form-input"
                placeholder="Search words (e.g., grading, wifi, clear)..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flex: '0 1 180px', marginBottom: 0 }}>
              <label htmlFor="domain-filter" className="form-label">Domain</label>
              <select
                id="domain-filter"
                className="form-select"
                value={domain}
                onChange={e => { setDomain(e.target.value); setPage(1); }}
              >
                <option value="">All Domains</option>
                <option value="Course Review">Course Review (3,000)</option>
                <option value="Teacher Review">Teacher Review (2,000)</option>
                <option value="University Review">University Review (1,500)</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: '0 1 160px', marginBottom: 0 }}>
              <label htmlFor="sentiment-filter" className="form-label">Sentiment</label>
              <select
                id="sentiment-filter"
                className="form-select"
                value={sentiment}
                onChange={e => { setSentiment(e.target.value); setPage(1); }}
              >
                <option value="">All Sentiments</option>
                <option value="Positive">Positive (4,008)</option>
                <option value="Negative">Negative (1,749)</option>
                <option value="Neutral">Neutral (743)</option>
              </select>
            </div>

            <button type="submit" className="btn btn--primary">
              <Search size={14} /> Search
            </button>

            {(search || domain || sentiment) && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                  setDomain('');
                  setSentiment('');
                  setPage(1);
                }}
              >
                <RotateCcw size={14} /> Reset
              </button>
            )}

            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleExportCSV}
              style={{ marginLeft: 'auto' }}
              title="Download filtered records as CSV"
            >
              <Download size={14} /> Export CSV
            </button>
          </form>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={18} style={{ color: 'var(--color-accent)' }} />
            Student Feedback Records ({data?.total?.toLocaleString() || 0} total)
          </div>
          {data && data.total_pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Page {page} of {data.total_pages}
              </span>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                disabled={page >= data.total_pages}
                onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '85px' }}>ID</th>
                  <th style={{ width: '150px' }}>Domain</th>
                  <th style={{ width: '120px' }}>Sentiment</th>
                  <th>Student Feedback Text</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      Loading records...
                    </td>
                  </tr>
                ) : !data || data.reviews.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                      No student feedback records matched your current query.
                    </td>
                  </tr>
                ) : (
                  data.reviews.map(r => (
                    <tr key={r.review_id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        #{r.review_id}
                      </td>
                      <td>
                        <span className="badge badge--accent">{r.domain.replace(' Review', '')}</span>
                      </td>
                      <td>
                        <span className={`badge badge--${(r.overall_sentiment || 'neutral').toLowerCase()}`}>
                          {r.overall_sentiment}
                        </span>
                      </td>
                      <td style={{ lineHeight: 1.5, color: 'var(--color-text-primary)' }}>
                        {r.text}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
