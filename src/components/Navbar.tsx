import React, { useState, useRef, useEffect } from 'react';
import { User, AppNotification, NotificationType } from '../types';
import {
  ShieldCheck,
  Plus,
  Sparkles,
  MessageSquare,
  Compass,
  Terminal,
  FileCode2,
  LogOut,
  Settings,
  Bell,
  User as UserIcon,
} from 'lucide-react';
import { Logo } from './Logo';
import { NotificationCenter } from './NotificationCenter';
import { VerifiedBadge } from './VerifiedBadge';

interface NavbarProps {
  activeTab: 'showcase' | 'studio' | 'reviews' | 'messages';
  setActiveTab: (tab: 'showcase' | 'studio' | 'reviews' | 'messages') => void;
  currentUser: User | null;
  onOpenGoogleLogin: (mode?: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onNewProject: () => void;
  onShowIntro?: () => void;
  unreadCount: number;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onClearNotifications: () => void;
  onNotificationClick?: (notification: AppNotification) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenGoogleLogin,
  onOpenProfile,
  onLogout,
  onNewProject,
  onShowIntro,
  unreadCount,
  notifications,
  unreadNotificationsCount,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearNotifications,
  onNotificationClick,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Logo (No 'W' block - dynamic maker spark emblem) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('showcase')}
            className="flex items-center gap-2 text-left transition-opacity hover:opacity-90"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          {onShowIntro && (
            <button
              onClick={onShowIntro}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              Intro Page
            </button>
          )}

          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'showcase'
                ? 'bg-slate-800/80 text-white font-semibold shadow-inner'
                : 'hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Compass className="h-4 w-4 text-indigo-400" />
            Showcase
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                onOpenGoogleLogin();
              } else {
                setActiveTab('studio');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-slate-800/80 text-white font-semibold shadow-inner'
                : 'hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <Terminal className="h-4 w-4 text-emerald-400" />
            Drop Build
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-slate-800/80 text-white font-semibold shadow-inner'
                : 'hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            Peer Reviews
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                onOpenGoogleLogin();
              } else {
                setActiveTab('messages');
              }
            }}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-slate-800/80 text-white font-semibold shadow-inner'
                : 'hover:text-white hover:bg-slate-900/50'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-amber-400" />
            Chat & Friends
            {unreadCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & User Status */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notification Center Trigger with Badge Counter */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className={`relative flex items-center justify-center rounded-xl p-2 transition-all ${
                isNotificationOpen
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/90 bg-slate-900/60'
              }`}
              title="Notification Center"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-md shadow-rose-500/40 animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown */}
            {isNotificationOpen && (
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={onMarkNotificationAsRead}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onClearAll={onClearNotifications}
                onNotificationClick={(notif) => {
                  setIsNotificationOpen(false);
                  if (onNotificationClick) {
                    onNotificationClick(notif);
                  }
                }}
                onClose={() => setIsNotificationOpen(false)}
              />
            )}
          </div>

          <button
            onClick={() => {
              if (!currentUser) {
                onOpenGoogleLogin();
              } else {
                onNewProject();
              }
            }}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Drop Build</span>
            <span className="sm:hidden">Drop</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenProfile}
                className="group flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 pr-2.5 transition-colors hover:border-slate-700 hover:bg-slate-900"
                title="Edit Your Creator Profile & Pic"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500/50"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate max-w-[85px]">
                      @{currentUser.handle}
                    </span>
                    <VerifiedBadge
                      size="xs"
                      reputationScore={currentUser.reputationScore}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-mono">
                    <ShieldCheck className="h-3 w-3" />
                    Human 100%
                  </span>
                </div>
              </button>

              <button
                onClick={onOpenProfile}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                title="Profile Settings & Avatar Upload"
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                onClick={onLogout}
                className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Log out of account"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenGoogleLogin('login')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenGoogleLogin('signup')}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
