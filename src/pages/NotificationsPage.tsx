import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationType } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { Button } from '../components/common/Button';
import { Bell, AlertCircle, Calendar, FileText, Settings, CheckCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifications.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'Emergency':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'Leave':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'Schedule':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'System':
      default:
        return <Settings className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Hospital Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automated alerts for schedule swaps, emergency notifications, and leave approvals.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead} leftIcon={<CheckCheck className="w-4 h-4" />}>
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['ALL', 'Emergency', 'Schedule', 'Leave', 'System'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === t
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t === 'ALL' ? 'All Alerts' : t}
            </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => markAsRead(item.id)}
            className={`p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
              !item.isRead ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
              {getIcon(item.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">{item.timestamp}</span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
