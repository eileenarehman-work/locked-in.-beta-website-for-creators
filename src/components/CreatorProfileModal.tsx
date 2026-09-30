import React, { useState, useEffect } from 'react';
import { User, Project, Review, Badge } from '../types';
import {
  X,
  UserPlus,
  UserCheck,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  Heart,
  Eye,
  Settings,
  ExternalLink,
  Trophy,
  Star,
  Hammer,
  Flame,
  Award,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Zap,
  Check,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VerifiedBadge, VERIFIED_REPUTATION_THRESHOLD } from './VerifiedBadge';
import {
  getAllMilestoneBadgesWithStatus,
  getUnlockedBadgesForUser,
  getNextMilestoneBadge,
  getTierBadgeStyle,
} from '../utils/badgeSystem';

interface CreatorProfileModalProps {
  profileUser: User;
  currentUser: User | null;
  projects: Project[];
  reviews: Review[];
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  onToggleFollow: (userId: string) => void;
  onOpenMessage: (user: User) => void;
  onOpenProject: (project: Project) => void;
  onEditOwnProfile: () => void;
  onClose: () => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  profileUser,
  currentUser,
  projects,
  reviews,
  isFollowing,
  followerCount,
  followingCount,
  onToggleFollow,
  onOpenMessage,
  onOpenProject,
  onEditOwnProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'builds' | 'badges' | 'reviews'>('builds');
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);

  // Easy exit with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const userProjects = projects.filter((p) => p.authorId === profileUser.id);
  const userReviews = reviews.filter((r) => r.reviewerId === profileUser.id);
  const isSelf = currentUser?.id === profileUser.id;

  // Gamified Badges resolution
  const milestoneBadges = getAllMilestoneBadgesWithStatus(profileUser.reputationScore, profileUser.badges);
  const unlockedBadges = milestoneBadges.filter((b) => b.isUnlocked);
  const nextMilestone = getNextMilestoneBadge(profileUser.reputationScore);

  const renderBadgeIcon = (iconName: string, className = 'h-4 w-4') => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className={className} />;
      case 'star':
        return <Star className={className} />;
      case 'hammer':
        return <Hammer className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'shield-check':
        return <ShieldCheck className={className} />;
      case 'zap':
        return <Zap className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden relative cursor-default"
      >
        {/* Cover Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-indigo-950 via-indigo-800 to-emerald-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]" />
          <button
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close profile modal (Esc)"
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-white/90 hover:text-white hover:bg-slate-950 transition-all border border-white/10 shadow-lg z-10"
          >
            <X className="h-4 w-4" />
            <span className="text-[10px] font-mono text-slate-300">Esc</span>
          </button>
        </div>

        {/* Profile Info Header */}
        <div className="px-6 sm:px-8 pb-6 relative">
          {/* Avatar & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="relative">
              <img
                src={profileUser.avatarUrl}
                alt={profileUser.displayName}
                referrerPolicy="no-referrer"
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-slate-900 bg-slate-950 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isSelf ? (
                <button
                  onClick={() => {
                    onClose();
                    onEditOwnProfile();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  <Settings className="h-4 w-4 text-indigo-400" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMessage(profileUser);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-amber-400" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => onToggleFollow(profileUser.id)}
                    onMouseEnter={() => setIsHoveringFollow(true)}
                    onMouseLeave={() => setIsHoveringFollow(false)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      isFollowing
                        ? isHoveringFollow
                          ? 'border border-rose-600/40 bg-rose-600/20 text-rose-300'
                          : 'border border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500'
                    }`}
                  >
                    {isFollowing ? (
                      isHoveringFollow ? (
                        <>
                          <X className="h-4 w-4" />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                          <span>Following</span>
                        </>
                      )
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Names & Gamified Badges */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl flex items-center gap-2">
                  <span>{profileUser.displayName}</span>
                  <VerifiedBadge
                    size="md"
                    showText
                    reputationScore={profileUser.reputationScore}
                  />
                </h2>
                <span className="rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono font-medium text-indigo-300">
                  {profileUser.age} yrs
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-indigo-400">@{profileUser.handle}</span>
                {profileUser.reputationScore >= VERIFIED_REPUTATION_THRESHOLD && (
                  <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1 font-medium">
                    • Verified Peer Reviewer
                  </span>
                )}
              </div>
            </div>

            {/* Unlocked Badges Showcase Chips */}
            {unlockedBadges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {unlockedBadges.map((badge) => {
                  const style = getTierBadgeStyle(badge.tier);
                  return (
                    <button
                      key={badge.id}
                      onClick={() => setActiveTab('badges')}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all hover:scale-105 ${style.pillBg}`}
                      title={`${badge.name}: ${badge.description}`}
                    >
                      <span className="flex-shrink-0">{renderBadgeIcon(badge.iconName, 'h-3.5 w-3.5')}</span>
                      <span>{badge.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {profileUser.bio && (
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {profileUser.bio}
              </p>
            )}

            {/* Custom Creator Hashtags */}
            {profileUser.interestTags && profileUser.interestTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {profileUser.interestTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}

            {/* Next Badge Milestone Progression Card */}
            {nextMilestone ? (
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {renderBadgeIcon(nextMilestone.badge.iconName, 'h-3.5 w-3.5')}
                    </span>
                    <div>
                      <span className="font-semibold text-white">Next Milestone: {nextMilestone.badge.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 ml-1.5">({nextMilestone.badge.minReputationScore} Rep required)</span>
                    </div>
                  </div>
                  <span className="font-mono text-indigo-300 font-semibold tabular-nums text-[11px]">
                    {profileUser.reputationScore} / {nextMilestone.badge.minReputationScore} Rep
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(6, nextMilestone.progressPercent))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Earn +25 Rep per peer review & +30 Rep per published build</span>
                  <span className="text-emerald-400 font-medium font-mono">
                    {nextMilestone.remaining} Rep to unlock
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-slate-950 p-3.5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex-shrink-0">
                  <Star className="h-5 w-5 fill-amber-400/40 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                    Master Tier Reached
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                    All core maker milestone badges unlocked ({profileUser.reputationScore} reputation points). A legendary leader of the platform.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Creator Stats Counters */}
          <div className="grid grid-cols-4 gap-2 border-y border-slate-800/80 py-3.5 mt-5">
            <div className="text-center">
              <span className="block text-base font-bold text-white tabular-nums">
                {userProjects.length}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Builds</span>
            </div>
            <div className="text-center">
              <span className="block text-base font-bold text-white tabular-nums">
                {followerCount}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-base font-bold text-white tabular-nums">
                {followingCount}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Following</span>
            </div>
            <div className="text-center">
              <span className="flex items-center justify-center gap-1 text-base font-bold text-amber-400 tabular-nums">
                <Star className="h-3.5 w-3.5 fill-amber-400/40 text-amber-400" />
                {profileUser.reputationScore}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Rep</span>
            </div>
          </div>

          {/* Navigation Tabs: Builds vs Badges vs Reviews */}
          <div className="flex items-center gap-2 border-b border-slate-800 pt-5 pb-3">
            <button
              onClick={() => setActiveTab('builds')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'builds'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Builds ({userProjects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'badges'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Badges ({unlockedBadges.length}/{milestoneBadges.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Reviews Written ({userReviews.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-4 max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {/* Tab 1: Builds with Actual Qualities That Interest the User */}
            {activeTab === 'builds' && (
              userProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500 space-y-1">
                  <Layers className="h-6 w-6 mx-auto text-slate-600 mb-2" />
                  <p>No builds published by this creator yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userProjects.map((p) => {
                    // Extract actual qualities that interest the user
                    const primaryQuality = p.qualities?.[0] || 'Working Prototype';
                    const secondaryQualities = p.qualities?.slice(1, 3) || ['Open Source CAD', 'Field Tested'];

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onOpenProject(p);
                        }}
                        className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left transition-all hover:border-indigo-500/40 hover:bg-slate-950/90 overflow-hidden"
                      >
                        {/* Build Cover Media with Actual Qualities Overlay */}
                        <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-900 mb-2.5 relative border border-slate-800/80">
                          {p.mediaUrls[0] ? (
                            <img
                              src={p.mediaUrls[0]}
                              alt={p.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/60 p-4 text-center">
                              <span className="text-xs font-semibold text-indigo-300">
                                {primaryQuality}
                              </span>
                            </div>
                          )}

                          {/* Actual Qualities Overlay Badge (top-left) */}
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/40 shadow-sm">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                              <span>{primaryQuality}</span>
                            </span>
                          </div>

                          {/* Quick Rubric / Proof indicator (top-right) */}
                          <div className="absolute top-2 right-2 z-10">
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-950/85 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-mono font-medium text-indigo-300 border border-indigo-500/30">
                              <ShieldCheck className="h-3 w-3 text-sky-400" />
                              <span>Verified Build</span>
                            </span>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {p.tagline || p.contentMarkdown.slice(0, 80)}
                        </p>

                        {/* Actual Qualities Chips */}
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {secondaryQualities.map((q, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-mono text-slate-300 border border-slate-800"
                            >
                              {q}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-2">
                          <span className="flex items-center gap-1 text-rose-400/80">
                            <Heart className="h-3 w-3" />
                            {p.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {p.viewsCount}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            )}

            {/* Tab 2: Gamified Badges Showcase */}
            {activeTab === 'badges' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <span>Badges unlock as you submit verified builds and constructive peer reviews.</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold text-[11px]">
                    {profileUser.reputationScore} Total Rep
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {milestoneBadges.map((badge) => {
                    const style = getTierBadgeStyle(badge.tier);

                    return (
                      <div
                        key={badge.id}
                        className={`rounded-2xl border p-3.5 transition-all relative overflow-hidden flex flex-col justify-between ${
                          badge.isUnlocked
                            ? `${style.border} ${style.bg} shadow-lg ${style.glow}`
                            : 'border-slate-800/80 bg-slate-950/50 opacity-70'
                        }`}
                      >
                        <div>
                          {/* Top Row: Icon + Rarity + Status */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                  badge.isUnlocked
                                    ? style.iconBg
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                {renderBadgeIcon(badge.iconName, 'h-4 w-4')}
                              </div>
                              <div>
                                <h4
                                  className={`text-xs font-bold leading-tight ${
                                    badge.isUnlocked ? 'text-white' : 'text-slate-400'
                                  }`}
                                >
                                  {badge.name}
                                </h4>
                                <span className="text-[10px] font-mono text-slate-400 capitalize">
                                  {badge.tier} Tier · {badge.rarity}
                                </span>
                              </div>
                            </div>

                            {badge.isUnlocked ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-mono font-semibold text-emerald-300">
                                <Check className="h-3 w-3" />
                                UNLOCKED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-mono text-slate-400 border border-slate-700">
                                <Lock className="h-2.5 w-2.5 text-slate-500" />
                                {badge.minReputationScore} REP
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>

                        {/* Bottom Row / Progress for locked badges */}
                        {!badge.isUnlocked && (
                          <div className="mt-3 pt-2 border-t border-slate-800/60 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span>Progress</span>
                              <span>
                                {profileUser.reputationScore} / {badge.minReputationScore} ({badge.progressPercent}%)
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${badge.progressPercent}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-indigo-300 block text-right">
                              {badge.remainingRep} Rep remaining
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Reviews Written */}
            {activeTab === 'reviews' && (
              userReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500 space-y-1">
                  <Sparkles className="h-6 w-6 mx-auto text-slate-600 mb-2" />
                  <p>No peer reviews given yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {userReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Review for Build</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs italic">
                        "{rev.feedbackText}"
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
