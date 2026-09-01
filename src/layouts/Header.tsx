import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, ChevronRight, Search } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../components/auth/RoleProtectedRoute';
import { NotificationDropdown } from '../components/notifications/NotificationDropdown';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  isSidebarCollapsed,
}) => {
  const location = useLocation();
  const { user, role } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const homeDashboard = getRoleDashboard(role);

  // Format breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'Dashboard', path: homeDashboard }];

    return segments.map((seg, idx) => {
      const path = '/' + segments.slice(0, idx + 1).join('/');
      const label = seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      return { label, path };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className={`sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left Section: Mobile Menu Trigger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Trail */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <Link to={homeDashboard} className="hover:text-blue-600 font-medium">
              ScheduleX
            </Link>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.path}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <Link
                  to={bc.path}
                  className={`font-medium capitalize ${
                    idx === breadcrumbs.length - 1
                      ? 'text-slate-900 font-semibold'
                      : 'hover:text-blue-600'
                  }`}
                >
                  {bc.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right Section: Global Search, Notifications, User Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="hidden md:flex items-center relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search appointments, staff, resources..."
              className="w-56 lg:w-64 pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User Profile Menu Quick Display */}
          <Link
            to={role === 'PATIENT' ? '/patient/profile' : '/profile'}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'ScheduleX User'}
              </span>
              <span className="text-[10px] font-bold text-blue-600">
                {user?.role} {user?.specialization ? `• ${user.specialization}` : ''}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

