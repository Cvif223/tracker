import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { HabitCheck } from "@/components/habit-check";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HABIT_COLOR_META } from "@/lib/habits/colors";
import { currentStreak, isDone } from "@/lib/habits/stats";
import type { Completions, Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

interface TodayViewProps {
  habits: Habit[];
  completions: Completions;
  today: string;
  onToggle: (habitId: string, iso: string) => void;
  onOpen: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export function TodayView({
  habits,
  completions,
  today,
  onToggle,
  onOpen,
  onEdit,
  onDelete,
}: TodayViewProps) {
  if (habits.length === 0) return <EmptyHabits />;

  return (
    <ul className="grid gap-3">
      {habits.map((habit) => {
        const checked = isDone(completions, habit.id, today);
        const streak = currentStreak(completions, habit.id, today);
        const meta = HABIT_COLOR_META[habit.color];
        return (
          <li
            key={habit.id}
            className="flex items-center gap-3 rounded-xl bg-surface p-3 pr-2 shadow-[var(--shadow-border)]"
          >
            <span className={cn("h-10 w-1 shrink-0 rounded-full", meta.swatch)} />
            <button
              type="button"
              onClick={() => onOpen(habit)}
              className="min-w-0 flex-1 py-1 text-left"
            >
              <p className="truncate font-medium">{habit.name}</p>
              <p className="text-sm text-muted tabular-nums">
                {streak > 0 ? `Серия ${streak} дн` : "Серия ещё не начата"}
              </p>
            </button>
            <HabitCheck
              color={habit.color}
              checked={checked}
              onToggle={() => onToggle(habit.id, today)}
              label={`Отметить «${habit.name}»`}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Ещё">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onOpen(habit)}>Статистика</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onEdit(habit)}>
                  <Pencil />
                  Изменить
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => onDelete(habit)}>
                  <Trash2 />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        );
      })}
    </ul>
  );
}

export function EmptyHabits() {
  return (
    <div className="rounded-xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-border)]">
      <p className="font-display text-2xl font-medium tracking-tight">Пока тихо</p>
      <p className="mx-auto mt-2 max-w-sm text-muted">
        Добавьте первую привычку. Каждый день — одна отметка, и серия начнёт расти.
      </p>
    </div>
  );
}
