import { Plus } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { HabitDetail } from "@/components/habit-detail";
import { HabitForm } from "@/components/habit-form";
import { MonthView } from "@/components/month-view";
import { TodayView } from "@/components/today-view";
import { WeekView } from "@/components/week-view";
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
import { formatLongDate, startOfMonth, todayISO } from "@/lib/habits/dates";
import { greeting, motivationalLine, todayProgress } from "@/lib/habits/stats";
import { useHabitStore } from "@/lib/habits/store";
import type { Habit, HabitColor, ViewMode } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: "today", label: "Сегодня" },
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
];

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function HabitApp() {
  const isClient = useIsClient();
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);

  const [now] = useState(() => new Date());
  const [view, setView] = useState<ViewMode>("today");
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [detail, setDetail] = useState<Habit | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Habit | null>(null);

  const today = todayISO(now);
  const progress = useMemo(
    () => todayProgress(habits, completions, today),
    [habits, completions, today],
  );
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  function handleToggle(habitId: string, iso: string) {
    toggleCompletion(habitId, iso);
  }

  function handleSubmit(input: { name: string; note: string; color: HabitColor }) {
    if (editing) {
      updateHabit(editing.id, input);
      toast("Привычка обновлена");
      setEditing(null);
      return;
    }
    addHabit(input);
    toast("Привычка добавлена");
  }

  function confirmDelete(habit: Habit) {
    deleteHabit(habit.id);
    toast("Привычка удалена");
    setPendingDelete(null);
    if (detail?.id === habit.id) setDetail(null);
  }

  if (!isClient) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8">
        <p className="font-display text-3xl font-medium tracking-tight">Ритм</p>
        <div className="mt-8 h-20 rounded-xl bg-surface-2" />
        <div className="mt-6 grid gap-3">
          <div className="h-16 rounded-xl bg-surface-2" />
          <div className="h-16 rounded-xl bg-surface-2" />
          <div className="h-16 rounded-xl bg-surface-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pt-6 pb-24 sm:pt-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-medium tracking-tight">Ритм</p>
          <p className="mt-1 text-sm text-muted">
            {greeting(now)} · {formatLongDate(now)}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="shrink-0"
          aria-label="Добавить привычку"
        >
          <Plus />
          <span className="hidden sm:inline">Привычка</span>
        </Button>
      </header>

      <section className="mt-8 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Сегодня</p>
            <p className="font-display text-3xl font-medium tabular-nums tracking-tight">
              {progress.done}
              <span className="text-xl text-muted"> / {progress.total}</span>
            </p>
          </div>
          <p className="max-w-56 text-right text-sm text-muted">
            {motivationalLine(progress.done, progress.total)}
          </p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      <nav className="mt-6 flex rounded-lg bg-secondary p-1" aria-label="Вид">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={cn(
              "h-10 flex-1 rounded-md text-sm font-medium transition-[background-color,color,box-shadow] duration-150",
              view === item.id
                ? "bg-surface text-foreground shadow-[var(--shadow-border)]"
                : "text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="mt-6 flex-1">
        {view === "today" && (
          <TodayView
            habits={habits}
            completions={completions}
            today={today}
            onToggle={handleToggle}
            onOpen={setDetail}
            onEdit={(habit) => {
              setEditing(habit);
              setFormOpen(true);
            }}
            onDelete={setPendingDelete}
          />
        )}
        {view === "week" && (
          <WeekView
            habits={habits}
            completions={completions}
            anchor={weekAnchor}
            today={today}
            onAnchorChange={setWeekAnchor}
            onToggle={handleToggle}
            onOpen={setDetail}
          />
        )}
        {view === "month" && (
          <MonthView
            habits={habits}
            completions={completions}
            anchor={monthAnchor}
            selected={selectedDay}
            onAnchorChange={(next) => {
              const start = startOfMonth(next);
              setMonthAnchor(start);
              const current = new Date();
              if (
                start.getMonth() === current.getMonth() &&
                start.getFullYear() === current.getFullYear()
              ) {
                setSelectedDay(current);
              } else {
                setSelectedDay(start);
              }
            }}
            onSelect={setSelectedDay}
            onToggle={handleToggle}
            onOpen={setDetail}
          />
        )}
      </main>

      <HabitForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        habit={editing}
        onSubmit={handleSubmit}
      />

      <HabitDetail
        habit={detail}
        completions={completions}
        open={Boolean(detail)}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        onEdit={(habit) => {
          setEditing(habit);
          setFormOpen(true);
        }}
        onDelete={setPendingDelete}
        onToggle={handleToggle}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить привычку?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `«${pendingDelete.name}» и вся её серия будут удалены с этого устройства.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => pendingDelete && confirmDelete(pendingDelete)}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
