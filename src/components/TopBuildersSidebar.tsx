import React from 'react';
import { User } from '../types';
import {
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Flame,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { getUnlockedBadgesForUser, getTierBadgeStyle } from '../utils/badgeSystem';

interface TopBuildersSidebarProps {
  users: User[];
  currentUser?: User | null;
  followingUserIds?: Set<string>;
  onToggleFollow?: (userId: string) => void;
  onOpenProfile: (user: User) => void;
  onOpenLogin?: () => void;
}

export const TopBuildersSidebar: React.FC<TopBuildersSidebarProps> = ({
  users,
  currentUser = null,
  followingUserIds = new Set(),
  onToggleFollow,
  onOpenProfile,
  onOpenLogin,
}) => {
  // Sort users by reputationScore descending. Real users only!
  const sortedBuilders = [...users]
    .filter((u) => Boolean(u && u.id && u.displayName))
    .sort((a, b) => (b.reputationScore || 0) - (a.reputationScore || 0));

  // Determine top badge representation
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20">
            1
          </div>
        );
      case 2:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-extrabold text-xs shadow-md shadow-slate-400/20">
            2
          </div>
        );
      case 3:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-orange-800 text-white font-extrabold text-xs shadow-md shadow-orange-700/20">
            3
          </div>
        );
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono font-bold text-[11px]">
            {rank}
          </div>
        );
    }
  };

  return (
    <aside className="space-y-4">
      {/* Top Builders Card */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-4 sm:p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-amber-500/5 blur-2xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 h-24 w-24 bg-indigo-500/5 blur-2xl pointer-events-none rounded-full" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Top Builders</span>
                <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-amber-300">
                  LEADERBOARD
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Ranked by peer reputation & verified builds</p>
            </div>
          </div>
        </div>

        {/* Builders List */}
        <div className="space-y-2.5 relative z-10">
          {sortedBuilders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-5 text-center space-y-2">
              <Sparkles className="h-5 w-5 text-indigo-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-200">Leaderboard is Open</p>
              <p className="text-[11px] text-slate-400 leading-snug">
                Publish a verified build or write a rubric review to take the #1 spot!
              </p>
              {!currentUser && onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="mt-2 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  <span>Sign Up / Log In</span>
                </button>
              )}
            </div>
          ) : (
            sortedBuilders.slice(0, 7).map((builder, index) => {
              const rank = index + 1;
              const isCurrentUser = currentUser?.id === builder.id;
              const isFollowing = followingUserIds.has(builder.id);
              const unlockedBadges = getUnlockedBadgesForUser(builder);
              const topBadge = unlockedBadges[unlockedBadges.length - 1]; // highest milestone

              return (
                <div
                  key={builder.id}
                  className={`group relative flex items-center justify-between gap-3 rounded-xl border p-2.5 transition-all cursor-pointer ${
                    isCurrentUser
                      ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400 hover:bg-indigo-950/30'
                      : rank === 1
                      ? 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 hover:border-amber-400/50'
                      : 'border-slate-800/80 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                  onClick={() => onOpenProfile(builder)}
                >
                  {/* Left: Rank & Avatar & Details */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Rank Number/Medal */}
                    <div className="flex-shrink-0">{getRankBadge(rank)}</div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {builder.avatarUrl ? (
                        <img
                          src={builder.avatarUrl}
                          alt={builder.displayName}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-full object-cover border border-slate-700 group-hover:border-indigo-400 transition-colors"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-xs font-bold text-white border border-slate-700">
                          {builder.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {builder.reputationScore >= 50 && (
                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-slate-900 p-0.5">
                          <VerifiedBadge reputationScore={builder.reputationScore} size="xs" />
                        </div>
                      )}
                    </div>

                    {/* Name, Handle, Top Badge */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 leading-snug">
                        <span className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {builder.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded bg-indigo-500/20 border border-indigo-500/40 px-1 py-0.2 text-[8px] font-mono font-bold text-indigo-300">
                            YOU
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          @{builder.handle}
                        </span>
                        {topBadge && (
                          <span className="hidden sm:inline-flex items-center gap-0.5 rounded bg-slate-800/90 border border-slate-700/80 px-1.5 py-0.2 text-[9px] font-mono text-amber-300">
                            <Star className="h-2 w-2 fill-amber-400/40" />
                            <span className="truncate max-w-[80px]">{topBadge.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Reputation & Action */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
                        <Flame className="h-3 w-3 text-amber-400 fill-amber-400/30" />
                        <span>{builder.reputationScore || 0}</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 text-right pr-0.5">
                        Rep
                      </div>
                    </div>

                    {/* Follow button if not current user and logged in */}
                    {currentUser && !isCurrentUser && onToggleFollow && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFollow(builder.id);
                        }}
                        title={isFollowing ? 'Unfollow' : 'Follow'}
                        className={`p-1.5 rounded-lg border transition-all text-xs ${
                          isFollowing
                            ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {isFollowing ? (
                          <UserCheck className="h-3.5 w-3.5" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}

                    <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View all builders / info footer */}
        {sortedBuilders.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Real human makers</span>
            </span>
            <span className="font-mono text-indigo-400">
              {sortedBuilders.length} {sortedBuilders.length === 1 ? 'builder' : 'builders'} total
            </span>
          </div>
        )}
      </div>

      {/* Gamified Reputation & Rubric Rules Helper Card */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
          <span>How Reputation is Earned</span>
        </div>
        <ul className="space-y-1.5 text-[11px] text-slate-400 leading-snug">
          <li className="flex items-start gap-1.5">
            <span className="text-emerald-400 font-mono font-bold">+15 Rep</span>
            <span>Publish a verified build with working prototype photos or code.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-indigo-400 font-mono font-bold">+5 Rep</span>
            <span>Write a detailed 4-part rubric review (Clarity, Execution, Technicality).</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-amber-400 font-mono font-bold">Badges</span>
            <span>Unlock 'Pro Builder', 'Top Reviewer', and milestone perks automatically.</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};
