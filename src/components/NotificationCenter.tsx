import React, { useState } from 'react';
import { AppNotification, NotificationType } from '../types';
import {
  Bell,
  Star,
  UserPlus,
  CheckCircle2,
  Trash2,
  CheckCheck,
  ExternalLink,
  Flame,
  X,
} from 'lucide-react';
import { Mascot } from './Mascot';

interface NotificationCenterProps {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: AppNotification) => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'new_review' | 'new_follower' | 'invite_accepted'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'new_review') return n.type === 'new_review';
    if (activeFilter === 'new_follower') return n.type === 'new_follower';
    if (activeFilter === 'invite_accepted') return n.type === 'invite_accepted';
    return true;
  });

  const getEventIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_review':
        return <Star className="h-4 w-4 text-emerald-600 fill-emerald-400" />;
      case 'new_follower':
        return <UserPlus className="h-4 w-4 text-sky-600" />;
      case 'invite_accepted':
        return <CheckCircle2 className="h-4 w-4 text-amber-600" />;
      case 'streak_milestone':
        return <Flame className="h-4 w-4 text-amber-500 fill-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const getEventBadgeClass = (type: NotificationType) => {
    switch (type) {
      case 'new_review':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'new_follower':
        return 'bg-sky-50 text-sky-800 border-sky-300';
      case 'invite_accepted':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'streak_milestone':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDay = Math.floor(diffHr / 24);
      return `${diffDay}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="absolute right-0 top-14 z-50 w-[360px] sm:w-[420px] rounded-3xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 px-5 py-3.5 bg-sky-50/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border border-sky-200 text-sky-700 shadow-2xs">
            <Mascot type="curious" size="xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Activity from other creators</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5 text-sky-700" />
              <span className="hidden sm:inline">Read all</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="rounded-full p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear all notifications"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-b-2 border-slate-100 bg-slate-50/50 text-xs no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-sky-400 text-slate-950 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
            activeFilter === 'unread'
              ? 'bg-amber-300 text-slate-950 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('new_review')}
          className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
            activeFilter === 'new_review'
              ? 'bg-emerald-300 text-slate-950 shadow-2xs'
              : 'text-slate-600 hover:text-emerald-800'
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveFilter('new_follower')}
          className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
            activeFilter === 'new_follower'
              ? 'bg-sky-300 text-slate-950 shadow-2xs'
              : 'text-slate-600 hover:text-sky-800'
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => setActiveFilter('invite_accepted')}
          className={`rounded-full px-3 py-1 font-bold transition-all cursor-pointer ${
            activeFilter === 'invite_accepted'
              ? 'bg-rose-300 text-slate-950 shadow-2xs'
              : 'text-slate-600 hover:text-rose-800'
          }`}
        >
          Invites
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="py-10 text-center px-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No notifications here</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {activeFilter === 'unread'
                ? "You're all caught up! No unread events."
                : 'Activity like reviews, followers, and invite responses will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkAsRead(notif.id);
                if (onNotificationClick) {
                  onNotificationClick(notif);
                }
              }}
              className={`group flex items-start gap-3 p-4 transition-colors cursor-pointer ${
                !notif.read ? 'bg-sky-50/60 hover:bg-sky-100/50' : 'hover:bg-slate-50'
              }`}
            >
              {/* Event Badge / Actor Avatar */}
              <div className="relative flex-shrink-0">
                {notif.actor?.avatarUrl ? (
                  <img
                    src={notif.actor.avatarUrl}
                    alt={notif.actor.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-300"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                    {getEventIcon(notif.type)}
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white shadow-2xs ${getEventBadgeClass(
                    notif.type
                  )}`}
                >
                  {getEventIcon(notif.type)}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                    {notif.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono font-medium">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-sky-500 shadow-2xs" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-snug line-clamp-2 font-normal">
                  {notif.message}
                </p>

                {/* Subtext info */}
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${getEventBadgeClass(
                      notif.type
                    )}`}
                  >
                    {notif.type === 'new_review' && 'Peer Review'}
                    {notif.type === 'new_follower' && 'New Follower'}
                    {notif.type === 'invite_accepted' && 'Collab Accepted'}
                  </span>

                  {notif.targetType && (
                    <span className="text-[10px] text-sky-700 group-hover:underline transition-colors flex items-center gap-0.5 font-bold">
                      <span>View</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
