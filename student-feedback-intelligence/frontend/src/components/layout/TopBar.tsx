import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu } from 'lucide-react';

interface TopBarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  apiOnline?: boolean;
}

const ROUTE_TITLES: Record<string, { group: string; title: string }> = {
  '/': { group: 'Intelligence', title: 'Executive Overview' },
  '/overview': { group: 'Intelligence', title: 'Executive Overview' },
  '/dashboard': { group: 'Intelligence', title: 'Executive Overview' },
  '/sentiment': { group: 'Intelligence', title: 'Sentiment Analysis' },
  '/analyze': { group: 'Intelligence', title: 'Sentiment Analysis' },
  '/course-intelligence': { group: 'Intelligence', title: 'Course Intelligence' },
  '/faculty-intelligence': { group: 'Intelligence', title: 'Faculty Intelligence' },
  '/university-insights': { group: 'Intelligence', title: 'University Insights' },
  '/aspects': { group: 'Aspects & Concerns', title: 'Aspect Analysis' },
  '/concerns': { group: 'Aspects & Concerns', title: 'Concern Detection' },
  '/severity': { group: 'Aspects & Concerns', title: 'Severity & Priority' },
  '/recommendations': { group: 'Aspects & Concerns', title: 'Institutional Recommendations' },
  '/reviews': { group: 'Exploration', title: 'Feedback Explorer' },
  '/search': { group: 'Exploration', title: 'Semantic Search' },
  '/assistant': { group: 'System & Models', title: 'AI Admin Assistant' },
  '/models': { group: 'System & Models', title: 'Model Performance' },
  '/methodology': { group: 'System & Models', title: 'Pipeline Methodology' },
  '/about': { group: 'System & Models', title: 'About & Diagnostics' },
};

export function TopBar({
  theme,
  onToggleTheme,
  onOpenSearch,
  onToggleMobileMenu,
  apiOnline,
}: TopBarProps) {
  const location = useLocation();
  const currentMeta = ROUTE_TITLES[location.pathname] || {
    group: 'Platform',
    title: 'Senticode Intelligence',
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="btn btn--ghost btn--icon mobile-only"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={18} />
        </button>

        <nav className="breadcrumb-nav" aria-label="Breadcrumbs">
          <span className="breadcrumb-root">Senticode</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-root">{currentMeta.group}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentMeta.title}</span>
        </nav>
      </div>

      <div className="topbar-right">
        {/* Quick Search Trigger */}
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onOpenSearch}
          title="Search all pages and features (Ctrl+K)"
        >
          <Search size={14} />
          <span style={{ fontSize: '0.78rem' }}>Quick Search</span>
          <kbd
            style={{
              padding: '2px 5px',
              borderRadius: '4px',
              background: 'var(--color-surface-solid)',
              border: '1px solid var(--color-border)',
              fontSize: '0.65rem',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Ctrl+K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} style={{ color: 'var(--color-warning)' }} /> : <Moon size={17} style={{ color: 'var(--color-accent)' }} />}
        </button>
      </div>
    </header>
  );
}
