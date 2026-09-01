import React, { createContext, useContext, useState } from 'react';
import { NotificationItem } from '../types';
import { initialNotifications } from '../data';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allNotifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Filter notifications relevant to current logged-in role & user ID
  const activeRole = user?.role || 'ADMIN';
  const activeUserId = user?.id;

  const notifications = allNotifications.filter((n) => {
    if (n.role && n.role !== activeRole) return false;
    if (n.userId && n.userId !== activeUserId) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    const activeIds = new Set(notifications.map((n) => n.id));
    setNotifications((prev) =>
      prev.map((n) => (activeIds.has(n.id) ? { ...n, isRead: true } : n))
    );
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      role: notif.role || activeRole,
      userId: notif.userId || activeUserId,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
