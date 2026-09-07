import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HABIT_COLOR_META } from "@/lib/habits/colors";
import { HABIT_COLORS, type Habit, type HabitColor } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSubmit: (input: { name: string; note: string; color: HabitColor }) => void;
}

export function HabitForm({ open, onOpenChange, habit, onSubmit }: HabitFormProps) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState<HabitColor>("sage");

  useEffect(() => {
    if (open) {
      setName(habit?.name ?? "");
      setNote(habit?.note ?? "");
      setColor(habit?.color ?? "sage");
    }
  }, [open, habit]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({ name: trimmed, note: note.trim(), color });
    onOpenChange(false);
  }

  const isEdit = Boolean(habit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Изменить привычку" : "Новая привычка"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Имя, цвет и короткая заметка. Серия сохранится."
                : "Короткое имя и цвет — этого достаточно, чтобы начать серию."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="habit-name">Название</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Например, утренняя зарядка"
              maxLength={48}
              autoFocus
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="habit-note">Заметка</Label>
            <Input
              id="habit-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Необязательно"
              maxLength={80}
            />
          </div>

          <div className="grid gap-2">
            <Label>Цвет</Label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((value) => {
                const meta = HABIT_COLOR_META[value];
                const selected = color === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={meta.label}
                    aria-pressed={selected}
                    onClick={() => setColor(value)}
                    className={cn(
                      "size-9 rounded-full transition-[transform,box-shadow] duration-150",
                      meta.swatch,
                      selected
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                        : "opacity-80 hover:opacity-100",
                    )}
                  />
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {isEdit ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
