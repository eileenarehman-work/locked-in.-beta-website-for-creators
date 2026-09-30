import { Badge, BadgeTier, User } from '../types';

export const REPUTATION_MILESTONE_BADGES: Badge[] = [
  {
    id: 'badge_novice_builder',
    name: 'Novice Builder',
    description: 'Published initial hands-on build and verified proof-of-work in the maker community.',
    iconName: 'hammer',
    minReputationScore: 0,
    tier: 'bronze',
    rarity: 'Common',
  },
  {
    id: 'badge_verified_pioneer',
    name: 'Verified Pioneer',
    description: 'Reached 50+ reputation threshold and unlocked the official Verified Creator seal.',
    iconName: 'shield-check',
    minReputationScore: 50,
    tier: 'silver',
    rarity: 'Uncommon',
  },
  {
    id: 'badge_pro_builder',
    name: 'Pro Builder',
    description: 'Constructed standout projects recognized for high technicality and physical execution.',
    iconName: 'trophy',
    minReputationScore: 100,
    tier: 'gold',
    rarity: 'Rare',
  },
  {
    id: 'badge_top_reviewer',
    name: 'Top Reviewer',
    description: 'Authored in-depth 4-part rubric reviews with constructive feedback for fellow creators.',
    iconName: 'star',
    minReputationScore: 150,
    tier: 'gold',
    rarity: 'Epic',
  },
  {
    id: 'badge_master_artisan',
    name: 'Master Artisan',
    description: 'Attained 250+ community reputation through consistently exceptional multidisciplinary builds.',
    iconName: 'sparkles',
    minReputationScore: 250,
    tier: 'diamond',
    rarity: 'Epic',
  },
  {
    id: 'badge_legendary_mentor',
    name: 'Legendary Mentor',
    description: 'Pillar of the maker network inspiring, guiding, and elevating creators worldwide.',
    iconName: 'flame',
    minReputationScore: 500,
    tier: 'diamond',
    rarity: 'Legendary',
  },
];

export interface EvaluatedBadge extends Badge {
  isUnlocked: boolean;
  progressPercent: number;
  remainingRep: number;
}

export function getAllMilestoneBadgesWithStatus(
  reputationScore: number,
  customBadges?: Badge[]
): EvaluatedBadge[] {
  // Start with default milestones
  const allBadges = [...REPUTATION_MILESTONE_BADGES];

  // Merge any custom user badges that aren't already included
  if (customBadges && customBadges.length > 0) {
    for (const cb of customBadges) {
      if (!allBadges.some((b) => b.id === cb.id || b.name.toLowerCase() === cb.name.toLowerCase())) {
        allBadges.push(cb);
      }
    }
  }

  // Sort by minReputationScore
  allBadges.sort((a, b) => a.minReputationScore - b.minReputationScore);

  return allBadges.map((badge) => {
    const isUnlocked = reputationScore >= badge.minReputationScore;
    const remainingRep = Math.max(0, badge.minReputationScore - reputationScore);
    const progressPercent = badge.minReputationScore === 0
      ? 100
      : Math.min(100, Math.round((reputationScore / badge.minReputationScore) * 100));

    return {
      ...badge,
      isUnlocked,
      progressPercent,
      remainingRep,
    };
  });
}

export function getUnlockedBadgesForUser(user: User): Badge[] {
  const score = user.reputationScore || 0;
  const milestones = REPUTATION_MILESTONE_BADGES.filter((b) => score >= b.minReputationScore);
  const custom = user.badges || [];

  const combined = [...milestones];
  for (const c of custom) {
    if (!combined.some((b) => b.id === c.id || b.name.toLowerCase() === c.name.toLowerCase())) {
      combined.push(c);
    }
  }
  return combined;
}

export function getNextMilestoneBadge(reputationScore: number): {
  badge: Badge;
  remaining: number;
  progressPercent: number;
} | null {
  const next = REPUTATION_MILESTONE_BADGES.find((b) => reputationScore < b.minReputationScore);
  if (!next) return null;

  const prevMilestone = [...REPUTATION_MILESTONE_BADGES]
    .reverse()
    .find((b) => b.minReputationScore <= reputationScore);
  const prevScore = prevMilestone ? prevMilestone.minReputationScore : 0;
  const range = next.minReputationScore - prevScore;
  const current = reputationScore - prevScore;
  const progressPercent = Math.min(100, Math.max(0, Math.round((current / (range || 1)) * 100)));

  return {
    badge: next,
    remaining: next.minReputationScore - reputationScore,
    progressPercent,
  };
}

export function getTierBadgeStyle(tier: BadgeTier) {
  switch (tier) {
    case 'bronze':
      return {
        border: 'border-amber-700/50 hover:border-amber-600',
        bg: 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-900/20',
        pillBg: 'bg-amber-900/30 text-amber-300 border-amber-700/40',
        iconBg: 'bg-amber-900/40 text-amber-400 border border-amber-600/40',
        glow: 'shadow-amber-950/30',
        accentText: 'text-amber-300',
      };
    case 'silver':
      return {
        border: 'border-sky-500/40 hover:border-sky-400',
        bg: 'bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-900',
        pillBg: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
        iconBg: 'bg-sky-500/30 text-sky-300 border border-sky-400/40',
        glow: 'shadow-sky-500/20',
        accentText: 'text-sky-300',
      };
    case 'gold':
      return {
        border: 'border-amber-500/50 hover:border-amber-400',
        bg: 'bg-gradient-to-br from-amber-950/50 via-slate-900 to-yellow-950/30',
        pillBg: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
        iconBg: 'bg-amber-500/30 text-amber-300 border border-amber-400/50',
        glow: 'shadow-amber-500/20',
        accentText: 'text-amber-300',
      };
    case 'diamond':
      return {
        border: 'border-purple-500/50 hover:border-pink-400',
        bg: 'bg-gradient-to-br from-purple-950/50 via-slate-900 to-pink-950/30',
        pillBg: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
        iconBg: 'bg-gradient-to-br from-purple-600/40 to-pink-600/40 text-pink-300 border border-pink-400/40',
        glow: 'shadow-purple-500/25',
        accentText: 'text-pink-300',
      };
  }
}
