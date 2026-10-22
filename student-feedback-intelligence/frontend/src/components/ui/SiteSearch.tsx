import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';

const ALL_SEARCH_ITEMS = [
  { label: 'Executive Overview', path: '/', category: 'Intelligence', description: 'Institutional feedback KPIs, sentiment breakdown, and high-priority concerns' },
  { label: 'Sentiment Analysis', path: '/sentiment', category: 'Intelligence', description: 'Deep sentiment polarity metrics and interactive single/comparative review testing' },
  { label: 'Course Intelligence', path: '/course-intelligence', category: 'Intelligence', description: '3,000 course feedback records, curriculum, workload, and exams analysis' },
  { label: 'Faculty Intelligence', path: '/faculty-intelligence', category: 'Intelligence', description: '2,000 instructor reviews, teaching clarity, accessibility, and pedagogy' },
  { label: 'University Insights', path: '/university-insights', category: 'Intelligence', description: '1,500 university reviews, campus Wi-Fi, facilities, and administration' },
  { label: 'Aspect Analysis', path: '/aspects', category: 'Aspects & Concerns', description: '24 aspect categories, distribution rankings, and multi-label correlations' },
  { label: 'Concern Detection', path: '/concerns', category: 'Aspects & Concerns', description: 'Highest-priority student complaints, negative rates, and pain points' },
  { label: 'Severity & Priority', path: '/severity', category: 'Aspects & Concerns', description: 'Algorithmic scoring formula (P = f * (1 + S)) and severity tiers' },
  { label: 'Recommendations', path: '/recommendations', category: 'Aspects & Concerns', description: '85 ranked institutional action items with assigned owners' },
  { label: 'Feedback Explorer', path: '/reviews', category: 'Exploration', description: 'Full-text search, domain & sentiment filters, pagination, and CSV export' },
  { label: 'Semantic Search', path: '/search', category: 'Exploration', description: 'Vector similarity search over 6,500 dense embeddings (all-MiniLM-L6-v2)' },
  { label: 'AI Admin Assistant', path: '/assistant', category: 'System & Models', description: 'Ask natural-language institutional questions with grounded evidence retrieval' },
  { label: 'Model Performance', path: '/models', category: 'System & Models', description: 'Empirical benchmark metrics (DistilBERT, LinearSVC, MiniLM retrieval)' },
  { label: 'Pipeline Methodology', path: '/methodology', category: 'System & Models', description: 'Supervised 8-stage ML pipeline architecture, zero-leakage verification' },
  { label: 'About & Diagnostics', path: '/about', category: 'System & Models', description: 'Senticode v3.0 platform details, system diagnostics, and tech stack' },
];

interface SiteSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SiteSearch({ isOpen, onClose }: SiteSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? ALL_SEARCH_ITEMS.filter(
        item =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_SEARCH_ITEMS;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setQuery('');
    }
  }, [isOpen]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-modal-input-row">
          <Search size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="search-modal-input"
            placeholder="Type a page, metric, or feature to jump..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button
            type="button"
            className="btn btn--ghost btn--icon btn--sm"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="search-results-list" role="listbox">
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.path}
                className="search-result-item"
                role="option"
                tabIndex={0}
                aria-selected={false}
                onClick={() => go(item.path)}
                onKeyDown={e => e.key === 'Enter' && go(item.path)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--color-accent)',
                        padding: '1px 6px',
                        background: 'var(--color-accent-dim)',
                        borderRadius: '3px',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {item.description}
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
