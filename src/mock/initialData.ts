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
  CLEARED_ACCOUNTS_FLAG: 'wedidthis_strict_zero_fabricated_rule_v4',
};

// Immediate purge of any legacy fake seed accounts, fabricated notifications, and dummy builds
if (typeof window !== 'undefined') {
  try {
    if (!localStorage.getItem(STORAGE_KEYS.CLEARED_ACCOUNTS_FLAG)) {
      // Purge all fabricated notifications: zero notifications by default
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
      // Register in users directory with strict 1-account-per-email constraint
      try {
        const existingUsers = storage.getAllUsers();
        const normalizedEmail = user.email.trim().toLowerCase();
        // Remove any prior entry matching this email or id to prevent duplicates
        const filtered = existingUsers.filter(
          (u) => u.email.trim().toLowerCase() !== normalizedEmail && u.id !== user.id
        );
        const updated = [user, ...filtered];
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
  getAllUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (data) {
        const users: User[] = JSON.parse(data);
        // Ensure no duplicate emails
        const seen = new Set<string>();
        const deduped: User[] = [];
        for (const u of users) {
          const norm = (u.email || '').trim().toLowerCase();
          if (norm && !seen.has(norm)) {
            seen.add(norm);
            deduped.push(u);
          }
        }
        return deduped;
      }
      return [];
    } catch {
      return [];
    }
  },
  saveAllUsers: (users: User[]) => {
    // Strictly deduplicate by email address (1 account per email)
    const seenEmails = new Set<string>();
    const deduplicated: User[] = [];
    for (const u of users) {
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
      const users = storage.getAllUsers();
      const clean = email.trim().toLowerCase();
      return users.find((u) => u.email.trim().toLowerCase() === clean) || null;
    } catch {
      return null;
    }
  },
  isEmailRegistered: (email: string): boolean => {
    return Boolean(storage.getUserByEmail(email));
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
      return data ? JSON.parse(data) : [];
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
      return data ? JSON.parse(data) : {};
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
  clearAll: () => {
    localStorage.clear();
  },
};

// Generates dynamic activity heatmap based on real user actions
export function generateUserHeatmapData(
  activityCount: number = 0,
  userProjects: Project[] = [],
  userReviews: Review[] = []
): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const now = new Date();

  // Map real activities to dates
  const dateCounts: Record<string, number> = {};
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
