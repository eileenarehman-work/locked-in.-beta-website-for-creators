import {
  Project,
  User,
  Review,
  DirectMessage,
  HeatmapDay,
  Friendship,
  ChatRoom,
  GroupChatMessage,
  AppNotification,
} from '../types';

const STORAGE_KEYS = {
  USER: 'wedidthis_user',
  ALL_USERS: 'wedidthis_all_users',
  FOLLOWING: 'wedidthis_following',
  PROJECTS: 'wedidthis_projects',
  REVIEWS: 'wedidthis_reviews',
  MESSAGES: 'wedidthis_messages',
  FRIENDSHIPS: 'wedidthis_friendships',
  CHAT_ROOMS: 'wedidthis_chat_rooms',
  GROUP_MESSAGES: 'wedidthis_group_messages',
  LIKED_PROJECTS: 'wedidthis_liked_projects',
  NOTIFICATIONS: 'wedidthis_notifications',
  LOGIN_DATES: 'lockedin_login_dates',
  DAILY_REVIEW_DATES: 'lockedin_daily_review_dates',
  DELETED_ACCOUNTS: 'lockedin_deleted_account_ids_v1',
  CLEARED_ACCOUNTS_FLAG: 'lockedin_strict_zero_fabricated_reviews_v6',
  CLEARED_PREMADE_CHATS_FLAG: 'lockedin_no_premade_group_chats_v1',
  DRAFTS: 'lockedin_project_drafts_v1',
};

// Immediate purge of any legacy fake seed accounts, fabricated reviews, fabricated notifications, and dummy builds
if (typeof window !== 'undefined') {
  try {
    // Purge any pre-made default group chats so users start clean with only user-created channels
    if (!localStorage.getItem(STORAGE_KEYS.CLEARED_PREMADE_CHATS_FLAG)) {
      const rawRooms = localStorage.getItem(STORAGE_KEYS.CHAT_ROOMS);
      if (rawRooms) {
        const rooms: ChatRoom[] = JSON.parse(rawRooms);
        // Remove hardcoded pre-made channels
        const userCreatedRooms = rooms.filter(
          (r) => r.id !== 'room_robotics_makers' && r.id !== 'room_gamedev_creative'
        );
        localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(userCreatedRooms));
      } else {
        localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify([]));
      }
      localStorage.setItem(STORAGE_KEYS.CLEARED_PREMADE_CHATS_FLAG, 'true');
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLEARED_ACCOUNTS_FLAG)) {
      // Purge all fabricated reviews & notifications: zero fabricated reviews by default
      localStorage.removeItem(STORAGE_KEYS.REVIEWS);
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

      // Clean existing projects to remove any fake seed builds
      const rawProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (rawProjects) {
        const projs: Project[] = JSON.parse(rawProjects);
        // Keep only projects authored by the actual currentUser
        const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
        const currentUser: User | null = rawUser ? JSON.parse(rawUser) : null;
        if (currentUser) {
          const realProjects = projs.filter((p) => p.authorId === currentUser.id);
          localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(realProjects));
        } else {
          localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        }
      }

      // Clean users to enforce 1 account per email and delete any fake seed users
      const rawUsers = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (rawUsers) {
        const users: User[] = JSON.parse(rawUsers);
        const seenEmails = new Set<string>();
        const realUsers: User[] = [];
        for (const u of users) {
          const email = (u.email || '').trim().toLowerCase();
          // Filter out dummy/seed domains
          if (email && !email.endsWith('@wedidthis.dev')) {
            if (!seenEmails.has(email)) {
              seenEmails.add(email);
              realUsers.push(u);
            }
          }
        }
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(realUsers));
      }

      localStorage.setItem(STORAGE_KEYS.CLEARED_ACCOUNTS_FLAG, 'true');
    }

    // Fix legacy accounts that received 27 points (25 default + 2 streak) on initial signup
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (rawUser) {
      const u: User = JSON.parse(rawUser);
      if (u && u.reputationScore === 27) {
        u.reputationScore = 2;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      }
    }
    const rawAll = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (rawAll) {
      const all: User[] = JSON.parse(rawAll);
      let changed = false;
      for (const u of all) {
        if (u && u.reputationScore === 27) {
          u.reputationScore = 2;
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(all));
      }
    }
  } catch (e) {
    console.error('Storage cleanup failed', e);
  }
}

// Clean storage helper functions with strict 1 account per email guarantee
export const storage = {
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      storage.registerUser(user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
  getAllUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      const users: User[] = data ? JSON.parse(data) : [];
      // Clean and filter out fake dummy accounts (e.g. from the old friending bug)
      const validUsers: User[] = [];
      const seenEmails = new Set<string>();
      const seenHandles = new Set<string>();
      const seenIds = new Set<string>();

      for (const u of users) {
        if (!u || !u.id || !u.email) continue;
        // Purge dummy accounts generated by the old bug
        if (u.bio === 'Teen builder on We Did This' || u.email.endsWith('@wedidthis.dev')) {
          continue;
        }
        const normEmail = (u.email || '').trim().toLowerCase();
        const normHandle = (u.handle || '').replace(/^@/, '').trim().toLowerCase();
        if (normEmail && !seenEmails.has(normEmail) && !seenIds.has(u.id)) {
          seenEmails.add(normEmail);
          if (normHandle) seenHandles.add(normHandle);
          seenIds.add(u.id);
          validUsers.push(u);
        }
      }

      // Ensure currentUser is included if signed in
      const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (rawUser) {
        try {
          const currentUser: User = JSON.parse(rawUser);
          if (currentUser && currentUser.id && currentUser.email) {
            const normEmail = currentUser.email.trim().toLowerCase();
            if (!seenEmails.has(normEmail) && !seenIds.has(currentUser.id)) {
              validUsers.push(currentUser);
              seenEmails.add(normEmail);
              seenIds.add(currentUser.id);
            }
          }
        } catch {
          // ignore
        }
      }

      return validUsers;
    } catch {
      return [];
    }
  },
  getDeletedAccountIds: (): Set<string> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  },
  saveAllUsers: (users: User[]) => {
    // Strictly deduplicate by email address (1 account per email)
    const seenEmails = new Set<string>();
    const deduplicated: User[] = [];
    for (const u of users) {
      if (!u || !u.email) continue;
      const norm = u.email.trim().toLowerCase();
      if (norm && !seenEmails.has(norm)) {
        seenEmails.add(norm);
        deduplicated.push(u);
      }
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(deduplicated));
  },
  getUserByEmail: (email: string): User | null => {
    try {
      const clean = email.trim().toLowerCase();
      if (!clean) return null;
      const users = storage.getAllUsers();
      return users.find((u) => (u.email || '').trim().toLowerCase() === clean) || null;
    } catch {
      return null;
    }
  },
  getUserByHandle: (handle: string): User | null => {
    try {
      const clean = handle.replace(/^@/, '').trim().toLowerCase();
      if (!clean) return null;
      const users = storage.getAllUsers();
      return (
        users.find((u) => (u.handle || '').replace(/^@/, '').trim().toLowerCase() === clean) || null
      );
    } catch {
      return null;
    }
  },
  findUserByHandleOrEmail: (query: string): User | null => {
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    const cleanHandle = clean.replace(/^@/, '');

    // Check by handle first
    const byHandle = storage.getUserByHandle(cleanHandle);
    if (byHandle) return byHandle;

    // Check by email
    const byEmail = storage.getUserByEmail(clean);
    if (byEmail) return byEmail;

    // Check substring / fuzzy in all users
    const allUsers = storage.getAllUsers();
    return (
      allUsers.find(
        (u) =>
          (u.handle || '').replace(/^@/, '').trim().toLowerCase() === cleanHandle ||
          (u.email || '').trim().toLowerCase() === clean
      ) || null
    );
  },
  getUserById: (id: string): User | null => {
    try {
      const users = storage.getAllUsers();
      return users.find((u) => u.id === id) || null;
    } catch {
      return null;
    }
  },
  registerUser: (user: User) => {
    if (!user || !user.id || !user.email) return;
    try {
      const existingUsers = storage.getAllUsers();
      const normalizedEmail = (user.email || '').trim().toLowerCase();
      const normalizedHandle = (user.handle || '').replace(/^@/, '').trim().toLowerCase();

      const filtered = existingUsers.filter((u) => {
        const uEmail = (u.email || '').trim().toLowerCase();
        const uHandle = (u.handle || '').replace(/^@/, '').trim().toLowerCase();
        return u.id !== user.id && uEmail !== normalizedEmail && uHandle !== normalizedHandle;
      });
      const updated = [user, ...filtered];
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to register user globally', e);
    }
  },
  isEmailRegistered: (email: string): boolean => {
    return Boolean(storage.getUserByEmail(email));
  },
  deleteUserAccount: (userId: string) => {
    try {
      // 1. Record ID in deleted accounts list
      const deleted = storage.getDeletedAccountIds();
      deleted.add(userId);
      localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(Array.from(deleted)));

      // 2. Remove user from ALL_USERS
      const allUsers = storage.getAllUsers().filter((u) => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));

      // 3. Clear active user if matches
      const activeUser = storage.getUser();
      if (activeUser && activeUser.id === userId) {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }

      // 4. Remove projects authored by this user
      const projects = storage.getProjects().filter((p) => p.authorId !== userId);
      storage.saveProjects(projects);

      // 5. Remove reviews authored by this user
      const reviews = storage.getReviews().filter((r) => r.reviewerId !== userId);
      storage.saveReviews(reviews);

      // 6. Remove drafts authored by this user
      try {
        const drafts = storage.getDrafts().filter((d) => d.authorId !== userId);
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
      } catch {
        // ignore
      }

      // 7. Remove login dates
      try {
        const rawLoginDates = localStorage.getItem(STORAGE_KEYS.LOGIN_DATES);
        if (rawLoginDates) {
          const map = JSON.parse(rawLoginDates);
          delete map[userId];
          localStorage.setItem(STORAGE_KEYS.LOGIN_DATES, JSON.stringify(map));
        }
      } catch {
        // ignore
      }
    } catch (e) {
      console.error('Failed to delete account', e);
    }
  },
  deleteAllAccounts: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ALL_USERS);
      localStorage.removeItem(STORAGE_KEYS.FOLLOWING);
    } catch {
      // ignore
    }
  },
  getFollowing: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOLLOWING);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveFollowing: (ids: string[]) => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(ids));
  },
  getProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveProjects: (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  getDrafts: (userId?: string): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      const drafts: Project[] = data ? JSON.parse(data) : [];
      return userId ? drafts.filter((d) => d.authorId === userId) : drafts;
    } catch {
      return [];
    }
  },
  saveDraft: (draft: Project) => {
    try {
      const drafts = storage.getDrafts();
      const filtered = drafts.filter((d) => d.id !== draft.id);
      const updated = [
        {
          ...draft,
          status: 'DRAFT' as const,
          updatedAt: new Date().toISOString(),
        },
        ...filtered,
      ];
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  },
  deleteDraft: (draftId: string) => {
    try {
      const drafts = storage.getDrafts().filter((d) => d.id !== draftId);
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
    } catch (e) {
      console.error('Failed to delete draft', e);
    }
  },
  getReviews: (): Review[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!data) return [];
      const parsed: Review[] = JSON.parse(data);
      const allUsers = storage.getAllUsers();
      const userIds = new Set(allUsers.map((u) => u.id));
      const projects = storage.getProjects();
      const projectIds = new Set(projects.map((p) => p.id));

      // Strictly purge any fabricated reviews: reviewer and target project MUST exist in real database
      const valid = parsed.filter(
        (r) =>
          r &&
          r.id &&
          !r.id.startsWith('fake_') &&
          userIds.has(r.reviewerId) &&
          projectIds.has(r.projectId)
      );
      if (valid.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(valid));
      }
      return valid;
    } catch {
      return [];
    }
  },
  saveReviews: (reviews: Review[]) => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },
  getMessages: (): DirectMessage[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveMessages: (messages: DirectMessage[]) => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },
  getFriendships: (): Record<string, Friendship> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FRIENDSHIPS);
      if (!data) return {};
      const parsed = JSON.parse(data);
      const cleaned: Record<string, Friendship> = {};
      const allUsers = storage.getAllUsers();
      const userMap = new Map<string, User>(allUsers.map((u) => [u.id, u]));

      for (const [key, fr] of Object.entries(parsed as Record<string, Friendship>)) {
        if (!fr || !fr.userId || !fr.friendId) continue;
        // Verify friend is not a dummy user created by the old bug
        if (
          fr.friend?.bio === 'Teen builder on We Did This' ||
          fr.friend?.email?.endsWith('@wedidthis.dev')
        ) {
          continue;
        }
        // Match real users if available
        const realFriend = userMap.get(fr.friendId) || fr.friend;
        const realSender = userMap.get(fr.userId) || fr.sender;
        if (realFriend) {
          cleaned[fr.id || key] = {
            ...fr,
            id: fr.id || key,
            friend: realFriend,
            sender: realSender,
          };
        }
      }
      return cleaned;
    } catch {
      return {};
    }
  },
  saveFriendships: (friendships: Record<string, Friendship>) => {
    localStorage.setItem(STORAGE_KEYS.FRIENDSHIPS, JSON.stringify(friendships));
  },
  getChatRooms: (): ChatRoom[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_ROOMS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Filter out legacy pre-made rooms if any remain
          return parsed.filter(
            (r) => r && r.id !== 'room_robotics_makers' && r.id !== 'room_gamedev_creative'
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  },
  saveChatRooms: (rooms: ChatRoom[]) => {
    localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(rooms));
  },
  getGroupMessages: (): Record<string, GroupChatMessage[]> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUP_MESSAGES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  saveGroupMessages: (groupMessages: Record<string, GroupChatMessage[]>) => {
    localStorage.setItem(STORAGE_KEYS.GROUP_MESSAGES, JSON.stringify(groupMessages));
  },
  getLikedProjectIds: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKED_PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveLikedProjectIds: (ids: string[]) => {
    localStorage.setItem(STORAGE_KEYS.LIKED_PROJECTS, JSON.stringify(ids));
  },
  getNotifications: (): AppNotification[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) {
        const parsed: AppNotification[] = JSON.parse(data);
        // Strictly return only real account notifications (filter out any legacy fake ones)
        return parsed.filter(
          (n) =>
            !n.id.startsWith('notif_init_') &&
            !n.id.startsWith('fake_') &&
            !n.message.includes('@elena_cad')
        );
      }
      return [];
    } catch {
      return [];
    }
  },
  saveNotifications: (notifications: AppNotification[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  },
  getLoginDates: (userId: string): string[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.LOGIN_DATES}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  recordDailyLogin: (userId: string): { loginDates: string[]; isNewDayLogin: boolean } => {
    try {
      const existing = storage.getLoginDates(userId);
      const todayStr = new Date().toISOString().split('T')[0];
      const isNewDayLogin = !existing.includes(todayStr);
      if (isNewDayLogin) {
        const updated = [todayStr, ...existing.filter((d) => d !== todayStr)];
        localStorage.setItem(`${STORAGE_KEYS.LOGIN_DATES}_${userId}`, JSON.stringify(updated));
        return { loginDates: updated, isNewDayLogin: true };
      }
      return { loginDates: existing, isNewDayLogin: false };
    } catch {
      return { loginDates: [], isNewDayLogin: false };
    }
  },
  getDailyReviewDates: (userId: string): string[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.DAILY_REVIEW_DATES}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  recordDailyReview: (userId: string): { reviewDates: string[]; isNewDayReview: boolean } => {
    try {
      const existing = storage.getDailyReviewDates(userId);
      const todayStr = new Date().toISOString().split('T')[0];
      const isNewDayReview = !existing.includes(todayStr);
      if (isNewDayReview) {
        const updated = [todayStr, ...existing.filter((d) => d !== todayStr)];
        localStorage.setItem(`${STORAGE_KEYS.DAILY_REVIEW_DATES}_${userId}`, JSON.stringify(updated));
        return { reviewDates: updated, isNewDayReview: true };
      }
      return { reviewDates: existing, isNewDayReview: false };
    } catch {
      return { reviewDates: [], isNewDayReview: false };
    }
  },
  hasCompletedDailyReviewToday: (userId: string): boolean => {
    try {
      const dates = storage.getDailyReviewDates(userId);
      const todayStr = new Date().toISOString().split('T')[0];
      return dates.includes(todayStr);
    } catch {
      return false;
    }
  },
  clearAll: () => {
    localStorage.clear();
  },
};

// Generates dynamic activity heatmap based on real user actions including daily logins
export function generateUserHeatmapData(
  activityCount: number = 0,
  userProjects: Project[] = [],
  userReviews: Review[] = [],
  userLoginDates: string[] = []
): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const now = new Date();

  // Map real activities to dates
  const dateCounts: Record<string, number> = {};
  userLoginDates.forEach((d) => {
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  });
  userProjects.forEach((p) => {
    if (p.createdAt) {
      const key = p.createdAt.split('T')[0];
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    }
  });
  userReviews.forEach((r) => {
    if (r.createdAt) {
      const key = r.createdAt.split('T')[0];
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    }
  });

  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = i === 0;
    const realCount = dateCounts[dateStr] || (isToday ? activityCount : 0);
    const level = realCount > 3 ? 4 : realCount > 2 ? 3 : realCount > 1 ? 2 : realCount > 0 ? 1 : 0;
    days.push({
      date: dateStr,
      count: realCount,
      level: level as 0 | 1 | 2 | 3 | 4,
    });
  }
  return days;
}
