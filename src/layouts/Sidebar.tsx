import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileCheck,
  Stethoscope,
  Calendar,
  Clock,
  CalendarOff,
  Bell,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  CalendarPlus,
  Activity,
  Pill,
  FolderOpen,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../components/auth/RoleProtectedRoute';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const brandLink = getRoleDashboard(role);

  // Role Specific Navigation Arrays
  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Staff Directory', path: '/admin/staff', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Leave Approvals', path: '/admin/leaves', icon: FileCheck },
    { label: 'Resources', path: '/admin/resources', icon: Stethoscope },
    { label: 'Master Schedule', path: '/admin/schedule', icon: Calendar },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const doctorNav = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Clinical Schedule', path: '/doctor/schedule', icon: Calendar },
    { label: 'Patient Consultations', path: '/doctor/appointments', icon: UserCheck },
    { label: 'Availability', path: '/availability', icon: Clock },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const staffNav = [
    { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { label: 'Department Schedule', path: '/staff/schedule', icon: Calendar },
    { label: 'Assigned Appointments', path: '/staff/appointments', icon: CalendarPlus },
    { label: 'My Availability', path: '/availability', icon: Clock },
    { label: 'My Leaves', path: '/my-leaves', icon: CalendarOff },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const patientNav = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'Find Doctor', path: '/patient/doctors', icon: Search },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus },
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Medical History', path: '/patient/medical-history', icon: Activity },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { label: 'Documents', path: '/patient/documents', icon: FolderOpen },
    { label: 'Insurance & Claims', path: '/patient/insurance', icon: ShieldCheck },
    { label: 'Profile', path: '/patient/profile', icon: User },
  ];

  // Select active role navigation section
  const getNavGroup = () => {
    switch (role) {
      case 'ADMIN':
        return { title: 'Administration', items: adminNav };
      case 'DOCTOR':
        return { title: 'Doctor Portal', items: doctorNav };
      case 'STAFF':
        return { title: 'Staff Portal', items: staffNav };
      case 'PATIENT':
        return { title: 'Patient Portal', items: patientNav };
      default:
        return { title: 'Portal Navigation', items: patientNav };
    }
  };

  const activeGroup = getNavGroup();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          <NavLink to={brandLink} className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  Schedule<span className="text-blue-600">X</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                  Healthcare SaaS
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* ROLE AWARE Navigation Items — Only active role menu items rendered */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="mb-6">
            {!isCollapsed && (
              <h4 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {activeGroup.title}
              </h4>
            )}
            <nav className="space-y-1 px-2">
              {activeGroup.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Mini Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {user?.name || 'ScheduleX User'}
                </p>
                <p className="text-[11px] text-blue-600 font-bold truncate">
                  {user?.role} {user?.departmentName ? `• ${user.departmentName}` : ''}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
