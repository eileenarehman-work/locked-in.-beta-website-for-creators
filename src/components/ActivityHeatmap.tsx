import React, { useState } from 'react';
import { HeatmapDay, User, Project, Review, Badge } from '../types';
import {
  ShieldCheck,
  GitCommit,
  Flame,
  Trophy,
  Star,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  TrendingUp,
  Zap,
  Hammer,
  HelpCircle,
  X,
  Plus,
} from 'lucide-react';
import { calculateRealStreak } from '../utils/streakUtils';
import {
  getAllMilestoneBadgesWithStatus,
  getNextMilestoneBadge,
  getTierBadgeStyle,
  EvaluatedBadge,
} from '../utils/badgeSystem';
import { VerifiedBadge } from './VerifiedBadge';

interface ActivityHeatmapProps {
  days: HeatmapDay[];
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
  const [activeTab, setActiveTab] = useState<'streak' | 'heatmap'>('streak');
  const [selectedBadge, setSelectedBadge] = useState<EvaluatedBadge | null>(null);

  // Calculate real active streak based on real actions (never fake numbers)
  const streakInfo = calculateRealStreak(projects, reviews, currentUser);

  // Gamified Badges for currentUser
  const userRep = currentUser?.reputationScore || 0;
  const milestoneBadges = getAllMilestoneBadgesWithStatus(userRep, currentUser?.badges);
  const unlockedBadges = milestoneBadges.filter((b) => b.isUnlocked);
  const nextMilestone = getNextMilestoneBadge(userRep);

  // Color scale corresponding to 0, 1, 2, 3, 4
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-900/60 border border-emerald-800/80';
      case 2:
        return 'bg-emerald-700/80 border border-emerald-600';
      case 3:
        return 'bg-emerald-500 border border-emerald-400';
      case 4:
        return 'bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/30';
      default:
        return 'bg-slate-900/80 border border-slate-800/90';
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
        return <Star className={`${className} fill-amber-400/40`} />;
      case 'flame':
        return <Flame className={`${className} fill-amber-400/40`} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'shield-check':
        return <ShieldCheck className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800/90 bg-slate-900/70 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 h-36 w-64 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 h-36 w-64 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header with Mode Switching Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400 fill-amber-400/40 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
              <span>Maker Streak & Proof-of-Work Journey</span>
            </h3>
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              100% Real Human Activity
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real daily proof-of-work across hardware builds, 3D prints, code commits, and peer rubric reviews.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('streak')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'streak'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Streak & Badges</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'heatmap'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCommit className="h-3.5 w-3.5 text-indigo-400" />
            <span>84-Day Map</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Engaging Gamified Streak & Badges Hub */}
      {activeTab === 'streak' && (
        <div className="space-y-6 relative z-10">
          {/* Main Streak Banner + 7-Day Rolling Flame Tracker */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-4 sm:p-5 relative overflow-hidden shadow-xl shadow-amber-950/20">
            {/* Top row: Flame hero & Streak Count */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-4">
                {/* Animated Flame Container */}
                <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 shadow-inner">
                  <Flame
                    className={`h-8 w-8 sm:h-9 sm:w-9 ${
                      streakInfo.currentStreak > 0
                        ? 'text-amber-400 fill-amber-400/50 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse'
                        : 'text-slate-500 fill-slate-700/20'
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
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                      {streakInfo.currentStreak}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-amber-400">
                      {streakInfo.currentStreak === 1 ? 'Day Maker Streak' : 'Days Maker Streak'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug max-w-md">
                    {streakInfo.currentStreak > 0
                      ? `🔥 Your flame is active! Continue building daily to hit the ${streakInfo.nextMilestone.title}.`
                      : 'No active streak yet. Publish a build or review a peer project today to ignite Day 1!'}
                  </p>
                </div>
              </div>

              {/* Next Milestone Progress Pill */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 min-w-[220px]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span className="text-slate-200 font-semibold truncate">
                    Goal: {streakInfo.nextMilestone.title}
                  </span>
                  <span className="text-amber-300 font-bold">
                    {streakInfo.currentStreak} / {streakInfo.nextMilestone.days}d
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(8, Math.round((streakInfo.currentStreak / streakInfo.nextMilestone.days) * 100))
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                  {streakInfo.nextMilestone.description}
                </p>
              </div>
            </div>

            {/* 7-Day Rolling Flame Tracker */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  Past 7-Day Streak Cadence
                </span>
                <span className="text-[11px] text-amber-300">
                  {streakInfo.isActiveToday ? '✓ Completed Today' : '⏳ Action Needed Today'}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {streakInfo.pastWeek.map((dayItem) => (
                  <div
                    key={dayItem.date}
                    className={`rounded-xl border p-2 flex flex-col items-center justify-center transition-all ${
                      dayItem.hasActivity
                        ? 'border-amber-500/40 bg-amber-500/15 shadow-sm shadow-amber-500/10'
                        : dayItem.isToday
                        ? 'border-indigo-500/50 bg-indigo-950/30'
                        : 'border-slate-800 bg-slate-950/50 opacity-60'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                      {dayItem.fullDayName}
                    </span>

                    <div className="my-1">
                      {dayItem.hasActivity ? (
                        <Flame className="h-5 w-5 text-amber-400 fill-amber-400/40 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                      ) : (
                        <div
                          className={`h-4 w-4 rounded-full border border-dashed ${
                            dayItem.isToday ? 'border-amber-400/80 bg-amber-400/10' : 'border-slate-700'
                          }`}
                        />
                      )}
                    </div>

                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      {dayItem.isToday ? 'Today' : dayItem.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gamified Badges Shelf with Direct Milestone Progress */}
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 p-4 sm:p-5 space-y-4 shadow-xl shadow-indigo-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>Maker Reputation Badges</span>
                    <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-300">
                      {unlockedBadges.length} / {milestoneBadges.length} UNLOCKED
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Earned automatically through community reputation milestones & rubric reviews
                  </p>
                </div>
              </div>

              {/* User Rep Points Status */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-950/80 border border-slate-800 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-mono text-slate-300">
                  Current Rep: <strong className="text-amber-300">{userRep}</strong>
                </span>
              </div>
            </div>

            {/* Badges Grid (Interactive: Click to inspect) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {milestoneBadges.map((badge) => {
                const style = getTierBadgeStyle(badge.tier);

                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => setSelectedBadge(badge)}
                    className={`group relative rounded-xl border p-3 flex flex-col items-center text-center transition-all text-left ${
                      badge.isUnlocked
                        ? `${style.border} ${style.bg} shadow-md shadow-indigo-950/20 hover:scale-[1.02]`
                        : 'border-slate-800 bg-slate-950/50 opacity-60 hover:opacity-90 hover:border-slate-700'
                    }`}
                  >
                    {/* Badge Icon Container */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 transition-transform group-hover:scale-110 ${
                        badge.isUnlocked
                          ? style.iconBg
                          : 'bg-slate-800/80 text-slate-600 border border-slate-700'
                      }`}
                    >
                      {renderBadgeIcon(badge.iconName, badge.isUnlocked)}
                    </div>

                    {/* Badge Name */}
                    <span
                      className={`text-xs font-bold leading-tight line-clamp-1 ${
                        badge.isUnlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {badge.name}
                    </span>

                    {/* Tier & Rep requirement */}
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-mono">
                      <span className="capitalize text-slate-400">{badge.tier}</span>
                      <span>·</span>
                      <span className={badge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {badge.isUnlocked ? 'Earned' : `${badge.minReputationScore} Rep`}
                      </span>
                    </div>

                    {/* Progress bar if locked */}
                    {!badge.isUnlocked && (
                      <div className="mt-2 w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500/80 rounded-full"
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
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/30" />
                    Next Badge in Reach: <span className="text-white">{nextMilestone.badge.name}</span>
                  </span>
                  <span className="text-indigo-300 font-bold">
                    Need {nextMilestone.remaining} more Rep points
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(8, nextMilestone.progressPercent))}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {nextMilestone.badge.description}
                </p>
              </div>
            )}
          </div>

          {/* Daily Proof-of-Work Quests / Actionable Rep Boosters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Quest 1: Drop a Build */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Hammer className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    +15 REP
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white">Publish Hands-on Build</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Share your latest hardware, robotics, 3D print, code, or art project.
                </p>
              </div>

              {onOpenNewBuild && (
                <button
                  type="button"
                  onClick={onOpenNewBuild}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Drop Build</span>
                </button>
              )}
            </div>

            {/* Quest 2: Peer Rubric Review */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-md">
                    +5 REP
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white">Rubric Peer Evaluation</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Evaluate a fellow creator's project on Clarity, Execution, and Technicality.
                </p>
              </div>

              <div className="mt-3 text-[11px] font-mono text-slate-400 text-center py-1">
                Open any project card below to review
              </div>
            </div>

            {/* Quest 3: Verified Creator Status */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    50 REP MILESTONE
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white">Verified Creator Seal</h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Unlock the verified checkmark and stand out in the Top Builders leaderboard.
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                <span>Trust Tier:</span>
                <span className="font-semibold text-emerald-400">
                  {currentUser?.trustTier || 'VERIFIED_HUMAN'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Accurate 84-Day Telemetry Grid */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>84-Day Activity Telemetry</span>
            <span className="text-emerald-400">
              {totalContributions} total verified builds & rubric reviews
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.count} verified builds / reviews`}
                  className={`h-3.5 w-3.5 rounded-sm transition-all hover:scale-125 cursor-pointer ${getLevelColor(
                    day.level
                  )}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Real daily proof-of-work contributions</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-900 border border-slate-800" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-900/60 border border-emerald-800" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-700/80 border border-emerald-600" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 border border-emerald-400" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400 border border-emerald-300" />
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {/* Badge Inspect Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  selectedBadge.isUnlocked
                    ? getTierBadgeStyle(selectedBadge.tier).iconBg
                    : 'bg-slate-800 text-slate-600 border border-slate-700'
                }`}
              >
                {renderBadgeIcon(selectedBadge.iconName, selectedBadge.isUnlocked, 'h-6 w-6')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedBadge.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] font-mono mt-0.5">
                  <span className="capitalize text-indigo-400 font-semibold">{selectedBadge.tier} Tier</span>
                  <span>·</span>
                  <span className="text-slate-400">{selectedBadge.rarity || 'Common'}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Unlock Threshold:</span>
                <span className="text-white font-bold">{selectedBadge.minReputationScore} Rep</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Your Reputation:</span>
                <span className="text-amber-300 font-bold">{userRep} Rep</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Status:</span>
                <span className={selectedBadge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {selectedBadge.isUnlocked ? '✓ Unlocked & Displayed on Profile' : `Locked (${selectedBadge.remainingRep} Rep needed)`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
