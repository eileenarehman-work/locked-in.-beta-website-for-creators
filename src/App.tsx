import React, { useState, useEffect, useMemo } from 'react';
import { storage, generateUserHeatmapData } from './mock/initialData';
import {
  Project,
  Review,
  DirectMessage,
  User,
  Friendship,
  ChatRoom,
  ChatMember,
  GroupChatMessage,
  AppNotification,
  NotificationType,
  NavTabType,
} from './types';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectStudio } from './components/ProjectStudio';
import { DirectMessages } from './components/DirectMessages';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { TopBuildersSidebar } from './components/TopBuildersSidebar';
import { ShareProofCard } from './components/ShareProofCard';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { UserProfileSettings } from './components/UserProfileSettings';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { IntroLanding } from './components/IntroLanding';
import { PointsGuideModal } from './components/PointsGuideModal';
import { calculateRealStreak, calculateStreakLoginBonus } from './utils/streakUtils';
import {
  ShieldCheck,
  Compass,
  Search,
  Sparkles,
  Users,
  Clock,
  TrendingUp,
  UserCheck,
  Plus,
  Box,
  Palette,
  Gamepad2,
  Code2,
  Music,
  Flame,
  Star,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function App() {
  // Real user state (no default fake profile)
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getUser());
  const [viewMode, setViewMode] = useState<'app' | 'intro'>('intro');
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [reviews, setReviews] = useState<Review[]>(() => storage.getReviews());
  const [messages, setMessages] = useState<DirectMessage[]>(() => storage.getMessages());
  const [friendships, setFriendships] = useState<Record<string, Friendship>>(() => storage.getFriendships());
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => storage.getChatRooms());
  const [groupMessages, setGroupMessages] = useState<Record<string, GroupChatMessage[]>>(() => storage.getGroupMessages());
  const [likedProjectIds, setLikedProjectIds] = useState<Set<string>>(
    () => new Set(storage.getLikedProjectIds())
  );
  const [followingUserIds, setFollowingUserIds] = useState<Set<string>>(
    () => new Set(storage.getFollowing())
  );
  // Notification Center State (tracks reviews, followers, and collaboration invites)
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storage.getNotifications());
  const [activeTab, setActiveTab] = useState<NavTabType>('feed');

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [shareProject, setShareProject] = useState<Project | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [isPointsGuideOpen, setIsPointsGuideOpen] = useState(false);

  // Filters & Search
  const [selectedTag, setSelectedTag] = useState<string>('#all');
  const [feedSort, setFeedSort] = useState<'trending' | 'recent' | 'following'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDmUserId, setSelectedDmUserId] = useState<string>('');

  // Persist state changes
  useEffect(() => {
    storage.setUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    storage.saveReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    storage.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    storage.saveFriendships(friendships);
  }, [friendships]);

  useEffect(() => {
    storage.saveChatRooms(chatRooms);
  }, [chatRooms]);

  useEffect(() => {
    storage.saveGroupMessages(groupMessages);
  }, [groupMessages]);

  useEffect(() => {
    storage.saveLikedProjectIds(Array.from(likedProjectIds));
  }, [likedProjectIds]);

  useEffect(() => {
    storage.saveFollowing(Array.from(followingUserIds));
  }, [followingUserIds]);

  useEffect(() => {
    storage.saveNotifications(notifications);
  }, [notifications]);

  // Daily login & streak tracking: starts counting when you log in everyday!
  useEffect(() => {
    if (!currentUser) return;
    const { loginDates, isNewDayLogin } = storage.recordDailyLogin(currentUser.id);
    if (isNewDayLogin) {
      // Streak points double / increase by 2 each consecutive login day for engagement
      const streak = calculateRealStreak(projects, reviews, currentUser, loginDates);
      const streakBonus = calculateStreakLoginBonus(streak.currentStreak);

      const updatedUser: User = {
        ...currentUser,
        reputationScore: (currentUser.reputationScore || 0) + streakBonus,
      };
      setCurrentUser(updatedUser);
      storage.setUser(updatedUser);

      const streakNotif: AppNotification = {
        id: `login_streak_${Date.now()}`,
        type: 'streak_milestone',
        title: `🔥 Day ${streak.currentStreak} Daily Streak Active!`,
        message: `Welcome back! Daily streak recorded (+${streakBonus} Points awarded). Keep logging in everyday to earn +2 points each day!`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [streakNotif, ...prev]);
    }
  }, [currentUser?.id]);

  const userLoginDates = useMemo(() => {
    return currentUser ? storage.getLoginDates(currentUser.id) : [];
  }, [currentUser]);

  const hasCompletedDailyReviewToday = useMemo(() => {
    return currentUser ? storage.hasCompletedDailyReviewToday(currentUser.id) : false;
  }, [currentUser, reviews]);

  const streakInfo = useMemo(() => {
    return calculateRealStreak(projects, reviews, currentUser, userLoginDates);
  }, [projects, reviews, currentUser, userLoginDates]);

  const heatmapDays = generateUserHeatmapData(
    projects.length + reviews.length,
    projects,
    reviews,
    userLoginDates
  );

  // Dynamic custom hashtags extracted from all builds + starter hashtags
  const defaultPopularTags = ['#3dprinting', '#robotics', '#art', '#gamedev', '#coding', '#music', '#makers'];
  const allCustomHashtags = Array.from(
    new Set([
      ...defaultPopularTags,
      ...projects.flatMap((p) => p.tags || []),
    ])
  ).filter(Boolean);

  // Gather only real existing users (strictly zero fabricated users)
  const allRealUsers = useMemo(() => {
    const usersMap = new Map<string, User>();
    storage.getAllUsers().forEach((u) => {
      if (u && u.id && u.displayName) {
        usersMap.set(u.id, u);
      }
    });
    projects.forEach((p) => {
      if (p.author && p.author.id && p.author.displayName) {
        if (!usersMap.has(p.author.id)) {
          usersMap.set(p.author.id, p.author);
        }
      }
    });
    if (currentUser && currentUser.id) {
      usersMap.set(currentUser.id, currentUser);
    }
    return Array.from(usersMap.values()).sort(
      (a, b) => (b.reputationScore || 0) - (a.reputationScore || 0)
    );
  }, [currentUser, projects]);

  // Follow / Unfollow creator
  const handleToggleFollow = (creatorId: string) => {
    if (!currentUser) {
      setAuthModalMode('signup');
      setIsGoogleModalOpen(true);
      return;
    }
    if (creatorId === currentUser.id) return;

    const isCurrentlyFollowing = followingUserIds.has(creatorId);

    setFollowingUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
      } else {
        next.add(creatorId);
      }
      return next;
    });

    // Track 'new follower' event when following
    if (!isCurrentlyFollowing) {
      const allUsers = storage.getAllUsers();
      const followedCreator =
        allUsers.find((u) => u.id === creatorId) ||
        projects.find((p) => p.authorId === creatorId)?.author;

      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'new_follower',
        title: 'New follower',
        message: `${currentUser.displayName} (@${currentUser.handle}) started following ${
          followedCreator ? `@${followedCreator.handle}` : 'your builds'
        }`,
        actor: {
          id: currentUser.id,
          name: currentUser.displayName,
          handle: currentUser.handle,
          avatarUrl: currentUser.avatarUrl,
        },
        targetId: creatorId,
        targetType: 'profile',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Filter projects
  const filteredProjects = projects
    .filter((p) => {
      const matchesTag = selectedTag === '#all' || p.tags.includes(selectedTag);
      const matchesQuery =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.handle.toLowerCase().includes(searchQuery.toLowerCase());

      if (feedSort === 'following' && currentUser) {
        const isFollowed = followingUserIds.has(p.authorId) || p.authorId === currentUser.id;
        return matchesTag && matchesQuery && isFollowed;
      }
      return matchesTag && matchesQuery;
    })
    .sort((a, b) => {
      if (feedSort === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.likesCount * 3 + b.viewsCount - (a.likesCount * 3 + a.viewsCount);
    });

  // Like Toggle
  const handleToggleLike = (projectId: string) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsGoogleModalOpen(true);
      return;
    }

    setLikedProjectIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyLiked = next.has(projectId);
      if (isCurrentlyLiked) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const isLiked = likedProjectIds.has(projectId);
          return {
            ...p,
            likesCount: isLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Add Review
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'createdAt'>) => {
    if (!currentUser) {
      setAuthModalMode('signup');
      setIsGoogleModalOpen(true);
      return;
    }

    const newReview: Review = {
      ...newReviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    // Track 'new review received' event in Notification Center
    const targetProject = projects.find((p) => p.id === newReviewData.projectId);
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'new_review',
      title: 'New review received',
      message: `${currentUser.displayName} (@${currentUser.handle}) posted a ${newReview.totalScore}/100 peer review on "${targetProject?.title || 'your build'}"`,
      actor: {
        id: currentUser.id,
        name: currentUser.displayName,
        handle: currentUser.handle,
        avatarUrl: currentUser.avatarUrl,
      },
      targetId: targetProject?.id,
      targetType: 'project',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Check if this is the user's first community review today (Daily Community Review Bonus!)
    const { isNewDayReview } = storage.recordDailyReview(currentUser.id);
    const bonusPoints = isNewDayReview ? 15 : 0;
    const baseReviewPoints = 25;
    const totalPointsEarned = baseReviewPoints + bonusPoints;

    // Update reputation score with base + bonus
    const updatedUser: User = {
      ...currentUser,
      reputationScore: (currentUser.reputationScore || 0) + totalPointsEarned,
    };
    setCurrentUser(updatedUser);
    storage.setUser(updatedUser);

    // If first review today, trigger bonus achievement notification!
    if (isNewDayReview) {
      const bonusNotif: AppNotification = {
        id: `bonus_review_${Date.now()}`,
        type: 'streak_milestone',
        title: '🌟 Daily Review Bonus (+15 Points)!',
        message: `Daily mission complete! You reviewed a community build today and earned +15 Bonus Points (+${totalPointsEarned} Points total for this review). Thank you for supporting fellow makers!`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [bonusNotif, ...prev]);
    }
  };

  // Upvote Review
  const handleUpvoteReview = (reviewId: string) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsGoogleModalOpen(true);
      return;
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, upvotesCount: r.upvotesCount + 1 } : r))
    );
  };

  // Publish Project
  const handlePublishProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveTab('feed');
    setSelectedProject(newProject);
  };

  // Send Direct Message
  const handleSendMessage = (recipientId: string, text: string, imageUrls?: string[]) => {
    if (!currentUser) return;
    const newMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      sender: currentUser,
      text,
      imageUrls,
      timestamp: new Date().toISOString(),
      isRead: true,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Send Group Message
  const handleSendGroupMessage = (roomId: string, content: string, imageUrls?: string[]) => {
    if (!currentUser) return;
    const newGroupMsg: GroupChatMessage = {
      id: `gmsg_${Date.now()}`,
      roomId,
      senderId: currentUser.id,
      sender: currentUser,
      content,
      imageUrls,
      createdAt: new Date().toISOString(),
    };
    setGroupMessages((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newGroupMsg],
    }));
  };

  // Auto-sync currentUser into existing community rooms if not already member
  useEffect(() => {
    if (currentUser) {
      setChatRooms((prev) => {
        let changed = false;
        const updated = prev.map((room) => {
          if (!room.members || room.members.length === 0) {
            changed = true;
            return {
              ...room,
              members: [
                {
                  roomId: room.id,
                  userId: currentUser.id,
                  role: 'ADMIN' as const,
                  user: currentUser,
                },
              ],
            };
          }
          if (!room.members.some((m) => m.userId === currentUser.id)) {
            changed = true;
            return {
              ...room,
              members: [
                ...room.members,
                {
                  roomId: room.id,
                  userId: currentUser.id,
                  role: 'MEMBER' as const,
                  user: currentUser,
                },
              ],
            };
          }
          return room;
        });
        return changed ? updated : prev;
      });
    }
  }, [currentUser]);

  // Create Group Room
  const handleCreateGroupRoom = (name: string, description: string, initialMembers?: User[]) => {
    if (!currentUser) return;
    const roomId = `room_${Date.now()}`;
    const membersList: ChatMember[] = [
      {
        roomId,
        userId: currentUser.id,
        role: 'ADMIN',
        user: currentUser,
      },
    ];
    if (initialMembers && initialMembers.length > 0) {
      initialMembers.forEach((u) => {
        if (u.id !== currentUser.id && !membersList.some((m) => m.userId === u.id)) {
          membersList.push({
            roomId,
            userId: u.id,
            role: 'MEMBER',
            user: u,
          });
        }
      });
    }
    const newRoom: ChatRoom = {
      id: roomId,
      type: 'GROUP',
      name,
      description,
      members: membersList,
      createdAt: new Date().toISOString(),
    };
    setChatRooms((prev) => [newRoom, ...prev]);
  };

  const handleAddGroupMember = (roomId: string, user: User) => {
    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          if (room.members.some((m) => m.userId === user.id)) return room;
          const newMember = {
            roomId,
            userId: user.id,
            role: 'MEMBER' as const,
            user,
          };
          return {
            ...room,
            members: [...room.members, newMember],
          };
        }
        return room;
      })
    );
  };

  const handleRemoveGroupMember = (roomId: string, userId: string) => {
    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            members: room.members.filter((m) => m.userId !== userId),
          };
        }
        return room;
      })
    );
  };

  // Update Collaboration Invite
  const handleUpdateInviteStatus = (inviteId: string, status: 'ACCEPTED' | 'DECLINED') => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.inviteCard && m.inviteCard.id === inviteId) {
          return {
            ...m,
            inviteCard: {
              ...m.inviteCard,
              status,
            },
          };
        }
        return m;
      })
    );

    // Track 'invite accepted' event in Notification Center
    if (status === 'ACCEPTED') {
      const inviteMsg = messages.find((m) => m.inviteCard && m.inviteCard.id === inviteId);
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'invite_accepted',
        title: 'Collaboration invite accepted!',
        message: `${currentUser ? currentUser.displayName : 'A builder'} accepted the collaboration invite on "${
          inviteMsg?.inviteCard?.projectTitle || 'project'
        }" (${inviteMsg?.inviteCard?.role || 'creator'})!`,
        actor: currentUser
          ? {
              id: currentUser.id,
              name: currentUser.displayName,
              handle: currentUser.handle,
              avatarUrl: currentUser.avatarUrl,
            }
          : undefined,
        targetType: 'message',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Friend Requests
  const handleAcceptFriendRequest = (friendshipId: string) => {
    let acceptedFriend: User | null = null;
    setFriendships((prev) => {
      const next = { ...prev };
      for (const key in next) {
        if (next[key].id === friendshipId) {
          next[key] = { ...next[key], status: 'ACCEPTED' };
          if (currentUser) {
            acceptedFriend =
              next[key].userId === currentUser.id
                ? next[key].friend
                : next[key].sender || storage.getUserById(next[key].userId);
          }
        }
      }
      return next;
    });

    if (currentUser && acceptedFriend) {
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'new_follower',
        title: 'Friend Request Accepted!',
        message: `${currentUser.displayName} (@${currentUser.handle}) accepted your friend request! You can now send direct messages.`,
        actor: {
          id: currentUser.id,
          name: currentUser.displayName,
          handle: currentUser.handle,
          avatarUrl: currentUser.avatarUrl,
        },
        targetType: 'message',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleDeclineOrRemoveFriend = (friendshipId: string) => {
    setFriendships((prev) => {
      const next = { ...prev };
      delete next[friendshipId];
      for (const k in next) {
        if (next[k].id === friendshipId) {
          delete next[k];
        }
      }
      return next;
    });
  };

  const handleSendFriendRequest = (friendHandleOrId: string) => {
    if (!currentUser) return { success: false, error: 'Please sign in to add friends.' };
    const clean = friendHandleOrId.replace(/^@/, '').trim().toLowerCase();
    if (!clean) return { success: false, error: 'Please enter a valid handle.' };

    // Search strictly among registered accounts that have completed the sign up process
    const allUsers = storage.getAllUsers();
    const targetUser = allUsers.find(
      (u) =>
        (u.handle || '').replace(/^@/, '').trim().toLowerCase() === clean ||
        u.id.toLowerCase() === clean ||
        (u.displayName || '').trim().toLowerCase() === clean
    );

    if (!targetUser) {
      // STRICTLY DO NOT CREATE A DUMMY USER!
      return {
        success: false,
        error: `No registered account found for "@${clean}". Only users who have signed up can be added as friends.`,
      };
    }

    if (targetUser.id === currentUser.id) {
      return {
        success: false,
        error: 'You cannot send a friend request to yourself.',
      };
    }

    // Check if friendship already exists
    const existingEntry = Object.entries(friendships).find(
      ([, f]) =>
        (f.userId === currentUser.id && f.friendId === targetUser.id) ||
        (f.userId === targetUser.id && f.friendId === currentUser.id)
    );

    if (existingEntry) {
      const [, existing] = existingEntry;
      if (existing.status === 'ACCEPTED') {
        return {
          success: false,
          error: `You and @${targetUser.handle} are already friends!`,
        };
      }
      if (existing.userId === currentUser.id) {
        return {
          success: false,
          error: `Friend request to @${targetUser.handle} has already been sent and is pending.`,
        };
      }
      // Target already sent request to currentUser -> accept it!
      handleAcceptFriendRequest(existing.id);
      return {
        success: true,
        message: `@${targetUser.handle} already sent you a request! You are now friends!`,
      };
    }

    const friendshipId = `fr_${currentUser.id}_${targetUser.id}`;
    const newFriendship: Friendship = {
      id: friendshipId,
      userId: currentUser.id,
      friendId: targetUser.id,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      friend: targetUser,
      sender: currentUser,
    };

    setFriendships((prev) => ({
      ...prev,
      [friendshipId]: newFriendship,
    }));

    // Notification for recipient
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'new_follower',
      title: 'Friend Request',
      message: `${currentUser.displayName} (@${currentUser.handle}) sent you a friend request.`,
      actor: {
        id: currentUser.id,
        name: currentUser.displayName,
        handle: currentUser.handle,
        avatarUrl: currentUser.avatarUrl,
      },
      targetType: 'message',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return {
      success: true,
      message: `Friend request sent to @${targetUser.handle}! When they accept, you will be able to communicate.`,
    };
  };

  // Auth Handlers
  const handleAuthSuccess = (user: User) => {
    // Record login for today and start/advance daily streak
    const { loginDates, isNewDayLogin } = storage.recordDailyLogin(user.id);
    let userToSet = user;
    if (isNewDayLogin) {
      const streak = calculateRealStreak(projects, reviews, user, loginDates);
      const streakBonus = calculateStreakLoginBonus(streak.currentStreak);
      userToSet = {
        ...user,
        reputationScore: (user.reputationScore || 0) + streakBonus,
      };
      const streakNotif: AppNotification = {
        id: `login_streak_${Date.now()}`,
        type: 'streak_milestone',
        title: `🔥 Day ${streak.currentStreak} Streak Active!`,
        message: `Welcome back! Daily login recorded (+${streakBonus} Points awarded). Keep your streak alive — log in everyday to earn +2 points each day!`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [streakNotif, ...prev]);
    }
    setCurrentUser(userToSet);
    storage.setUser(userToSet);
    setIsGoogleModalOpen(false);
    setViewMode('app');
  };

  const handleUpdateUserProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    storage.setUser(updatedUser);

    // Sync updated display name and avatar across all projects authored by this user
    setProjects((prev) =>
      prev.map((p) => (p.authorId === updatedUser.id ? { ...p, author: updatedUser } : p))
    );

    // Sync updated user info across reviews
    setReviews((prev) =>
      prev.map((r) => (r.reviewerId === updatedUser.id ? { ...r, reviewer: updatedUser } : r))
    );

    // Sync updated sender profile in direct messages
    setMessages((prev) =>
      prev.map((m) => (m.senderId === updatedUser.id ? { ...m, sender: updatedUser } : m))
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setUser(null);
  };

  const handleDeleteAccount = (userId: string) => {
    storage.deleteUserAccount(userId);
    if (currentUser?.id === userId) {
      setCurrentUser(null);
      storage.setUser(null);
    }
    // Refresh all reactive state
    setProjects(storage.getProjects());
    setReviews(storage.getReviews());
    setIsProfileSettingsOpen(false);
    setSelectedProfileUser(null);
  };

  // Build conversations map from real messages & friendships
  const activeConversations: Record<string, User> = useMemo(() => {
    const activeMap: Record<string, User> = {};
    if (!currentUser) return activeMap;

    const allUsers = storage.getAllUsers();
    const userMap = new Map<string, User>();
    allUsers.forEach((u) => userMap.set(u.id, u));
    allRealUsers.forEach((u) => userMap.set(u.id, u));

    // 1. Add all accepted friends
    Object.values(friendships).forEach((f) => {
      if (f.status === 'ACCEPTED') {
        const otherId = f.userId === currentUser.id ? f.friendId : f.userId;
        const other = userMap.get(otherId) || (f.userId === currentUser.id ? f.friend : f.sender);
        if (other && other.id !== currentUser.id) {
          activeMap[other.id] = other;
        }
      }
    });

    // 2. Add any users from DM history (both received and sent)
    messages.forEach((m) => {
      if (m.senderId === currentUser.id && m.recipientId !== currentUser.id) {
        const other = userMap.get(m.recipientId);
        if (other) activeMap[other.id] = other;
      } else if (m.recipientId === currentUser.id && m.senderId !== currentUser.id) {
        const other = m.sender || userMap.get(m.senderId);
        if (other) activeMap[other.id] = other;
      }
    });

    // 3. If a user was directly selected (e.g. from Project Detail or Creator Profile "Message")
    if (selectedDmUserId && selectedDmUserId !== currentUser.id) {
      const target = userMap.get(selectedDmUserId);
      if (target) {
        activeMap[target.id] = target;
      }
    }

    return activeMap;
  }, [currentUser, friendships, messages, selectedDmUserId, allRealUsers]);

  // Notification Center Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (notif.targetType === 'project') {
      if (notif.targetId) {
        const found = projects.find((p) => p.id === notif.targetId);
        if (found) {
          setSelectedProject(found);
          return;
        }
      }
      if (projects.length > 0) setSelectedProject(projects[0]);
      setActiveTab('feed');
    } else if (notif.targetType === 'profile') {
      if (notif.actor?.id) {
        const allUsers = storage.getAllUsers();
        const found = allUsers.find(
          (u) => u.id === notif.actor?.id || u.handle === notif.actor?.handle
        );
        if (found) {
          setSelectedProfileUser(found);
        }
      }
    } else if (notif.targetType === 'message') {
      setActiveTab('messages');
    }
  };

  const unreadMessagesCount = currentUser
    ? messages.filter((m) => m.recipientId === currentUser.id && !m.isRead).length
    : 0;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Intro Landing View
  if (viewMode === 'intro') {
    return (
      <>
        <IntroLanding
          onEnterApp={() => setViewMode('app')}
          onOpenGoogleLogin={(mode = 'signup') => {
            setAuthModalMode(mode);
            setIsGoogleModalOpen(true);
          }}
          featuredProjects={projects}
        />
        {isGoogleModalOpen && (
          <GoogleAuthModal
            initialMode={authModalMode}
            onSuccess={handleAuthSuccess}
            onClose={() => setIsGoogleModalOpen(false)}
            existingUser={currentUser}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentStreak={streakInfo.currentStreak}
        onOpenPointsGuide={() => setIsPointsGuideOpen(true)}
        onOpenGoogleLogin={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsGoogleModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileSettingsOpen(true)}
        onLogout={handleLogout}
        onNewProject={() => {
          if (!currentUser) {
            setAuthModalMode('signup');
            setIsGoogleModalOpen(true);
          } else {
            setActiveTab('studio');
          }
        }}
        onShowIntro={() => setViewMode('intro')}
        unreadCount={unreadMessagesCount}
        notifications={notifications}
        unreadNotificationsCount={unreadNotificationsCount}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearNotifications={handleClearNotifications}
        onNotificationClick={handleNotificationClick}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* 1. Dedicated Community Feed Tab (like YouTube or Instagram) */}
        {activeTab === 'feed' && (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
            {/* Feed Header Banner */}
            <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 p-5 sm:p-7 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                    <Compass className="h-4 w-4 text-indigo-400" />
                    <span className="font-bold uppercase tracking-wider">Community Feed</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-mono">Live Creations</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Explore What Creators Are Building
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    The real-time social feed for hardware, 3D prints, robots, games, apps, and code. Follow builders, drop reactions, and write constructive peer reviews.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setAuthModalMode('signup');
                        setIsGoogleModalOpen(true);
                      } else {
                        setActiveTab('studio');
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Drop Build</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('streak')}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="View Daily Streak Hub"
                  >
                    <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span>Streak</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Real Social Discovery & Showcase Feed - Strictly Just Feeds */}
            <div className="space-y-6">
              {/* Filter Bar & Search */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                {/* Feed Sort & Custom YouTube-Style Hashtags */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium">
                    <button
                      onClick={() => setFeedSort('trending')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        feedSort === 'trending' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trending
                    </button>
                    <button
                      onClick={() => setFeedSort('recent')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        feedSort === 'recent' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Recent
                    </button>
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          setAuthModalMode('login');
                          setIsGoogleModalOpen(true);
                        } else {
                          setFeedSort('following');
                        }
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        feedSort === 'following' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Following
                    </button>
                  </div>

                  <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                  {/* Custom Hashtags */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
                    <button
                      onClick={() => setSelectedTag('#all')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                        selectedTag === '#all'
                          ? 'bg-slate-800 text-indigo-300 border border-indigo-500/50 font-semibold'
                          : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      All Builds
                    </button>
                    {allCustomHashtags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? '#all' : tag)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                          selectedTag === tag
                            ? 'bg-slate-800 text-indigo-300 border border-indigo-500/50 font-semibold'
                            : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search builds, makers, #tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Projects Feed Grid - Just Feeds */}
              {filteredProjects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">No Builds in This Feed Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Publish the first project in Art, 3D Printing, Game Dev, Robotics, or Code!
                  </p>
                  <button
                    onClick={() => {
                      if (!currentUser) setIsGoogleModalOpen(true);
                      else setActiveTab('studio');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Drop Your Build Now 🚀</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpenProject={(p) => setSelectedProject(p)}
                      onShareProject={(p) => setShareProject(p)}
                      onToggleLike={handleToggleLike}
                      isLiked={likedProjectIds.has(project.id)}
                      onOpenAuthorProfile={(author) => setSelectedProfileUser(author)}
                      onSelectTag={(tag) => setSelectedTag(tag)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Dedicated Points & Streak Hub Tab (Streak, Badges, Leaderboard, Daily Missions) */}
        {activeTab === 'streak' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            {/* Streak & Daily Missions Hero Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 h-64 w-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
                    <span className="font-bold tracking-wider">DAILY STREAK & POINTS</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Day {streakInfo.currentStreak > 0 ? streakInfo.currentStreak : 1} Streak 🔥
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Check in every day to keep your streak alive, review projects from other builders, unlock badges, and climb the leaderboard.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPointsGuideOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm cursor-pointer"
                  >
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>How Points Work</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('feed')}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <Compass className="h-4 w-4" />
                    <span>Back to Feed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* All Points Stuff Layout: Streak & Badges Hub (8 cols) + Leaderboard (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols): Daily Review Mission + Streak & Badges Hub */}
              <div className="lg:col-span-8 space-y-6">
                {/* Daily Community Review Quest Booster Card */}
                <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-5 space-y-3.5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400" />
                      </span>
                      <div>
                        <h3 className="text-xs font-bold text-white tracking-tight">
                          Daily Review Bonus
                        </h3>
                        <span className="text-[10px] font-mono text-emerald-400">
                          +15 Bonus Points Today
                        </span>
                      </div>
                    </div>
                    {hasCompletedDailyReviewToday ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        COMPLETED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 animate-pulse">
                        AVAILABLE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Review any maker's project today to grab a <strong className="text-amber-300">+15 bonus points</strong> reward on top of your normal review points (+40 points total)!
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (filteredProjects.length > 0) {
                          setSelectedProject(filteredProjects[0]);
                        } else {
                          setActiveTab('reviews');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{hasCompletedDailyReviewToday ? 'Review Another Build' : 'Complete Daily Review (+15 Pts)'}</span>
                    </button>
                  </div>
                </div>

                {/* Real Streak & Badges Hub */}
                <ActivityHeatmap
                  days={heatmapDays}
                  totalContributions={projects.length + reviews.length}
                  currentUser={currentUser}
                  projects={projects}
                  reviews={reviews}
                  onOpenNewBuild={() => {
                    if (!currentUser) {
                      setAuthModalMode('signup');
                      setIsGoogleModalOpen(true);
                    } else {
                      setActiveTab('studio');
                    }
                  }}
                  onOpenProfile={(u) => setSelectedProfileUser(u)}
                />
              </div>

              {/* Right Column (4 cols): Leaderboard (Top Builders) */}
              <div className="lg:col-span-4 space-y-6">
                <TopBuildersSidebar
                  users={allRealUsers}
                  currentUser={currentUser}
                  followingUserIds={followingUserIds}
                  onToggleFollow={handleToggleFollow}
                  onOpenProfile={(u) => setSelectedProfileUser(u)}
                  onOpenPointsGuide={() => setIsPointsGuideOpen(true)}
                  onOpenLogin={() => {
                    setAuthModalMode('signup');
                    setIsGoogleModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Project Studio */}
        {activeTab === 'studio' && (
          currentUser ? (
            <ProjectStudio
              currentUser={currentUser}
              onPublishProject={handlePublishProject}
            />
          ) : (
            <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
              <ShieldCheck className="h-10 w-10 text-indigo-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Sign In to Drop Your Build</h3>
              <p className="text-xs text-slate-400">
                To keep our platform 100% human and free of spam or fake bots, please sign in with Google.
              </p>
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Sign in with Google
              </button>
            </div>
          )
        )}

        {/* Human Reviews Stream */}
        {activeTab === 'reviews' && (
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
                  Peer Reviews
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Constructive feedback and rubric evaluations from fellow creators.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Rubric Evaluations</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-400 space-y-2">
                <p>No peer reviews submitted yet.</p>
                <p className="text-slate-500">
                  Open any build in the Showcase to submit the first constructive rubric evaluation!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => {
                  const targetProject = projects.find((p) => p.id === rev.projectId);
                  return (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 backdrop-blur-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.reviewer.avatarUrl}
                            alt={rev.reviewer.displayName}
                            referrerPolicy="no-referrer"
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              {rev.isBlindReview ? 'Anonymous Creator' : rev.reviewer.displayName}
                            </span>
                            {!rev.isBlindReview && (
                              <span className="text-xs font-mono text-slate-400">
                                @{rev.reviewer.handle}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono text-emerald-400 font-semibold">
                            Rubric: {rev.totalScore}/100
                          </span>
                          <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 text-xs font-mono text-indigo-300 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" />
                            Quality: {rev.aiQualityScore}%
                          </span>
                        </div>
                      </div>

                      {targetProject && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">
                              Project Evaluated
                            </span>
                            <button
                              onClick={() => setSelectedProject(targetProject)}
                              className="text-xs font-semibold text-indigo-400 hover:underline text-left line-clamp-1"
                            >
                              {targetProject.title}
                            </button>
                          </div>
                          <span className="text-xs font-mono text-slate-400">
                            by @{targetProject.author.handle}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-4 gap-2 rounded-xl bg-slate-950 p-3 text-center text-xs font-mono border border-slate-800">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Clarity</span>
                          <span className="text-white font-medium">{rev.rubric.clarity}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Execution</span>
                          <span className="text-white font-medium">{rev.rubric.execution}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Technicality</span>
                          <span className="text-white font-medium">{rev.rubric.technicality}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Documentation</span>
                          <span className="text-white font-medium">{rev.rubric.documentation}/25</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rev.feedbackText}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <button
                          onClick={() => handleUpvoteReview(rev.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <span>Helpful ({rev.upvotesCount})</span>
                        </button>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Chat & Friends */}
        {activeTab === 'messages' && (
          currentUser ? (
            <DirectMessages
              currentUser={currentUser}
              conversations={activeConversations}
              messages={messages}
              chatRooms={chatRooms}
              groupMessages={groupMessages}
              friendships={friendships}
              onSendMessage={handleSendMessage}
              onSendGroupMessage={handleSendGroupMessage}
              onCreateGroupRoom={handleCreateGroupRoom}
              onAddGroupMember={handleAddGroupMember}
              onRemoveGroupMember={handleRemoveGroupMember}
              onUpdateInviteStatus={handleUpdateInviteStatus}
              onAcceptFriendRequest={handleAcceptFriendRequest}
              onDeclineFriendRequest={handleDeclineOrRemoveFriend}
              onSendFriendRequest={handleSendFriendRequest}
              allRegisteredUsers={allRealUsers}
              selectedUserId={selectedDmUserId}
              onSelectUser={setSelectedDmUserId}
            />
          ) : (
            <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
              <Users className="h-10 w-10 text-indigo-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Sign In to Access Social Chat</h3>
              <p className="text-xs text-slate-400">
                Connect with teen creators, create group channels, and chat directly.
              </p>
              <button
                onClick={() => setIsGoogleModalOpen(true)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Sign in with Google
              </button>
            </div>
          )
        )}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          reviews={reviews.filter((r) => r.projectId === selectedProject.id)}
          onAddReview={handleAddReview}
          onUpvoteReview={handleUpvoteReview}
          onOpenMessageWithAuthor={(author) => {
            if (!currentUser) {
              setAuthModalMode('login');
              setIsGoogleModalOpen(true);
              return;
            }
            setSelectedDmUserId(author.id);
            setActiveTab('messages');
            setSelectedProject(null);
          }}
          onShareProject={(p) => setShareProject(p)}
          onOpenGoogleLogin={() => {
            setAuthModalMode('login');
            setIsGoogleModalOpen(true);
          }}
          currentUser={currentUser}
          onOpenAuthorProfile={(author) => setSelectedProfileUser(author)}
          isFollowingAuthor={followingUserIds.has(selectedProject.authorId)}
          onToggleFollowAuthor={handleToggleFollow}
        />
      )}

      {/* Creator Profile Modal with Follow / Unfollow & Friend / Unfriend */}
      {selectedProfileUser && (
        <CreatorProfileModal
          profileUser={selectedProfileUser}
          currentUser={currentUser}
          projects={projects}
          reviews={reviews}
          friendships={friendships}
          onUnfriend={handleDeclineOrRemoveFriend}
          onSendFriendRequest={handleSendFriendRequest}
          onAcceptFriendRequest={handleAcceptFriendRequest}
          isFollowing={followingUserIds.has(selectedProfileUser.id)}
          followerCount={followingUserIds.has(selectedProfileUser.id) ? 1 : 0}
          followingCount={selectedProfileUser.id === currentUser?.id ? followingUserIds.size : 0}
          onToggleFollow={handleToggleFollow}
          onOpenMessage={(targetUser) => {
            setSelectedProfileUser(null);
            setSelectedDmUserId(targetUser.id);
            setActiveTab('messages');
          }}
          onOpenProject={(proj) => {
            setSelectedProfileUser(null);
            setSelectedProject(proj);
          }}
          onEditOwnProfile={() => {
            setSelectedProfileUser(null);
            setIsProfileSettingsOpen(true);
          }}
          onClose={() => setSelectedProfileUser(null)}
        />
      )}

      {/* Share Proof Card Modal */}
      {shareProject && (
        <ShareProofCard project={shareProject} onClose={() => setShareProject(null)} />
      )}

      {/* Real Google Auth & Profile Customization Modal */}
      {isGoogleModalOpen && (
        <GoogleAuthModal
          initialMode={authModalMode}
          onSuccess={handleAuthSuccess}
          onClose={() => setIsGoogleModalOpen(false)}
          existingUser={currentUser}
        />
      )}

      {/* User Profile Settings Modal (Display Name, Bio, S3 Avatar Upload) */}
      {isProfileSettingsOpen && currentUser && (
        <UserProfileSettings
          currentUser={currentUser}
          onUpdateUser={handleUpdateUserProfile}
          onClose={() => setIsProfileSettingsOpen(false)}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {/* Points & Daily Streak Guide Modal */}
      <PointsGuideModal
        isOpen={isPointsGuideOpen}
        onClose={() => setIsPointsGuideOpen(false)}
        currentUserRep={currentUser?.reputationScore || 0}
        currentStreak={streakInfo.currentStreak}
      />
    </div>
  );
}
