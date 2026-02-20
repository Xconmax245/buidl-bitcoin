
"use client";

import { useNotifications } from "@/providers/NotificationProvider";

export function NotificationsModal() {
  const { notifications, unreadCount, isOpen, toggleOpen, markAllAsRead, clearAll } = useNotifications();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
        onClick={toggleOpen}
      />
      <div className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)] bg-background-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-background-dark/50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary text-background-dark text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex gap-2 text-xs">
            <button 
              onClick={markAllAsRead}
              className="text-primary hover:text-white transition-colors disabled:opacity-50"
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
            <span className="text-slate-600">|</span>
            <button 
              onClick={clearAll}
              className="text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
              disabled={notifications.length === 0}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <span className="material-icons text-3xl mb-2 opacity-50">notifications_off</span>
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg border transition-all hover:bg-surface-hover ${
                  notif.read 
                    ? 'bg-transparent border-transparent opacity-75' 
                    : 'bg-primary/5 border-primary/20 shadow-sm'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    notif.type === 'success' ? 'bg-green-500' :
                    notif.type === 'warning' ? 'bg-yellow-500' :
                    notif.type === 'error' ? 'bg-red-500' : 'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>
                      {notif.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-600 mt-2 block font-mono">
                      {new Date(notif.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
