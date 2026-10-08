import React from 'react';
import { User } from '../types';
import {
  Trophy,
  Sparkles,
  UserCheck,
  UserPlus,
  Star,
  ChevronRight,
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { getUnlockedBadgesForUser } from '../utils/badgeSystem';
import { Mascot } from './Mascot';

interface TopBuildersSidebarProps {
  users: User[];
  currentUser?: User | null;
  followingUserIds?: Set<string>;
  onToggleFollow?: (userId: string) => void;
  onOpenProfile: (user: User) => void;
  onOpenLogin?: () => void;
  onOpenPointsGuide?: () => void;
}

export const TopBuildersSidebar: React.FC<TopBuildersSidebarProps> = ({
  users,
  currentUser = null,
  followingUserIds = new Set(),
  onToggleFollow,
  onOpenProfile,
  onOpenLogin,
  onOpenPointsGuide,
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
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 font-black text-xs shadow-2xs">
            1
          </div>
        );
      case 2:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-black text-xs shadow-2xs">
            2
          </div>
        );
      case 3:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black text-xs shadow-2xs">
            3
          </div>
        );
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold text-[11px]">
            {rank}
          </div>
        );
    }
  };

  return (
    <aside className="space-y-4">
      {/* Top Builders Card */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-4 sm:p-5 shadow-xs relative overflow-hidden text-slate-800">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-600 shadow-2xs">
              <Mascot type="earth" size="xs" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Top Builders</span>
              </h2>
              <p className="text-[11px] text-slate-500">Ranked by community contributions</p>
            </div>
          </div>

          {onOpenPointsGuide && (
            <button
              type="button"
              onClick={onOpenPointsGuide}
              className="text-[11px] font-mono text-amber-600 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer font-bold"
              title="Learn how points are calculated"
            >
              <Star className="h-3 w-3 fill-amber-400" />
              <span className="hidden sm:inline">How Points Work</span>
              <span className="sm:hidden">Points</span>
            </button>
          )}
        </div>

        {/* Builders List */}
        <div className="space-y-2.5 relative z-10">
          {sortedBuilders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-5 text-center space-y-2">
              <Sparkles className="h-5 w-5 text-sky-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Leaderboard is Open</p>
              <p className="text-[11px] text-slate-500 leading-snug">
                Publish a build or write a review to take the #1 spot!
              </p>
              {!currentUser && onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-xs"
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
              const topBadge = unlockedBadges[unlockedBadges.length - 1];

              return (
                <div
                  key={builder.id}
                  className={`group relative flex items-center justify-between gap-3 rounded-2xl border-2 p-2.5 transition-all cursor-pointer ${
                    isCurrentUser
                      ? 'border-sky-300 bg-sky-50/60 hover:bg-sky-50'
                      : rank === 1
                      ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
                      : 'border-slate-100 bg-slate-50/60 hover:border-sky-200 hover:bg-white'
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
                          className="h-9 w-9 rounded-full object-cover border-2 border-slate-200 group-hover:border-sky-400 transition-colors"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 text-xs font-bold text-slate-950 border border-slate-200">
                          {builder.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {builder.reputationScore >= 50 && (
                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5 shadow-2xs">
                          <VerifiedBadge reputationScore={builder.reputationScore} size="xs" />
                        </div>
                      )}
                    </div>

                    {/* Name, Handle, Top Badge */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 leading-snug">
                        <span className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-700 transition-colors">
                          {builder.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="rounded-full bg-sky-100 border border-sky-300 px-1.5 py-0.2 text-[8px] font-mono font-bold text-sky-800">
                            YOU
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-500 truncate">
                          @{builder.handle}
                        </span>
                        {topBadge && (
                          <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[9px] font-mono text-amber-800 font-semibold">
                            <Star className="h-2 w-2 fill-amber-400" />
                            <span className="truncate max-w-[80px]">{topBadge.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Points & Action */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-mono font-bold text-amber-800">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                        <span>{builder.reputationScore || 0}</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 text-right pr-0.5 font-bold">
                        Points
                      </div>
                    </div>

                    {/* Follow button */}
                    {currentUser && !isCurrentUser && onToggleFollow && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFollow(builder.id);
                        }}
                        title={isFollowing ? 'Unfollow' : 'Follow'}
                        className={`p-1.5 rounded-full border-2 transition-all text-xs ${
                          isFollowing
                            ? 'border-sky-300 bg-sky-100 text-sky-800 hover:bg-red-50 hover:border-red-300 hover:text-red-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-800'
                        }`}
                      >
                        {isFollowing ? (
                          <UserCheck className="h-3.5 w-3.5" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}

                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View all builders / info footer */}
        {sortedBuilders.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Community Leaderboard</span>
            <span className="font-mono text-sky-700 font-bold">
              {sortedBuilders.length} {sortedBuilders.length === 1 ? 'builder' : 'builders'}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
