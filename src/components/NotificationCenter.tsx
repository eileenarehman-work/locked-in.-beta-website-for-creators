import React, { useState } from 'react';
import { AppNotification, NotificationType } from '../types';
import {
  Bell,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  Trash2,
  CheckCheck,
  X,
  ExternalLink,
  Sparkles,
  Star,
  Users,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: AppNotification) => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onClose,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'new_review' | 'new_follower' | 'invite_accepted'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

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
        return <Star className="h-4 w-4 text-emerald-400" />;
      case 'new_follower':
        return <UserPlus className="h-4 w-4 text-indigo-400" />;
      case 'invite_accepted':
        return <CheckCircle2 className="h-4 w-4 text-amber-400" />;
      case 'streak_milestone':
        return <Flame className="h-4 w-4 text-amber-400 fill-amber-400/40" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  const getEventBadgeClass = (type: NotificationType) => {
    switch (type) {
      case 'new_review':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'new_follower':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'invite_accepted':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'streak_milestone':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
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
    <div className="absolute right-0 top-12 z-50 w-[360px] sm:w-[420px] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Reviews, followers & collaboration invites</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Read all</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear all notifications"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 border-b border-slate-800/60 bg-slate-950/30 text-xs no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
            activeFilter === 'unread'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('new_review')}
          className={`rounded-lg px-2 py-1 font-medium transition-all ${
            activeFilter === 'new_review'
              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveFilter('new_follower')}
          className={`rounded-lg px-2 py-1 font-medium transition-all ${
            activeFilter === 'new_follower'
              ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
              : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => setActiveFilter('invite_accepted')}
          className={`rounded-lg px-2 py-1 font-medium transition-all ${
            activeFilter === 'invite_accepted'
              ? 'bg-amber-500/20 text-amber-300 font-semibold'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          Invites
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/50">
        {filteredNotifications.length === 0 ? (
          <div className="py-10 text-center px-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500">
              <Bell className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No notifications here</p>
            <p className="mt-1 text-xs text-slate-500">
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
              className={`group flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                !notif.read ? 'bg-indigo-950/25 hover:bg-indigo-950/40' : 'hover:bg-slate-800/50'
              }`}
            >
              {/* Event Badge / Actor Avatar */}
              <div className="relative flex-shrink-0">
                {notif.actor?.avatarUrl ? (
                  <img
                    src={notif.actor.avatarUrl}
                    alt={notif.actor.name}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-700"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                    {getEventIcon(notif.type)}
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-900 ${getEventBadgeClass(
                    notif.type
                  )}`}
                >
                  {getEventIcon(notif.type)}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                    {notif.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-500/20" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                  {notif.message}
                </p>

                {/* Subtext info */}
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium border ${getEventBadgeClass(
                      notif.type
                    )}`}
                  >
                    {notif.type === 'new_review' && 'Peer Review'}
                    {notif.type === 'new_follower' && 'New Follower'}
                    {notif.type === 'invite_accepted' && 'Collab Accepted'}
                  </span>

                  {notif.targetType && (
                    <span className="text-[10px] text-slate-400 group-hover:text-indigo-300 transition-colors flex items-center gap-0.5">
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
