import { ChevronLeft, ChevronRight } from "lucide-react";
import { HabitCheck } from "@/components/habit-check";
import { EmptyHabits } from "@/components/today-view";
import { Button } from "@/components/ui/button";
import { HABIT_COLOR_META } from "@/lib/habits/colors";
import {
  addDays,
  formatDayNumber,
  formatDayShort,
  formatWeekRange,
  isFutureDay,
  isToday,
  toISODate,
  weekDays,
} from "@/lib/habits/dates";
import { countInDays, currentStreak, isDone } from "@/lib/habits/stats";
import type { Completions, Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  habits: Habit[];
  completions: Completions;
  anchor: Date;
  today: string;
  onAnchorChange: (next: Date) => void;
  onToggle: (habitId: string, iso: string) => void;
  onOpen: (habit: Habit) => void;
}

export function WeekView({
  habits,
  completions,
  anchor,
  today,
  onAnchorChange,
  onToggle,
  onOpen,
}: WeekViewProps) {
  const days = weekDays(anchor);
  const isCurrent = days.some((day) => toISODate(day) === today);

  if (habits.length === 0) return <EmptyHabits />;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Предыдущая неделя"
          onClick={() => onAnchorChange(addDays(anchor, -7))}
        >
          <ChevronLeft />
        </Button>
        <div className="text-center">
          <p className="font-display text-lg font-medium capitalize">{formatWeekRange(days)}</p>
          {!isCurrent && (
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => onAnchorChange(new Date())}
            >
              К этой неделе
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Следующая неделя"
          onClick={() => onAnchorChange(addDays(anchor, 7))}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 px-1 sm:px-2">
        {days.map((day) => (
          <div key={toISODate(day)} className="text-center">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {formatDayShort(day)}
            </p>
            <p
              className={cn(
                "mx-auto mt-1 flex size-7 items-center justify-center rounded-full text-sm tabular-nums",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {formatDayNumber(day)}
            </p>
          </div>
        ))}
      </div>

      <ul className="grid gap-3">
        {habits.map((habit) => {
          const streak = currentStreak(completions, habit.id, today);
          const weekDone = countInDays(completions, habit.id, days);
          const meta = HABIT_COLOR_META[habit.color];
          return (
            <li
              key={habit.id}
              className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
            >
              <button
                type="button"
                onClick={() => onOpen(habit)}
                className="mb-3 flex w-full items-baseline justify-between gap-3 text-left"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className={cn("size-2.5 shrink-0 rounded-full", meta.swatch)} />
                  <span className="truncate font-medium">{habit.name}</span>
                </span>
                <span className="shrink-0 text-sm text-muted tabular-nums">
                  {weekDone}/7 · серия {streak}
                </span>
              </button>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const iso = toISODate(day);
                  const future = isFutureDay(day);
                  return (
                    <div key={iso} className="flex justify-center">
                      <HabitCheck
                        color={habit.color}
                        checked={isDone(completions, habit.id, iso)}
                        disabled={future}
                        onToggle={() => onToggle(habit.id, iso)}
                        label={`${habit.name}, ${iso}`}
                        size="sm"
                      />
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
