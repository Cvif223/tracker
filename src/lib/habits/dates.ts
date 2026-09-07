import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { ru } from "date-fns/locale";

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromISODate(iso: string): Date {
  return parseISO(iso);
}

export function todayISO(now = new Date()): string {
  return toISODate(now);
}

export function addDaysISO(iso: string, amount: number): string {
  return toISODate(addDays(parseISO(iso), amount));
}

export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export function monthGrid(anchor: Date): Date[] {
  const start = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
  const end = addDays(start, 41);
  return eachDayOfInterval({ start, end });
}

export function daysInMonth(anchor: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(anchor),
    end: endOfMonth(anchor),
  });
}

export function lastNDays(n: number, end = new Date()): Date[] {
  const last = parseISO(todayISO(end));
  return eachDayOfInterval({ start: subDays(last, n - 1), end: last });
}

export function formatDayShort(date: Date): string {
  return format(date, "EEEEEE", { locale: ru });
}

export function formatDayNumber(date: Date): string {
  return format(date, "d");
}

export function formatMonthTitle(date: Date): string {
  return format(date, "LLLL yyyy", { locale: ru });
}

export function formatLongDate(date: Date): string {
  return format(date, "EEEE, d MMMM", { locale: ru });
}

export function formatWeekRange(days: Date[]): string {
  const first = days[0];
  const last = days[days.length - 1];
  if (!first || !last) return "";
  if (first.getMonth() === last.getMonth()) {
    return `${format(first, "d")}–${format(last, "d MMMM", { locale: ru })}`;
  }
  return `${format(first, "d MMM", { locale: ru })} – ${format(last, "d MMM", { locale: ru })}`;
}

export function isFutureDay(date: Date, now = new Date()): boolean {
  return toISODate(date) > toISODate(now);
}

export function isSameISO(a: string, b: string): boolean {
  return a === b;
}

export { isToday, isSameDay, addMonths, startOfMonth, addDays };
