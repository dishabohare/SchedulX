import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NotificationProvider } from '../context/NotificationContext';

export const DashboardLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          onMobileClose={() => setIsMobileOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Header Bar */}
        <Header
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Viewport */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
};
