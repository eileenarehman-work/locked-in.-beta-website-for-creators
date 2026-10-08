import React, { useState } from 'react';
import { User, Project, Review } from '../types';
import {
  Flame,
  Award,
  Calendar,
  Zap,
  Sparkles,
  Trophy,
  Star,
  ShieldCheck,
  Hammer,
  Plus,
  Lock,
  CheckCircle2,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  getAllMilestoneBadgesWithStatus,
  getNextMilestoneBadge,
  getTierBadgeStyle,
} from '../utils/badgeSystem';
import { PointsGuideModal } from './PointsGuideModal';
import { calculateStreakInfo } from '../utils/streakUtils';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ActivityHeatmapProps {
  days: ContributionDay[];
  totalContributions: number;
  currentUser?: User | null;
  projects?: Project[];
  reviews?: Review[];
  onOpenNewBuild?: () => void;
  onOpenProfile?: (user: User) => void;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  days,
  totalContributions,
  currentUser = null,
  projects = [],
  reviews = [],
  onOpenNewBuild,
  onOpenProfile,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [isPointsGuideOpen, setIsPointsGuideOpen] = useState(false);

  const streakInfo = calculateStreakInfo(currentUser, projects, reviews);
  const userRep = currentUser?.reputationScore || 0;
  const milestoneBadges = getAllMilestoneBadgesWithStatus(userRep);
  const unlockedBadges = milestoneBadges.filter((b) => b.isUnlocked);
  const nextMilestone = getNextMilestoneBadge(userRep);

  // Pastel Color scale for activity
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-100 border border-emerald-300';
      case 2:
        return 'bg-emerald-200 border border-emerald-400';
      case 3:
        return 'bg-emerald-300 border border-emerald-500';
      case 4:
        return 'bg-emerald-400 border border-emerald-500 shadow-2xs';
      default:
        return 'bg-slate-100 border border-slate-200';
    }
  };

  // Render badge icon by name
  const renderBadgeIcon = (iconName: string, isUnlocked: boolean, className: string = 'h-5 w-5') => {
    if (!isUnlocked) return <Lock className={className} />;
    switch (iconName) {
      case 'hammer':
        return <Hammer className={className} />;
      case 'trophy':
        return <Trophy className={className} />;
      case 'star':
        return <Star className={`${className} fill-amber-400 text-amber-500`} />;
      case 'flame':
        return <Flame className={`${className} fill-amber-400 text-amber-500`} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'shield-check':
        return <ShieldCheck className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="rounded-3xl border-2 border-amber-200/80 bg-white p-5 sm:p-6 shadow-xs relative overflow-hidden text-slate-800">
      {/* Background ambient pastel glow */}
      <div className="absolute top-0 right-1/4 h-36 w-64 bg-amber-100/50 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 h-36 w-64 bg-sky-100/50 blur-3xl pointer-events-none rounded-full" />

      {/* Header - Streak & Gamified Points Hub */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-4 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500 fill-amber-400" />
              <span>Daily Streak Hub</span>
            </h3>
            <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Streak Active</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Log in every day to keep your flame alive, earn bonus points, and unlock badges!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-mono font-black text-amber-900 shadow-2xs">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{streakInfo.currentStreak > 0 ? streakInfo.currentStreak : 1} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Gamified Streak & Badges Hub */}
      <div className="space-y-6 relative z-10">
        {/* Main Streak Banner + 7-Day Rolling Flame Tracker */}
        <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-5 relative overflow-hidden shadow-2xs">
          {/* Top row: Flame hero & Streak Count */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-4 border-b-2 border-amber-100">
            <div className="flex items-center gap-4">
              {/* Animated Flame Container */}
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200 border-2 border-amber-300 shadow-inner">
                <Flame
                  className={`h-8 w-8 sm:h-9 sm:w-9 ${
                    streakInfo.currentStreak > 0
                      ? 'text-amber-600 fill-amber-500 drop-shadow-sm'
                      : 'text-slate-400 fill-slate-300'
                  }`}
                />
                {streakInfo.isActiveToday && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums tracking-tight">
                    {streakInfo.currentStreak}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wider text-amber-800">
                    {streakInfo.currentStreak === 1 ? 'Day Maker Streak' : 'Days Maker Streak'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug max-w-md font-medium">
                  {streakInfo.currentStreak > 0
                    ? `Your streak is active! Earn points every day you check in and level up your creator rank.`
                    : 'No active streak yet. Log in daily or publish a build to start Day 1!'}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-3 py-0.5 text-[11px] font-mono font-bold text-amber-900">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    Today's Bonus: +{streakInfo.todayBonus} Pts
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[11px] font-mono text-slate-600 font-semibold">
                    Tomorrow: +{streakInfo.nextDayBonus} Pts
                  </span>
                </div>
              </div>
            </div>

            {/* Next Milestone Progress Pill */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-3.5 min-w-[220px] shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5 font-bold">
                <span className="text-slate-800 truncate">
                  Goal: {streakInfo.nextMilestone.title}
                </span>
                <span className="text-amber-800">
                  {streakInfo.currentStreak} / {streakInfo.nextMilestone.days}d
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(8, Math.round((streakInfo.currentStreak / streakInfo.nextMilestone.days) * 100))
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
                {streakInfo.nextMilestone.description}
              </p>
            </div>
          </div>

          {/* 7-Day Rolling Flame Tracker */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                Past 7-Day Streak Cadence
              </span>
              <span className="text-[11px] font-bold text-amber-800">
                {streakInfo.isActiveToday ? '✓ Completed Today' : '⏳ Action Needed Today'}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {streakInfo.pastWeek.map((dayItem) => (
                <div
                  key={dayItem.date}
                  className={`rounded-2xl border-2 p-2 flex flex-col items-center justify-center transition-all ${
                    dayItem.hasActivity
                      ? 'border-amber-300 bg-amber-100/70 shadow-2xs'
                      : dayItem.isToday
                      ? 'border-sky-300 bg-sky-50'
                      : 'border-slate-200 bg-white opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase text-slate-600 font-bold mb-1">
                    {dayItem.fullDayName}
                  </span>

                  <div className="my-1">
                    {dayItem.hasActivity ? (
                      <Flame className="h-5 w-5 text-amber-500 fill-amber-400 drop-shadow-2xs" />
                    ) : (
                      <div
                        className={`h-4 w-4 rounded-full border-2 border-dashed ${
                          dayItem.isToday ? 'border-amber-400 bg-amber-50' : 'border-slate-300'
                        }`}
                      />
                    )}
                  </div>

                  <span className="text-[9px] font-mono text-slate-500 mt-1 font-semibold">
                    {dayItem.isToday ? 'Today' : dayItem.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gamified Badges Shelf with Direct Milestone Progress */}
        <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/50 via-white to-emerald-50/40 p-5 space-y-4 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 border border-sky-300 text-sky-700 shadow-2xs">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Maker Points Badges</span>
                  <span className="rounded-full bg-sky-100 border border-sky-300 px-2 py-0.5 text-[9px] font-mono font-bold text-sky-800">
                    {unlockedBadges.length} / {milestoneBadges.length} UNLOCKED
                  </span>
                </h4>
              </div>
            </div>

            {/* User Rep Points Status with Clickable Guide */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPointsGuideOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-white border-2 border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Click for more info about points!"
              >
                <HelpCircle className="h-3.5 w-3.5 text-sky-600" />
                <span>How Points Work</span>
              </button>

              <div className="flex items-center gap-2 rounded-full bg-amber-50 border-2 border-amber-200 px-3.5 py-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                <span className="text-xs font-mono text-slate-700 font-bold">
                  Points: <strong className="text-amber-800">{userRep}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Badges Grid (Interactive: Click to inspect) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {milestoneBadges.map((badge) => {
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setSelectedBadge(badge)}
                  className={`group relative rounded-2xl border-2 p-3 flex flex-col items-center text-center transition-all cursor-pointer ${
                    badge.isUnlocked
                      ? 'border-amber-300 bg-amber-50/70 shadow-2xs hover:scale-105 active:scale-95'
                      : 'border-slate-200 bg-white opacity-70 hover:opacity-100 hover:border-sky-300'
                  }`}
                >
                  {/* Badge Icon Container */}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl mb-2 transition-transform group-hover:scale-110 ${
                      badge.isUnlocked
                        ? 'bg-amber-100 border border-amber-300 text-amber-700 shadow-2xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {renderBadgeIcon(badge.iconName, badge.isUnlocked)}
                  </div>

                  {/* Badge Name */}
                  <span
                    className={`text-xs font-bold leading-tight line-clamp-1 ${
                      badge.isUnlocked ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {badge.name}
                  </span>

                  {/* Tier & Rep requirement */}
                  <div className="mt-1 flex items-center gap-1 text-[9px] font-mono font-medium">
                    <span className="capitalize text-slate-500">{badge.tier}</span>
                    <span>·</span>
                    <span className={badge.isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {badge.isUnlocked ? 'Earned' : `${badge.minReputationScore} Pts`}
                    </span>
                  </div>

                  {/* Progress bar if locked */}
                  {!badge.isUnlocked && (
                    <div className="mt-2 w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-400 rounded-full"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Badge Progression Bar */}
          {nextMilestone && (
            <div className="rounded-2xl border-2 border-sky-200 bg-white p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                  Next Badge in Reach: <span className="text-slate-900 font-extrabold">{nextMilestone.badge.name}</span>
                </span>
                <span className="text-sky-800 font-bold">
                  Need {nextMilestone.remaining} more Points
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(8, nextMilestone.progressPercent))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug font-medium">
                {nextMilestone.badge.description}
              </p>
            </div>
          )}
        </div>

        {/* Daily Proof-of-Work Quests / Actionable Rep Boosters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h5 className="text-xs font-mono uppercase text-slate-600 font-bold flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Earn Points & Fuel Your Daily Streak</span>
            </h5>
            <button
              type="button"
              onClick={() => setIsPointsGuideOpen(true)}
              className="text-[11px] font-mono text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
            >
              View Points Guide →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Booster 1: Daily Login */}
            <div className="rounded-3xl border-2 border-amber-200 bg-white p-4 flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600">
                    <Flame className="h-4 w-4 fill-amber-400 text-amber-500" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    +10 PTS / DAY
                  </span>
                </div>
                <h5 className="text-xs font-black text-slate-900">Daily Login Streak</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug font-normal">
                  Log in every day to keep your flame alive and earn 10 points daily.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                <span>Today:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active ({streakInfo.currentStreak}d streak)
                </span>
              </div>
            </div>

            {/* Booster 2: Daily Community Review Bonus */}
            <div className="rounded-3xl border-2 border-emerald-200 bg-white p-4 flex flex-col justify-between shadow-2xs hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                    +15 BONUS / DAY
                  </span>
                </div>
                <h5 className="text-xs font-black text-slate-900">Daily Review Bonus</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug font-normal">
                  Complete your 1st community review each day to earn +15 bonus points!
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                <span>Mission:</span>
                <span className="font-bold text-sky-800">
                  +25 pts + 15 bonus
                </span>
              </div>
            </div>

            {/* Booster 3: Drop a Build */}
            <div className="rounded-3xl border-2 border-sky-200 bg-white p-4 flex flex-col justify-between shadow-2xs hover:border-sky-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-100 border border-sky-300 text-sky-700">
                    <Hammer className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 border border-sky-300 px-2.5 py-0.5 rounded-full">
                    +30 PTS
                  </span>
                </div>
                <h5 className="text-xs font-black text-slate-900">Publish Build</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug font-normal">
                  Drop your latest 3D print, robotics, hardware, game dev, code, or art project.
                </p>
              </div>
              {onOpenNewBuild ? (
                <button
                  type="button"
                  onClick={onOpenNewBuild}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Drop Build</span>
                </button>
              ) : (
                <div className="mt-3 text-[10px] font-mono text-slate-500 text-center py-1">
                  Share your builds in Studio
                </div>
              )}
            </div>

            {/* Booster 4: Verified Creator Status */}
            <div className="rounded-3xl border-2 border-orange-200 bg-white p-4 flex flex-col justify-between shadow-2xs hover:border-orange-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-orange-100 border border-orange-300 text-orange-700">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-orange-800 bg-orange-100 border border-orange-300 px-2.5 py-0.5 rounded-full">
                    50 PTS UNLOCK
                  </span>
                </div>
                <h5 className="text-xs font-black text-slate-900">Verified Creator Seal</h5>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug font-normal">
                  Reach 50 Points to earn the verified creator checkmark on all your projects.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                <span>Seal Status:</span>
                <span className={userRep >= 50 ? 'font-bold text-emerald-700' : 'text-slate-600 font-semibold'}>
                  {userRep >= 50 ? 'Unlocked ✓' : `${Math.max(0, 50 - userRep)} Points needed`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Inspect Modal */}
      {selectedBadge && (
        <div
          onClick={() => setSelectedBadge(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border-2 border-amber-200 bg-white p-6 shadow-2xl space-y-4 cursor-default text-slate-800"
          >
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              title="Close (Esc)"
              aria-label="Close (Esc)"
              className="absolute top-5 right-5 flex items-center gap-1 rounded-full border-2 border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <X className="h-3.5 w-3.5" />
              <span>Close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 shadow-2xs">
                {renderBadgeIcon(selectedBadge.iconName, selectedBadge.isUnlocked, 'h-7 w-7')}
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">{selectedBadge.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] font-mono mt-0.5">
                  <span className="capitalize text-sky-800 font-bold">{selectedBadge.tier} Tier</span>
                  <span>·</span>
                  <span className="text-slate-500 font-semibold">{selectedBadge.rarity || 'Common'}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {selectedBadge.description}
            </p>

            <div className="rounded-2xl bg-slate-50 border-2 border-slate-100 p-3.5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span>Unlock Threshold:</span>
                <span className="text-slate-900 font-black">{selectedBadge.minReputationScore} Points</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Your Points:</span>
                <span className="text-amber-800 font-black flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  <span>{userRep} Points</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Status:</span>
                <span className={selectedBadge.isUnlocked ? 'text-emerald-700 font-black' : 'text-amber-800 font-bold'}>
                  {selectedBadge.isUnlocked ? '✓ Unlocked' : `Locked (${selectedBadge.remainingRep} Pts needed)`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-sky-300/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              Awesome
            </button>
          </div>
        </div>
      )}

      {/* Interactive Points Guide Modal */}
      <PointsGuideModal
        isOpen={isPointsGuideOpen}
        onClose={() => setIsPointsGuideOpen(false)}
        currentUserRep={userRep}
        currentStreak={streakInfo.currentStreak}
      />
    </div>
  );
};
