import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  GraduationCap,
  UserCheck,
  Building2,
  Layers,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  BookOpen,
  Search,
  Bot,
  Cpu,
  GitBranch,
  Info,
  ChevronLeft,
  ChevronRight,
  Radio,
  LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroupConfig {
  title: string;
  items: NavItemConfig[];
}

export const NAV_GROUPS: NavGroupConfig[] = [
  {
    title: 'Core Intelligence',
    items: [
      { to: '/', label: 'Overview', icon: LayoutDashboard },
      { to: '/sentiment', label: 'Sentiment Analysis', icon: Activity },
      { to: '/course-intelligence', label: 'Course Intelligence', icon: GraduationCap },
      { to: '/faculty-intelligence', label: 'Faculty Intelligence', icon: UserCheck },
      { to: '/university-insights', label: 'University Insights', icon: Building2 },
    ],
  },
  {
    title: 'Aspects & Concerns',
    items: [
      { to: '/aspects', label: 'Aspect Analysis', icon: Layers },
      { to: '/concerns', label: 'Concern Detection', icon: AlertTriangle },
      { to: '/severity', label: 'Severity & Priority', icon: ShieldAlert },
      { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
    ],
  },
  {
    title: 'Exploration & Search',
    items: [
      { to: '/reviews', label: 'Feedback Explorer', icon: BookOpen },
      { to: '/search', label: 'Semantic Search', icon: Search },
    ],
  },
  {
    title: 'System & Models',
    items: [
      { to: '/assistant', label: 'AI Admin Assistant', icon: Bot },
      { to: '/models', label: 'Model Performance', icon: Cpu },
      { to: '/methodology', label: 'Methodology', icon: GitBranch },
      { to: '/about', label: 'About', icon: Info },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  apiOnline?: boolean;
}

export function Sidebar({ collapsed, onToggleCollapsed, apiOnline }: SidebarProps) {
  return (
    <aside
      className={`app-sidebar${collapsed ? ' app-sidebar--collapsed' : ''}`}
      aria-label="Sidebar navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand" title="Senticode Dashboard">
          <div className="sidebar-brand-badge" aria-hidden="true">&lt; / &gt;</div>
          {!collapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">Senticode</span>
              <span className="sidebar-brand-subtitle">Student Feedback Intel</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-nav-container">
        {NAV_GROUPS.map(group => (
          <div key={group.title} className="sidebar-group">
            {!collapsed && (
              <div className="sidebar-group-title">{group.title}</div>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="sidebar-icon">
                    <Icon size={18} />
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-status-pill">
            <span
              className={`status-dot status-dot--${apiOnline ? 'online' : 'loading'}`}
              aria-hidden="true"
            />
            <span>{apiOnline ? 'API Connected' : 'Corpus Verified'}</span>
          </div>
        )}
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
