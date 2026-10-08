import React, { useState, useRef, useEffect } from 'react';
import { User, AppNotification } from '../types';
import {
  ShieldCheck,
  Plus,
  MessageSquare,
  Compass,
  Terminal,
  LogOut,
  Settings,
  Bell,
  Flame,
  Star,
} from 'lucide-react';
import { Logo } from './Logo';
import { Mascot } from './Mascot';
import { NotificationCenter } from './NotificationCenter';
import { VerifiedBadge } from './VerifiedBadge';

export type NavTabType = 'feed' | 'streak' | 'studio' | 'reviews' | 'messages';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  currentUser: User | null;
  currentStreak?: number;
  onOpenPointsGuide?: () => void;
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
  currentStreak = 0,
  onOpenPointsGuide,
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
    <header className="sticky top-0 z-40 w-full border-b-2 border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 flex-nowrap gap-2 sm:gap-4">
        {/* Zone 1: Brand Logo - Clicking puts user into Intro tab */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onShowIntro) {
                onShowIntro();
              } else {
                setActiveTab('feed');
              }
            }}
            className="flex h-9 items-center gap-2 text-left transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="Click to view Intro & Welcome"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* Zone 2: Navigation Links - Bubbly rounded pastel pills */}
        <nav className="hidden lg:flex items-center gap-1.5 sm:gap-2 text-sm font-medium shrink-0 flex-nowrap">
          {/* 1. Feed Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`flex h-9 items-center gap-1.5 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'feed'
                ? 'bg-sky-100 text-sky-800 border-2 border-sky-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className={`h-4 w-4 ${activeTab === 'feed' ? 'text-sky-700' : 'text-slate-500'}`} />
            <span>Feed</span>
          </button>

          {/* 2. Streak Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('streak')}
            className={`flex h-9 items-center gap-1.5 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'streak'
                ? 'bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className={`h-4 w-4 ${activeTab === 'streak' ? 'text-amber-600 fill-amber-500' : 'text-slate-500'}`} />
            <span>Streaks</span>
          </button>

          {/* 3. Post Tab */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                onOpenGoogleLogin('signup');
              } else {
                setActiveTab('studio');
              }
            }}
            className={`flex h-9 items-center gap-1.5 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'studio'
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className={`h-4 w-4 ${activeTab === 'studio' ? 'text-emerald-700' : 'text-slate-500'}`} />
            <span>Studio</span>
          </button>

          {/* 4. Reviews Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex h-9 items-center gap-1.5 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'reviews'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className={`h-4 w-4 ${activeTab === 'reviews' ? 'text-rose-700' : 'text-slate-500'}`} />
            <span>Reviews</span>
          </button>

          {/* 5. Chat Tab */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                onOpenGoogleLogin('login');
              } else {
                setActiveTab('messages');
              }
            }}
            className={`relative flex h-9 items-center gap-1.5 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'messages'
                ? 'bg-sky-100 text-sky-800 border-2 border-sky-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className={`h-4 w-4 ${activeTab === 'messages' ? 'text-sky-700' : 'text-slate-500'}`} />
            <span>Messages</span>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white px-1 shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & User Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
          {/* Notification Center Trigger */}
          <div className="relative shrink-0" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen((prev) => !prev)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer shrink-0 border-2 ${
                isNotificationOpen
                  ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white'
              }`}
              title="Notification Center"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown */}
            {isNotificationOpen && (
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadNotificationsCount}
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

          {/* Quick Post / Drop Build CTA */}
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                onOpenGoogleLogin('signup');
              } else {
                onNewProject();
              }
            }}
            className="flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-3.5 sm:px-4 text-xs font-black text-slate-900 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Post Build</span>
            <span className="sm:hidden">Post</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">
              {/* Daily Streak & Points Tracker Button */}
              <button
                type="button"
                onClick={onOpenPointsGuide}
                className="flex h-9 items-center gap-1.5 rounded-full border-2 border-amber-200 bg-amber-50 px-2.5 sm:px-3 text-xs transition-all hover:border-amber-300 hover:bg-amber-100/70 shadow-xs group cursor-pointer shrink-0"
                title="Points & Daily Streak Guide - Click to learn how it works"
              >
                <div className="flex items-center gap-1 text-amber-700 font-mono font-bold">
                  <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500 animate-pulse group-hover:scale-110 transition-transform" />
                  <span>{currentStreak > 0 ? currentStreak : 1}d</span>
                </div>
                <span className="text-amber-300 text-[10px]">|</span>
                <div className="flex items-center gap-1 text-amber-800 font-mono font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>{currentUser.reputationScore || 0} pts</span>
                </div>
              </button>

              {/* Account Profile Chip */}
              <button
                type="button"
                onClick={onOpenProfile}
                className="group flex h-9 items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-2 sm:px-2.5 transition-all hover:border-sky-300 cursor-pointer shrink-0 shadow-xs"
                title="Edit Your Creator Profile & Pic"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  referrerPolicy="no-referrer"
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-emerald-300 shrink-0"
                />
                <div className="hidden sm:flex items-center gap-1 leading-none">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700 truncate max-w-[90px]">
                    @{currentUser.handle}
                  </span>
                  <VerifiedBadge
                    size="xs"
                    reputationScore={currentUser.reputationScore}
                  />
                </div>
              </button>

              {/* Profile Settings */}
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Profile Settings & Avatar Upload"
              >
                <Settings className="h-4 w-4" />
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Log out of account"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onOpenPointsGuide}
                className="hidden md:flex h-9 items-center gap-1.5 rounded-full border-2 border-amber-200 bg-amber-50 px-3 text-xs text-amber-800 hover:border-amber-300 transition-colors cursor-pointer shrink-0 font-semibold"
                title="Learn how Maker Points & Daily Streaks work"
              >
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                <span>Points Guide</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenGoogleLogin('login')}
                className="flex h-9 items-center px-3.5 sm:px-4 rounded-full border-2 border-slate-300 bg-white text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-sky-300 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenGoogleLogin('signup')}
                className="flex h-9 items-center px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 text-xs font-black text-slate-900 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden flex items-center justify-around border-t-2 border-slate-200 bg-white/95 px-2 py-2 text-[11px] font-bold text-slate-600 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'feed' ? 'text-sky-700 font-extrabold bg-sky-50' : 'hover:text-slate-900'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Feed</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('streak')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'streak' ? 'text-amber-700 font-extrabold bg-amber-50' : 'hover:text-slate-900'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Streak</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              onOpenGoogleLogin('signup');
            } else {
              setActiveTab('studio');
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'studio' ? 'text-emerald-700 font-extrabold bg-emerald-50' : 'hover:text-slate-900'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>Post</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'reviews' ? 'text-rose-700 font-extrabold bg-rose-50' : 'hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Reviews</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              onOpenGoogleLogin('login');
            } else {
              setActiveTab('messages');
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'messages' ? 'text-sky-700 font-extrabold bg-sky-50' : 'hover:text-slate-900'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat</span>
        </button>
      </div>
    </header>
  );
};
