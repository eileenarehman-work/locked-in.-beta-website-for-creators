import { Project, Review, User } from '../types';

export interface DayStreakItem {
  date: string;
  dayLabel: string;
  fullDayName: string;
  hasActivity: boolean;
  isToday: boolean;
  activityCount: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
  pastWeek: DayStreakItem[];
  nextMilestone: {
    days: number;
    title: string;
    description: string;
  };
  todayBonus: number;
  nextDayBonus: number;
}

/**
 * Calculates the daily streak login bonus.
 * Users get 2 points everyday for logging in and keeping their streak active.
 */
export function calculateStreakLoginBonus(_currentStreak?: number): number {
  return 2;
}

export function calculateRealStreak(
  projects: Project[],
  reviews: Review[],
  currentUser: User | null,
  loginDates: string[] = []
): StreakInfo {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getEmptyWeek = () => {
    const arr: DayStreakItem[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      arr.push({
        date: dateStr,
        dayLabel: dayLabels[dayOfWeek].slice(0, 1),
        fullDayName: dayLabels[dayOfWeek],
        hasActivity: false,
        isToday: i === 0,
        activityCount: 0,
      });
    }
    return arr;
  };

  // If no user, streak is 0
  if (!currentUser) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalContributions: 0,
      lastActiveDate: null,
      isActiveToday: false,
      pastWeek: getEmptyWeek(),
      nextMilestone: {
        days: 3,
        title: '3-Day Maker Spark',
        description: 'Log in everyday or drop a build to start your daily streak!',
      },
      todayBonus: 2,
      nextDayBonus: 4,
    };
  }

  // Filter activities belonging to current user
  const userProjects = projects.filter((p) => p.authorId === currentUser.id);
  const userReviews = reviews.filter((r) => r.reviewerId === currentUser.id);

  // Collect unique dates (YYYY-MM-DD)
  const activityDates = new Set<string>();
  const activityCountsByDate: Record<string, number> = {};

  // 1. Daily login dates - logging in everyday counts towards the streak!
  loginDates.forEach((d) => {
    activityDates.add(d);
    activityCountsByDate[d] = (activityCountsByDate[d] || 0) + 1;
  });

  // Since user is currently logged in, ensure today's login counts!
  const todayStr = new Date().toISOString().split('T')[0];
  activityDates.add(todayStr);
  activityCountsByDate[todayStr] = Math.max(1, (activityCountsByDate[todayStr] || 0) + 1);

  // 2. Project publish dates
  userProjects.forEach((p) => {
    if (p.createdAt) {
      const d = p.createdAt.split('T')[0];
      activityDates.add(d);
      activityCountsByDate[d] = (activityCountsByDate[d] || 0) + 1;
    }
  });

  // 3. Review dates
  userReviews.forEach((r) => {
    if (r.createdAt) {
      const d = r.createdAt.split('T')[0];
      activityDates.add(d);
      activityCountsByDate[d] = (activityCountsByDate[d] || 0) + 1;
    }
  });

  const sortedDates = Array.from(activityDates).sort().reverse();
  const totalContributions =
    userProjects.length + userReviews.length + (loginDates.length > 0 ? loginDates.length : 1);

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const isActiveToday = activityDates.has(todayStr);
  const isActiveYesterday = activityDates.has(yesterdayStr);

  let currentStreak = 0;
  if (isActiveToday || isActiveYesterday) {
    let checkDate = isActiveToday ? new Date() : yesterday;
    const visitedDates = new Set<string>();
    for (let step = 0; step < 365; step++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (visitedDates.has(dateStr)) {
        checkDate = new Date(checkDate.getTime() - 12 * 60 * 60 * 1000);
        continue;
      }
      visitedDates.add(dateStr);
      if (activityDates.has(dateStr)) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
  }

  // Ensure an active logged-in user always starts with at least a 1-day streak for today's session
  if (currentUser && currentStreak === 0 && isActiveToday) {
    currentStreak = 1;
  }

  // Next milestone determination
  let nextMilestone = {
    days: 3,
    title: '3-Day Maker Spark',
    description: 'Log in 3 days in a row to light your maker flame.',
  };
  if (currentStreak >= 3 && currentStreak < 7) {
    nextMilestone = {
      days: 7,
      title: '7-Day Sprint',
      description: '1 full week of continuous daily logins & builds.',
    };
  } else if (currentStreak >= 7 && currentStreak < 14) {
    nextMilestone = {
      days: 14,
      title: '14-Day Momentum',
      description: 'Unstoppable 2-week daily streak.',
    };
  } else if (currentStreak >= 14 && currentStreak < 30) {
    nextMilestone = {
      days: 30,
      title: '30-Day Master',
      description: 'A legend of hands-on daily consistency.',
    };
  } else if (currentStreak >= 30) {
    nextMilestone = {
      days: 60,
      title: '60-Day Titan',
      description: 'Top 1% discipline in the maker collective.',
    };
  }

  // Build past 7 days breakdown (ending today)
  const pastWeek: DayStreakItem[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const isToday = i === 0;

    const count = activityCountsByDate[dateStr] || 0;
    const hasActivity = activityDates.has(dateStr) || count > 0 || (isToday && currentUser !== null);

    pastWeek.push({
      date: dateStr,
      dayLabel: dayLabels[dayOfWeek].slice(0, 1),
      fullDayName: dayLabels[dayOfWeek],
      hasActivity,
      isToday,
      activityCount: count > 0 ? count : (hasActivity ? 1 : 0),
    });
  }

  const todayBonus = calculateStreakLoginBonus(currentStreak);
  const nextDayBonus = calculateStreakLoginBonus(currentStreak + 1);

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, sortedDates.length > 0 ? currentStreak : 1),
    totalContributions,
    lastActiveDate: sortedDates[0] || todayStr,
    isActiveToday,
    pastWeek,
    nextMilestone,
    todayBonus,
    nextDayBonus,
  };
}

export function calculateStreakInfo(
  currentUser: User | null,
  projects: Project[] = [],
  reviews: Review[] = []
): StreakInfo {
  return calculateRealStreak(projects, reviews, currentUser);
}
