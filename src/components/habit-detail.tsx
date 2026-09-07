import { Pencil, Trash2 } from "lucide-react";
import { HabitCheck } from "@/components/habit-check";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HABIT_COLOR_META } from "@/lib/habits/colors";
import { isFutureDay, toISODate, todayISO } from "@/lib/habits/dates";
import {
  currentStreak,
  heatmapDays,
  isDone,
  last30,
  longestStreak,
} from "@/lib/habits/stats";
import type { Completions, Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface HabitDetailProps {
  habit: Habit | null;
  completions: Completions;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  onToggle: (habitId: string, iso: string) => void;
}

export function HabitDetail({
  habit,
  completions,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onToggle,
}: HabitDetailProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  if (!habit) return null;

  const today = todayISO();
  const streak = currentStreak(completions, habit.id, today);
  const best = longestStreak(completions, habit.id);
  const month = last30(completions, habit.id);
  const heat = heatmapDays(16);
  const meta = HABIT_COLOR_META[habit.color];
  const doneToday = isDone(completions, habit.id, today);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-start gap-3 pr-6">
              <span className={cn("mt-1 size-3 shrink-0 rounded-full", meta.swatch)} />
              <div className="min-w-0">
                <DialogTitle>{habit.name}</DialogTitle>
                <DialogDescription>
                  {habit.note || "Ежедневная привычка"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Сегодня</p>
              <p className="font-display text-lg font-medium">
                {doneToday ? "Отмечено" : "Ещё нет"}
              </p>
            </div>
            <HabitCheck
              color={habit.color}
              checked={doneToday}
              onToggle={() => onToggle(habit.id, today)}
              label={`Отметить «${habit.name}» сегодня`}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Stat label="Серия" value={streak} suffix="дн" />
            <Stat label="Рекорд" value={best} suffix="дн" />
            <Stat label="30 дней" value={Math.round(month.rate * 100)} suffix="%" />
          </div>

          <div className="grid gap-2">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              Последние 16 недель
            </p>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {heat.map((day) => {
                const iso = toISODate(day);
                const marked = isDone(completions, habit.id, iso);
                const future = isFutureDay(day);
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={future}
                    title={iso}
                    aria-label={`${iso}${marked ? ", отмечено" : ""}`}
                    onClick={() => onToggle(habit.id, iso)}
                    className={cn(
                      "size-3.5 rounded-xs transition-colors duration-150",
                      future && "opacity-30",
                      marked ? meta.swatch : "bg-surface-2",
                    )}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onEdit(habit);
              }}
            >
              <Pencil />
              Изменить
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 />
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить привычку?</AlertDialogTitle>
            <AlertDialogDescription>
              «{habit.name}» и вся её серия будут удалены с этого устройства.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(habit);
                setConfirmOpen(false);
                onOpenChange(false);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Stat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-md bg-secondary px-3 py-3">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="font-display text-2xl font-medium tabular-nums tracking-tight">
        {value}
        <span className="ml-1 text-sm font-sans font-medium text-muted">{suffix}</span>
      </p>
    </div>
  );
}
