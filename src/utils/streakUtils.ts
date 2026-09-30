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
}

export function calculateRealStreak(
  projects: Project[],
  reviews: Review[],
  currentUser: User | null
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

  // If no user or no activities, streak is 0
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
        description: 'Drop a build or evaluate a peer to start day 1 of your streak!',
      },
    };
  }

  // Filter activities belonging to current user
  const userProjects = projects.filter((p) => p.authorId === currentUser.id);
  const userReviews = reviews.filter((r) => r.reviewerId === currentUser.id);
  const totalContributions = userProjects.length + userReviews.length;

  if (totalContributions === 0) {
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
        description: 'Drop a build or evaluate a peer to start day 1 of your streak!',
      },
    };
  }

  // Collect unique dates (YYYY-MM-DD)
  const activityDates = new Set<string>();
  userProjects.forEach((p) => {
    if (p.createdAt) activityDates.add(p.createdAt.split('T')[0]);
  });
  userReviews.forEach((r) => {
    if (r.createdAt) activityDates.add(r.createdAt.split('T')[0]);
  });

  const sortedDates = Array.from(activityDates).sort().reverse();
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const isActiveToday = activityDates.has(todayStr);
  const isActiveYesterday = activityDates.has(yesterdayStr);

  let currentStreak = 0;
  if (isActiveToday || isActiveYesterday) {
    let checkDate = isActiveToday ? new Date() : yesterday;
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (activityDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Next milestone determination
  let nextMilestone = { days: 3, title: '3-Day Maker Spark', description: 'Light your maker flame.' };
  if (currentStreak >= 3 && currentStreak < 7) {
    nextMilestone = { days: 7, title: '7-Day Sprint', description: '1 full week of continuous building & peer review.' };
  } else if (currentStreak >= 7 && currentStreak < 14) {
    nextMilestone = { days: 14, title: '14-Day Momentum', description: 'Unstoppable consistency across maker disciplines.' };
  } else if (currentStreak >= 14 && currentStreak < 30) {
    nextMilestone = { days: 30, title: '30-Day Master', description: 'A legend of hands-on daily execution.' };
  } else if (currentStreak >= 30) {
    nextMilestone = { days: 60, title: '60-Day Titan', description: 'Top 1% discipline in the maker collective.' };
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
    
    // Count user activities on this specific date
    let count = 0;
    userProjects.forEach((p) => {
      if (p.createdAt && p.createdAt.startsWith(dateStr)) count++;
    });
    userReviews.forEach((r) => {
      if (r.createdAt && r.createdAt.startsWith(dateStr)) count++;
    });

    pastWeek.push({
      date: dateStr,
      dayLabel: dayLabels[dayOfWeek].slice(0, 1),
      fullDayName: dayLabels[dayOfWeek],
      hasActivity: count > 0,
      isToday,
      activityCount: count,
    });
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, sortedDates.length > 0 ? currentStreak : 0),
    totalContributions,
    lastActiveDate: sortedDates[0] || null,
    isActiveToday,
    pastWeek,
    nextMilestone,
  };
}
