export enum SubjectType {
  ALL = 'Tất cả',
  PHYSICS = 'Vật lý',
  CHEMISTRY = 'Hóa học',
  BIOLOGY = 'Sinh học',
  MATH = 'Toán học',
  EARTH_SCIENCE = 'KH Trái đất'
}

export interface Simulation {
  id: string;
  title: string;
  description: string;
  subject: SubjectType;
  thumbnailUrl: string;
  popularity: number; // 0-5 stars
  isNew?: boolean;
  masteryLevel?: number; // 0-100% - Progress tracking (Section 2.2)
}

export interface UserProfile {
  id: string;
  username: string; // Public ID
  name: string; // Display Name
  email?: string; // Contact/Recovery Email (Optional)
  avatarUrl: string;
  streakDays: number; // The Streak Mechanic (Section 2.2.1)
  xp: number;
  level: number;
  isStreakFrozen: boolean; // Streak Freeze mechanic
}