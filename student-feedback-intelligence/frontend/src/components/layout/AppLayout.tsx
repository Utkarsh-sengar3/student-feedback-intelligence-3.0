import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SiteSearch } from '../ui/SiteSearch';
import { api } from '../../api/client';

interface AppLayoutProps {
  children: React.ReactNode;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function AppLayout({ children, theme, onToggleTheme }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('senticode-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean>(false);

  // Check API health status periodically
  useEffect(() => {
    let mounted = true;
    api.health()
      .then(() => { if (mounted) setApiOnline(true); })
      .catch(() => { if (mounted) setApiOnline(false); });
    return () => { mounted = false; };
  }, []);

  const handleToggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('senticode-sidebar-collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={handleToggleCollapsed}
        apiOnline={apiOnline}
      />
      <div className="main-wrapper">
        <TopBar
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenSearch={() => setSearchOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          apiOnline={apiOnline}
        />
        <main className="content-viewport">
          {children}
        </main>
      </div>

      <SiteSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
