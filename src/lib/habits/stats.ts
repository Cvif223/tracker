import { addDaysISO, lastNDays, toISODate, todayISO } from "./dates";
import { eachDayOfInterval, parseISO, startOfWeek, subDays } from "date-fns";
import type { Completions, Habit } from "./types";

export function datesForHabit(completions: Completions, habitId: string): string[] {
  return Object.keys(completions[habitId] ?? {}).sort();
}

export function isDone(completions: Completions, habitId: string, iso: string): boolean {
  return Boolean(completions[habitId]?.[iso]);
}

export function currentStreak(
  completions: Completions,
  habitId: string,
  today = todayISO(),
): number {
  const map = completions[habitId] ?? {};
  let cursor = map[today] ? today : addDaysISO(today, -1);
  let streak = 0;
  while (map[cursor]) {
    streak += 1;
    cursor = addDaysISO(cursor, -1);
  }
  return streak;
}

export function longestStreak(completions: Completions, habitId: string): number {
  const dates = datesForHabit(completions, habitId);
  if (dates.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const prev = dates[i - 1];
    const curr = dates[i];
    if (prev && curr && addDaysISO(prev, 1) === curr) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

export function countInDays(
  completions: Completions,
  habitId: string,
  days: Date[],
): number {
  return days.reduce((sum, day) => sum + (isDone(completions, habitId, toISODate(day)) ? 1 : 0), 0);
}

export function rateInDays(
  completions: Completions,
  habitId: string,
  days: Date[],
): number {
  if (days.length === 0) return 0;
  return countInDays(completions, habitId, days) / days.length;
}

export function todayProgress(habits: Habit[], completions: Completions, today = todayISO()) {
  const done = habits.filter((habit) => isDone(completions, habit.id, today)).length;
  return { done, total: habits.length };
}

export function dayCompletionCount(
  habits: Habit[],
  completions: Completions,
  iso: string,
): number {
  return habits.reduce((sum, habit) => sum + (isDone(completions, habit.id, iso) ? 1 : 0), 0);
}

export function last30(completions: Completions, habitId: string, now = new Date()) {
  const days = lastNDays(30, now);
  const done = countInDays(completions, habitId, days);
  return { done, total: days.length, rate: days.length ? done / days.length : 0 };
}

export function heatmapDays(weeks = 16, now = new Date()): Date[] {
  const end = parseISO(todayISO(now));
  const start = startOfWeek(subDays(end, weeks * 7 - 1), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function motivationalLine(done: number, total: number): string {
  if (total === 0) return "Добавьте первую привычку — и начните серию.";
  if (done === 0) return "Сегодня ещё впереди.";
  if (done === total) return "День закрыт. Ритм держится.";
  if (done / total >= 0.6) return "Хороший ритм. Ещё немного.";
  return "Тихий старт. Продолжайте.";
}

export function greeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 5) return "Тихая ночь";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}
