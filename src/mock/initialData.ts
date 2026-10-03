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
  USER_PASSWORDS: 'wedidthis_user_passwords_v1',
  CLEARED_ACCOUNTS_FLAG: 'lockedin_strict_zero_fabricated_reviews_v6',
};

// Permanent canonical account for Eileen to guarantee @eileen_locks_in can always log in
export const EILEEN_DEFAULT_ACCOUNT: User = {
  id: 'user_eileen_locks_in',
  email: 'eileen.a.rehman@gmail.com',
  password: '117190er',
  googleId: 'google_eileen_locks_in',
  age: 17,
  handle: 'eileen_locks_in',
  displayName: 'Eileen',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Circuit',
  bio: 'Teen builder & creator. Building 3D prints, game modding & robotics.',
  reputationScore: 120,
  trustTier: 'VERIFIED_HUMAN',
  interestTags: ['#robotics', '#3dprinting', '#coding'],
  badges: [],
  createdAt: '2024-01-15T00:00:00.000Z',
};

// Immediate purge of any legacy fake seed accounts, fabricated reviews, fabricated notifications, and dummy builds
if (typeof window !== 'undefined') {
  try {
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

      // If an account had eileen_locks_in with placeholder xxx@gmail.com, restore real email
      const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (rawUser && rawUser.includes('eileen_locks_in') && rawUser.includes('xxx@gmail.com')) {
        localStorage.setItem(STORAGE_KEYS.USER, rawUser.replaceAll('xxx@gmail.com', 'eileen.a.rehman@gmail.com'));
      }
      const rawAllUsers = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (rawAllUsers && rawAllUsers.includes('eileen_locks_in') && rawAllUsers.includes('xxx@gmail.com')) {
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, rawAllUsers.replaceAll('xxx@gmail.com', 'eileen.a.rehman@gmail.com'));
      }

      localStorage.setItem(STORAGE_KEYS.CLEARED_ACCOUNTS_FLAG, 'true');
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

      // Ensure Eileen's default account is present unless user explicitly deleted it
      const deletedIds = storage.getDeletedAccountIds();
      if (!deletedIds.has(EILEEN_DEFAULT_ACCOUNT.id)) {
        const hasEileen = validUsers.some(
          (u) =>
            u.id === EILEEN_DEFAULT_ACCOUNT.id ||
            (u.handle || '').toLowerCase() === 'eileen_locks_in' ||
            (u.email || '').toLowerCase() === EILEEN_DEFAULT_ACCOUNT.email.toLowerCase()
        );
        if (!hasEileen) {
          validUsers.push(EILEEN_DEFAULT_ACCOUNT);
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
      const found = users.find((u) => (u.email || '').trim().toLowerCase() === clean);
      if (found) return found;

      // Special guarantee for Eileen's account if matching email
      if (
        clean === 'eileen.a.rehman@gmail.com' ||
        clean === 'xxx@gmail.com' ||
        clean === 'eileen@gmail.com'
      ) {
        const deleted = storage.getDeletedAccountIds();
        if (!deleted.has(EILEEN_DEFAULT_ACCOUNT.id)) {
          storage.registerUser(EILEEN_DEFAULT_ACCOUNT);
          return EILEEN_DEFAULT_ACCOUNT;
        }
      }
      return null;
    } catch {
      return null;
    }
  },
  getUserByHandle: (handle: string): User | null => {
    try {
      const clean = handle.replace(/^@/, '').trim().toLowerCase();
      if (!clean) return null;
      const users = storage.getAllUsers();
      const found = users.find(
        (u) => (u.handle || '').replace(/^@/, '').trim().toLowerCase() === clean
      );
      if (found) return found;

      // Special guarantee for @eileen_locks_in if not explicitly deleted
      if (clean === 'eileen_locks_in') {
        const deleted = storage.getDeletedAccountIds();
        if (!deleted.has(EILEEN_DEFAULT_ACCOUNT.id)) {
          storage.registerUser(EILEEN_DEFAULT_ACCOUNT);
          return EILEEN_DEFAULT_ACCOUNT;
        }
      }
      return null;
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
    const matched = allUsers.find(
      (u) =>
        (u.handle || '').replace(/^@/, '').trim().toLowerCase() === cleanHandle ||
        (u.email || '').trim().toLowerCase() === clean
    );
    if (matched) return matched;

    // Guaranteed @eileen_locks_in fallback
    if (cleanHandle === 'eileen_locks_in' || clean.includes('eileen')) {
      const deleted = storage.getDeletedAccountIds();
      if (!deleted.has(EILEEN_DEFAULT_ACCOUNT.id)) {
        storage.registerUser(EILEEN_DEFAULT_ACCOUNT);
        return EILEEN_DEFAULT_ACCOUNT;
      }
    }

    return null;
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
  getUserPassword: (userId: string): string => {
    if (userId === EILEEN_DEFAULT_ACCOUNT.id) return '117190er';
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
      const map = raw ? JSON.parse(raw) : {};
      return map[userId] || '';
    } catch {
      return '';
    }
  },
  setUserPassword: (userId: string, pass: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_PASSWORDS);
      const map = raw ? JSON.parse(raw) : {};
      map[userId] = pass;
      localStorage.setItem(STORAGE_KEYS.USER_PASSWORDS, JSON.stringify(map));
    } catch {
      // ignore
    }
  },
  validateUserPassword: (user: User, pass: string): boolean => {
    if (!user || !pass) return false;
    // Special internal guarantee for Eileen's account: password must be 117190er
    if (
      user.id === EILEEN_DEFAULT_ACCOUNT.id ||
      (user.handle || '').replace(/^@/, '').toLowerCase() === 'eileen_locks_in' ||
      (user.email || '').toLowerCase() === 'eileen.a.rehman@gmail.com'
    ) {
      return pass === '117190er';
    }
    // Check if user has password directly
    if (user.password && user.password === pass) return true;
    // Check stored password map
    const stored = storage.getUserPassword(user.id);
    if (stored) return stored === pass;
    // If account was created prior to password requirement, record this password as their credential
    storage.setUserPassword(user.id, pass);
    return true;
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

      // 6. Remove login dates
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
      return data ? JSON.parse(data) : [];
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
