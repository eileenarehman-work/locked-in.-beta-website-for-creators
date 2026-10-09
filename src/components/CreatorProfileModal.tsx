import React, { useState, useEffect, useMemo } from 'react';
import { User, Project, Review, Friendship } from '../types';
import {
  X,
  UserPlus,
  UserMinus,
  UserCheck,
  MessageSquare,
  Sparkles,
  Layers,
  Heart,
  Eye,
  Settings,
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
  Clock,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { VerifiedBadge, VERIFIED_REPUTATION_THRESHOLD } from './VerifiedBadge';
import {
  getAllMilestoneBadgesWithStatus,
  getNextMilestoneBadge,
} from '../utils/badgeSystem';
import { MediaDisplay } from './MediaDisplay';

interface CreatorProfileModalProps {
  profileUser: User;
  currentUser: User | null;
  projects: Project[];
  reviews: Review[];
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  friendships?: Record<string, Friendship>;
  onToggleFollow: (userId: string) => void;
  onSendFriendRequest?: (handleOrId: string) => void;
  onUnfriend?: (friendshipId: string) => void;
  onAcceptFriendRequest?: (friendshipId: string) => void;
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
  friendships,
  onToggleFollow,
  onSendFriendRequest,
  onUnfriend,
  onAcceptFriendRequest,
  onOpenMessage,
  onOpenProject,
  onEditOwnProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'builds' | 'badges' | 'reviews'>('builds');
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [friendActionMsg, setFriendActionMsg] = useState<string | null>(null);

  // Friendship relation
  const userFriendship = useMemo(() => {
    if (!currentUser || !friendships || currentUser.id === profileUser.id) return null;
    return (
      Object.values(friendships).find(
        (f) =>
          (f.userId === currentUser.id && f.friendId === profileUser.id) ||
          (f.friendId === currentUser.id && f.userId === profileUser.id)
      ) || null
    );
  }, [currentUser, profileUser.id, friendships]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm overflow-y-auto cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-3xl border-2 border-sky-200 bg-white shadow-2xl overflow-hidden relative cursor-default text-slate-800"
      >
        {/* Cover Banner with Warm Pastel Gradient */}
        <div className="h-32 w-full bg-gradient-to-r from-sky-200 via-emerald-100 to-amber-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),transparent)]" />
          <button
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close profile modal (Esc)"
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-white transition-all border border-sky-200 shadow-md z-10 cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="text-[10px] font-mono text-slate-500">Esc</span>
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
                className="h-24 w-24 rounded-full object-cover ring-4 ring-white bg-sky-50 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isSelf ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onEditOwnProfile();
                    }}
                    className="flex items-center gap-2 rounded-full border-2 border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-900 hover:bg-sky-100 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Settings className="h-4 w-4 text-sky-600" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onEditOwnProfile();
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
                    title="Account Settings"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMessage(profileUser);
                    }}
                    className="flex items-center gap-1.5 rounded-full border-2 border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                    <span>Message</span>
                  </button>

                  {/* Friend / Unfriend Button */}
                  {currentUser && (
                    <>
                      {userFriendship?.status === 'ACCEPTED' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onUnfriend && userFriendship) {
                              onUnfriend(userFriendship.id);
                              setFriendActionMsg(`Unfriended @${profileUser.handle}`);
                              setTimeout(() => setFriendActionMsg(null), 3000);
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer shadow-2xs group"
                          title={`Unfriend @${profileUser.handle}`}
                        >
                          <UserMinus className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
                          <span>Unfriend</span>
                        </button>
                      ) : userFriendship?.status === 'PENDING' ? (
                        userFriendship.userId === currentUser.id ? (
                          <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-500 shadow-2xs">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span>Request Sent</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (onAcceptFriendRequest && userFriendship) {
                                onAcceptFriendRequest(userFriendship.id);
                                setFriendActionMsg(`Accepted friend request!`);
                                setTimeout(() => setFriendActionMsg(null), 3000);
                              }
                            }}
                            className="flex items-center gap-1.5 rounded-full bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                            <span>Accept Friend</span>
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSendFriendRequest) {
                              onSendFriendRequest(profileUser.handle);
                              setFriendActionMsg(`Friend request sent to @${profileUser.handle}!`);
                              setTimeout(() => setFriendActionMsg(null), 3000);
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-full border-2 border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors shadow-2xs cursor-pointer"
                        >
                          <UserPlus className="h-4 w-4 text-sky-600" />
                          <span>Add Friend</span>
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => onToggleFollow(profileUser.id)}
                    onMouseEnter={() => setIsHoveringFollow(true)}
                    onMouseLeave={() => setIsHoveringFollow(false)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all cursor-pointer shadow-2xs ${
                      isFollowing
                        ? isHoveringFollow
                          ? 'border border-rose-300 bg-rose-50 text-rose-700'
                          : 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 text-slate-950 hover:scale-105 active:scale-95'
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
                          <UserCheck className="h-4 w-4 text-emerald-600" />
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

          {/* Feedback alert for friend action */}
          {friendActionMsg && (
            <div className="mb-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{friendActionMsg}</span>
            </div>
          )}

          {/* User Names & Gamified Badges */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl flex items-center gap-2">
                  <span>{profileUser.displayName}</span>
                  <VerifiedBadge
                    size="md"
                    showText
                    reputationScore={profileUser.reputationScore}
                  />
                </h2>
                <span className="rounded-full bg-sky-100 border border-sky-200 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                  {profileUser.age} yrs
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono font-bold text-sky-700">@{profileUser.handle}</span>
                {profileUser.reputationScore >= VERIFIED_REPUTATION_THRESHOLD && (
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    • Verified Peer Reviewer
                  </span>
                )}
              </div>
            </div>

            {/* Unlocked Badges Showcase Chips */}
            {unlockedBadges.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {unlockedBadges.map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => setActiveTab('badges')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 transition-all hover:scale-105 shadow-2xs cursor-pointer"
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span className="text-amber-600">{renderBadgeIcon(badge.iconName, 'h-3.5 w-3.5')}</span>
                    <span>{badge.name}</span>
                  </button>
                ))}
              </div>
            )}

            {profileUser.bio && (
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xl">
                {profileUser.bio}
              </p>
            )}

            {/* Custom Creator Hashtags */}
            {profileUser.interestTags && profileUser.interestTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {profileUser.interestTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-50 border border-slate-200 px-3 py-0.5 text-xs font-bold text-slate-600"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}

            {/* Next Badge Milestone Progression Card */}
            {nextMilestone ? (
              <div className="rounded-3xl border-2 border-sky-100 bg-gradient-to-r from-sky-50 via-emerald-50 to-amber-50 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 border border-sky-200 shadow-2xs">
                      {renderBadgeIcon(nextMilestone.badge.iconName, 'h-3.5 w-3.5')}
                    </span>
                    <div>
                      <span className="font-black text-slate-900">Next Milestone: {nextMilestone.badge.name}</span>
                      <span className="text-[11px] font-medium text-slate-500 ml-1.5">({nextMilestone.badge.minReputationScore} Points)</span>
                    </div>
                  </div>
                  <span className="font-bold text-sky-800 tabular-nums text-xs">
                    {profileUser.reputationScore} / {nextMilestone.badge.minReputationScore} Points
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-white border border-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-300 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(6, nextMilestone.progressPercent))}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Earn points by reviewing creations and posting prototypes</span>
                  <span className="text-emerald-700 font-bold">
                    {nextMilestone.remaining} Points to unlock
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/70 p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 border border-amber-300 text-amber-600 flex-shrink-0 shadow-2xs">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                    Master Tier Innovator Reached
                  </span>
                  <p className="text-xs text-slate-600 font-medium leading-snug mt-0.5">
                    All badges unlocked with {profileUser.reputationScore} points! A champion of youth innovation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Creator Stats Counters */}
          <div className="grid grid-cols-4 gap-2 border-y border-sky-100 py-3.5 mt-5">
            <div className="text-center">
              <span className="block text-base font-black text-slate-900 tabular-nums">
                {userProjects.length}
              </span>
              <span className="text-[11px] font-bold text-slate-500">Builds</span>
            </div>
            <div className="text-center">
              <span className="block text-base font-black text-slate-900 tabular-nums">
                {followerCount}
              </span>
              <span className="text-[11px] font-bold text-slate-500">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-base font-black text-slate-900 tabular-nums">
                {followingCount}
              </span>
              <span className="text-[11px] font-bold text-slate-500">Following</span>
            </div>
            <div className="text-center">
              <span className="flex items-center justify-center gap-1 text-base font-black text-amber-600 tabular-nums">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                {profileUser.reputationScore}
              </span>
              <span className="text-[11px] font-bold text-slate-500">Points</span>
            </div>
          </div>

          {/* Navigation Tabs: Builds vs Badges vs Reviews */}
          <div className="flex items-center gap-2 border-b border-sky-100 pt-5 pb-3">
            <button
              onClick={() => setActiveTab('builds')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeTab === 'builds'
                  ? 'bg-sky-100 text-sky-900 border-2 border-sky-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Builds</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-600" />
              <span>Badges</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Reviews</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-4 max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {/* Tab 1: Builds */}
            {activeTab === 'builds' && (
              userProjects.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-sky-100 p-8 text-center text-xs text-slate-500 space-y-1">
                  <Layers className="h-6 w-6 mx-auto text-sky-400 mb-2" />
                  <p className="font-bold">No builds published by this creator yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userProjects.map((p) => {
                    const primaryQuality = p.qualities?.[0] || 'Working Prototype';
                    const secondaryQualities = p.qualities?.slice(1, 3) || ['Open Source CAD', 'Field Tested'];

                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onOpenProject(p);
                        }}
                        className="group flex flex-col rounded-3xl border-2 border-slate-100 bg-white p-3.5 text-left transition-all hover:border-sky-300 hover:shadow-md cursor-pointer overflow-hidden"
                      >
                        {/* Build Cover Media */}
                        <div className="h-28 w-full rounded-2xl overflow-hidden bg-slate-100 mb-2.5 relative border border-slate-200">
                          {p.mediaUrls[0] ? (
                            <MediaDisplay
                              url={p.mediaUrls[0]}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              autoPlayPreview={true}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 p-4 text-center">
                              <span className="text-xs font-black text-sky-800">
                                {primaryQuality}
                              </span>
                            </div>
                          )}

                          {/* Primary Quality Overlay Badge */}
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200 shadow-2xs">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>{primaryQuality}</span>
                            </span>
                          </div>

                          {/* Quick Rubric / Proof indicator */}
                          <div className="absolute top-2 right-2 z-10">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-sky-800 border border-sky-200 shadow-2xs">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              <span>Build</span>
                            </span>
                          </div>
                        </div>

                        <h4 className="text-xs font-black text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 font-medium">
                          {p.tagline || p.contentMarkdown.slice(0, 80)}
                        </p>

                        {/* Actual Qualities Chips */}
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {secondaryQualities.map((q, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-100"
                            >
                              {q}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-2">
                          <span className="flex items-center gap-1 text-rose-500">
                            <Heart className="h-3 w-3 fill-rose-500/20" />
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
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-600" />
                    <span>Badges unlock as you publish builds and write constructive peer reviews.</span>
                  </div>
                  <span className="font-black text-amber-800 text-xs">
                    {profileUser.reputationScore} Points
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {milestoneBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-3xl border-2 p-3.5 transition-all relative overflow-hidden flex flex-col justify-between ${
                        badge.isUnlocked
                          ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-sky-50 shadow-sm'
                          : 'border-slate-200 bg-slate-50/70 opacity-70'
                      }`}
                    >
                      <div>
                        {/* Top Row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                badge.isUnlocked
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-2xs'
                                  : 'bg-slate-200 text-slate-500 border border-slate-300'
                              }`}
                            >
                              {renderBadgeIcon(badge.iconName, 'h-4 w-4')}
                            </div>
                            <div>
                              <h4
                                className={`text-xs font-black leading-tight ${
                                  badge.isUnlocked ? 'text-slate-900' : 'text-slate-500'
                                }`}
                              >
                                {badge.name}
                              </h4>
                              <span className="text-[10px] font-bold text-slate-400 capitalize">
                                {badge.tier} Tier
                              </span>
                            </div>
                          </div>

                          {badge.isUnlocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 shadow-2xs">
                              <Check className="h-3 w-3" />
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                              <Lock className="h-2.5 w-2.5 text-slate-500" />
                              {badge.minReputationScore} PTS
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {badge.description}
                        </p>
                      </div>

                      {/* Bottom Row / Progress for locked badges */}
                      {!badge.isUnlocked && (
                        <div className="mt-3 pt-2 border-t border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>Progress</span>
                            <span>
                              {profileUser.reputationScore} / {badge.minReputationScore} ({badge.progressPercent}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white border border-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full"
                              style={{ width: `${badge.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-sky-700 block text-right">
                            {badge.remainingRep} Points remaining
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Reviews Written */}
            {activeTab === 'reviews' && (
              userReviews.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-sky-100 p-8 text-center text-xs text-slate-500 space-y-1">
                  <Sparkles className="h-6 w-6 mx-auto text-sky-400 mb-2" />
                  <p className="font-bold">No peer reviews given yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {userReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-3xl border-2 border-sky-100 bg-sky-50/40 p-4 text-xs text-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">Peer Review for Build</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs italic font-medium leading-relaxed">
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
