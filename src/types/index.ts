export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Badge {
  id: string;
  name: string; // e.g., 'Top Reviewer', 'Pro Builder'
  description: string;
  iconName: 'hammer' | 'shield-check' | 'trophy' | 'star' | 'sparkles' | 'flame' | 'award' | 'zap';
  minReputationScore: number;
  tier: BadgeTier;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
}

export interface User {
  id: string;
  email: string;
  googleId: string;
  age: number;
  handle: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  reputationScore: number;
  trustTier: 'UNVERIFIED' | 'VERIFIED_HUMAN' | 'CREATOR' | 'MAINTAINER';
  interestTags: string[];
  badges?: Badge[];
  githubUrl?: string;
  createdAt: string;
}

export type ProjectStatus = 'DRAFT' | 'PENDING_MODERATION' | 'PUBLISHED';

export interface ProjectMilestone {
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface Project {
  id: string;
  authorId: string;
  author: User;
  title: string;
  slug: string;
  tagline: string;
  contentMarkdown: string;
  mediaUrls: string[];
  viewsCount: number;
  likesCount: number;
  tags: string[];
  qualities?: string[]; // Actual qualities that interest the user (e.g., 'Working Prototype', 'Open Source CAD', 'Tested Schematics')
  status: ProjectStatus;
  milestones: ProjectMilestone[];
  demoUrl?: string;
  repoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectLike {
  projectId: string;
  userId: string;
  createdAt: string;
}

export interface RubricScore {
  clarity: number;       // 0 - 25
  execution: number;     // 0 - 25
  technicality: number;  // 0 - 25
  documentation: number; // 0 - 25
}

export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewer: User;
  rubric: RubricScore;
  totalScore: number;     // 0 - 100
  feedbackText: string;
  aiQualityScore: number; // 0 - 100
  isBlindReview: boolean;
  upvotesCount: number;
  status: 'APPROVED' | 'FLAGGED';
  createdAt: string;
}

export interface CollaborationInvite {
  id: string;
  projectId: string;
  projectTitle: string;
  role: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  sender: User;
  text: string;
  imageUrls?: string[];
  inviteCard?: CollaborationInvite;
  timestamp: string;
  isRead: boolean;
}

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED';

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  createdAt: string;
  friend: User;
}

export type ChatRoomType = 'DIRECT' | 'GROUP';

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  name: string;
  avatarUrl?: string;
  description?: string;
  members: ChatMember[];
  createdAt: string;
}

export interface ChatMember {
  roomId: string;
  userId: string;
  role: 'MEMBER' | 'ADMIN';
  user: User;
}

export interface GroupChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  sender: User;
  content: string;
  imageUrls?: string[];
  readAt?: string;
  createdAt: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export type NotificationType =
  | 'new_review'
  | 'new_follower'
  | 'invite_accepted'
  | 'new_like'
  | 'new_project';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
  };
  targetId?: string;
  targetType?: 'project' | 'profile' | 'message';
  read: boolean;
  createdAt: string;
}
