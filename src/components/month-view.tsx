import { ChevronLeft, ChevronRight } from "lucide-react";
import { HabitCheck } from "@/components/habit-check";
import { EmptyHabits } from "@/components/today-view";
import { Button } from "@/components/ui/button";
import { HABIT_COLOR_META, HEAT_LEVELS } from "@/lib/habits/colors";
import {
  addMonths,
  daysInMonth,
  formatLongDate,
  formatMonthTitle,
  isFutureDay,
  isSameDay,
  isToday,
  monthGrid,
  toISODate,
} from "@/lib/habits/dates";
import { countInDays, dayCompletionCount, isDone, rateInDays } from "@/lib/habits/stats";
import type { Completions, Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  habits: Habit[];
  completions: Completions;
  anchor: Date;
  selected: Date;
  onAnchorChange: (next: Date) => void;
  onSelect: (day: Date) => void;
  onToggle: (habitId: string, iso: string) => void;
  onOpen: (habit: Habit) => void;
}

export function MonthView({
  habits,
  completions,
  anchor,
  selected,
  onAnchorChange,
  onSelect,
  onToggle,
  onOpen,
}: MonthViewProps) {
  const cells = monthGrid(anchor);
  const inMonth = daysInMonth(anchor);
  const selectedIso = toISODate(selected);
  const selectedFuture = isFutureDay(selected);
  const weekdayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  if (habits.length === 0) return <EmptyHabits />;

  const totalPossible = habits.length * inMonth.filter((day) => !isFutureDay(day)).length;
  const totalDone = inMonth.reduce(
    (sum, day) => sum + dayCompletionCount(habits, completions, toISODate(day)),
    0,
  );
  const monthRate = totalPossible ? Math.round((totalDone / totalPossible) * 100) : 0;

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Предыдущий месяц"
          onClick={() => onAnchorChange(addMonths(anchor, -1))}
        >
          <ChevronLeft />
        </Button>
        <div className="text-center">
          <p className="font-display text-lg font-medium capitalize">{formatMonthTitle(anchor)}</p>
          <p className="text-sm text-muted tabular-nums">{monthRate}% закрыто</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Следующий месяц"
          onClick={() => onAnchorChange(addMonths(anchor, 1))}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] sm:p-4">
        <div className="grid grid-cols-7 gap-1">
          {weekdayLabels.map((label) => (
            <p
              key={label}
              className="pb-2 text-center text-xs font-medium tracking-wide text-muted uppercase"
            >
              {label}
            </p>
          ))}
          {cells.map((day) => {
            const iso = toISODate(day);
            const outside = day.getMonth() !== anchor.getMonth();
            const count = dayCompletionCount(habits, completions, iso);
            const level =
              habits.length === 0
                ? 0
                : Math.min(4, Math.round((count / Math.max(habits.length, 1)) * 4));
            const selectedDay = isSameDay(day, selected);
            const future = isFutureDay(day);
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelect(day)}
                disabled={outside}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-md text-sm tabular-nums transition-[background-color,box-shadow] duration-150",
                  outside && "invisible",
                  !outside && HEAT_LEVELS[level],
                  !outside && level >= 3 && "text-primary-foreground",
                  !outside && level < 3 && "text-foreground",
                  !outside && selectedDay && "ring-2 ring-foreground ring-offset-2 ring-offset-surface",
                  !outside && isToday(day) && !selectedDay && "ring-1 ring-primary",
                  !outside && future && "opacity-50",
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 text-xs text-muted">
          <span>Меньше</span>
          {HEAT_LEVELS.map((cls) => (
            <span key={cls} className={cn("size-2.5 rounded-xs", cls)} />
          ))}
          <span>Больше</span>
        </div>
      </div>

      <section className="grid gap-3">
        <div>
          <h2 className="font-display text-xl font-medium capitalize tracking-tight">
            {formatLongDate(selected)}
          </h2>
          <p className="text-sm text-muted">
            {selectedFuture
              ? "Этот день ещё не наступил."
              : `${dayCompletionCount(habits, completions, selectedIso)} из ${habits.length} привычек`}
          </p>
        </div>
        <ul className="grid gap-2">
          {habits.map((habit) => {
            const meta = HABIT_COLOR_META[habit.color];
            const monthDone = countInDays(completions, habit.id, inMonth);
            const rate = Math.round(rateInDays(completions, habit.id, inMonth) * 100);
            return (
              <li
                key={habit.id}
                className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2 shadow-[var(--shadow-border)]"
              >
                <span className={cn("size-2.5 shrink-0 rounded-full", meta.swatch)} />
                <button
                  type="button"
                  onClick={() => onOpen(habit)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium">{habit.name}</p>
                  <p className="text-xs text-muted tabular-nums">
                    {monthDone} дн · {rate}% за месяц
                  </p>
                </button>
                <HabitCheck
                  color={habit.color}
                  checked={isDone(completions, habit.id, selectedIso)}
                  disabled={selectedFuture}
                  onToggle={() => onToggle(habit.id, selectedIso)}
                  label={`${habit.name}, ${selectedIso}`}
                  size="sm"
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
