
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { db } from "@/lib/storage/db";

export interface Notification {
  id?: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  date: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  toggleOpen: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSystemAlerts = async () => {
    try {
      // In a real app, this would be an API endpoint
      const response = await fetch('/data/system_alerts.json');
      if (!response.ok) return;
      const alerts = await response.json();
      
      const existing = await db.table('notifications').toArray();
      const signatures = new Set(existing.map((n: any) => `${n.title}-${n.message}`));

      for (const alert of alerts) {
        const signature = `${alert.title}-${alert.message}`;
        if (!signatures.has(signature)) {
          // Add new system alert
          await db.table('notifications').add({
            type: alert.type || 'info',
            title: alert.title,
            message: alert.message,
            date: Date.now(),
            read: false,
            isSystem: true // Flag to distinguish if needed
          });
        }
      }
    } catch (e) {
      // silent fail for json fetch
    }
  };

  const refreshNotifications = async () => {
    const items = await db.table('notifications').orderBy('date').reverse().toArray();
    setNotifications(items as Notification[]);
  };

  useEffect(() => {
    refreshNotifications();
    fetchSystemAlerts().then(refreshNotifications);
    
    // Poll for system alerts every 5 minutes
    const interval = setInterval(() => {
        fetchSystemAlerts().then(refreshNotifications);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const addNotification = async (notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    await db.table('notifications').add({
      ...notif,
      date: Date.now(),
      read: false
    });
    await refreshNotifications();
  };

  const markAsRead = async (id: number) => {
    await db.table('notifications').update(id, { read: true });
    await refreshNotifications();
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => db.table('notifications').update(n.id!, { read: true })));
    await refreshNotifications();
  };

  const clearAll = async () => {
    await db.table('notifications').clear();
    await refreshNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isOpen,
      toggleOpen: () => setIsOpen(prev => !prev),
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
