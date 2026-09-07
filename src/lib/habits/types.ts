export const HABIT_COLORS = [
  "sage",
  "terracotta",
  "slate",
  "forest",
  "clay",
  "ocean",
  "stone",
  "ink",
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];

export type ViewMode = "today" | "week" | "month";

export interface Habit {
  id: string;
  name: string;
  note: string;
  color: HabitColor;
  createdAt: string;
}

export type Completions = Record<string, Record<string, true>>;

export interface HabitSnapshot {
  habits: Habit[];
  completions: Completions;
  hasSeeded: boolean;
}
