import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, AlertCircle, Calendar, FileText, Settings, ExternalLink } from 'lucide-react';
import { NotificationType } from '../../types';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'Emergency':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'Leave':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'Schedule':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'System':
      default:
        return <Settings className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <h4 className="text-sm font-semibold text-slate-800">Notifications</h4>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No notifications at this time.
          </div>
        ) : (
          notifications.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                !item.isRead ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-slate-100">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className={`text-xs font-semibold truncate ${!item.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                    {item.title}
                  </p>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{item.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50/70 border-t border-slate-100 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
        >
          View all notifications <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
