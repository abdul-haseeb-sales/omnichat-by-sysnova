import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Inbox, Radio, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Inbox, label: 'Inbox' },
    { path: '/channels', icon: Radio, label: 'Channels' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-top">
        <Link to="/" className="sidebar-logo">
          <MessageCircle size={28} />
        </Link>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon size={24} />
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-avatar" title={user?.user_metadata?.full_name || user?.email}>
          {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <button className="sidebar-nav-item logout-btn" onClick={signOut} title="Sign Out">
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
}
