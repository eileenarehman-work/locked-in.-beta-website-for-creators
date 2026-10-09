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

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatDateLocal(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date N days before a reference date (at local midnight)
 */
function getDaysAgo(refDate: Date, days: number): Date {
  const d = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());
  d.setDate(d.getDate() - days);
  return d;
}

export function calculateRealStreak(
  projects: Project[],
  reviews: Review[],
  currentUser: User | null,
  loginDates: string[] = []
): StreakInfo {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const todayStr = formatDateLocal(now);

  const getEmptyWeek = () => {
    const arr: DayStreakItem[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = getDaysAgo(now, i);
      const dateStr = formatDateLocal(d);
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
    if (d) {
      const clean = d.split('T')[0];
      activityDates.add(clean);
      activityCountsByDate[clean] = (activityCountsByDate[clean] || 0) + 1;
    }
  });

  // Since user is currently active/logged in, ensure today's login counts!
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

  const yesterdayDate = getDaysAgo(now, 1);
  const yesterdayStr = formatDateLocal(yesterdayDate);

  const isActiveToday = activityDates.has(todayStr);
  const isActiveYesterday = activityDates.has(yesterdayStr);

  // Calculate consecutive active days going backwards
  let currentStreak = 0;
  if (isActiveToday) {
    // Count today + previous consecutive days
    for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
      const targetDate = getDaysAgo(now, dayOffset);
      const targetStr = formatDateLocal(targetDate);
      if (activityDates.has(targetStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else if (isActiveYesterday) {
    // Yesterday was active, user hasn't logged in yet today
    for (let dayOffset = 1; dayOffset < 365; dayOffset++) {
      const targetDate = getDaysAgo(now, dayOffset);
      const targetStr = formatDateLocal(targetDate);
      if (activityDates.has(targetStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Active logged-in users are always at least Day 1 for today's session
  if (currentStreak === 0 && isActiveToday) {
    currentStreak = 1;
  }

  // Calculate longest historical streak
  let longestStreak = currentStreak;
  const ascendingDates = Array.from(activityDates).sort();
  if (ascendingDates.length > 0) {
    let tempStreak = 0;
    let prevTime: number | null = null;
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    for (const dStr of ascendingDates) {
      const [y, m, d] = dStr.split('-').map(Number);
      const curTime = new Date(y, m - 1, d).getTime();
      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((curTime - prevTime) / ONE_DAY_MS);
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevTime = curTime;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }
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
  for (let i = 6; i >= 0; i--) {
    const d = getDaysAgo(now, i);
    const dateStr = formatDateLocal(d);
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
    longestStreak: Math.max(longestStreak, currentStreak),
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
  reviews: Review[] = [],
  loginDates: string[] = []
): StreakInfo {
  return calculateRealStreak(projects, reviews, currentUser, loginDates);
}
