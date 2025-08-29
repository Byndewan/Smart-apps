import type { Timestamp } from "firebase/firestore";

export interface Plan {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  steps: Step[];
}

export interface Step {
  id: string;
  title: string;
  specific: string;
  meaningful: string;
  achievable: string;
  rewarded: string;
  timeBound: Date;
  targets: Target[];
  habitTrackers: HabitTracker[];
}

export interface Target {
  id: string;
  description: string;
  completed: boolean;
}

export interface HabitTracker {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: (Date | Timestamp)[];
}