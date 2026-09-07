import { addDaysISO, lastNDays, toISODate, todayISO } from "./dates";
import type { Completions, Habit, HabitColor } from "./types";

const SEED: Array<{ id: string; name: string; note: string; color: HabitColor; rate: number }> = [
  {
    id: "seed-move",
    name: "Утренняя зарядка",
    note: "10 минут, без телефона",
    color: "sage",
    rate: 0.82,
  },
  {
    id: "seed-read",
    name: "Чтение 20 минут",
    note: "Бумага или книга, не лента",
    color: "terracotta",
    rate: 0.7,
  },
  {
    id: "seed-water",
    name: "Вода",
    note: "Восемь стаканов за день",
    color: "ocean",
    rate: 0.88,
  },
  {
    id: "seed-sit",
    name: "Медитация",
    note: "Пять спокойных минут",
    color: "slate",
    rate: 0.54,
  },
  {
    id: "seed-sleep",
    name: "Без экрана перед сном",
    note: "Последний час — без телефона",
    color: "ink",
    rate: 0.61,
  },
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unit(seed: number): number {
  return (seed % 10000) / 10000;
}

export function createSeed(now = new Date()): { habits: Habit[]; completions: Completions } {
  const today = todayISO(now);
  const days = lastNDays(70, now);
  const createdAt = addDaysISO(today, -70);
  const habits: Habit[] = SEED.map((item) => ({
    id: item.id,
    name: item.name,
    note: item.note,
    color: item.color,
    createdAt,
  }));

  const completions: Completions = {};
  for (const item of SEED) {
    const map: Record<string, true> = {};
    for (const day of days) {
      const iso = toISODate(day);
      if (iso > today) continue;
      if (iso === today) continue;
      if (unit(hash(`${item.id}:${iso}`)) < item.rate) {
        map[iso] = true;
      }
    }
    completions[item.id] = map;
  }

  // Keep today partially open so the first visit feels actionable.
  const todayMarks = ["seed-water", "seed-move"];
  for (const id of todayMarks) {
    completions[id] = { ...completions[id], [today]: true };
  }

  // Guarantee a visible current streak on the movement habit.
  for (let i = 1; i <= 6; i += 1) {
    const iso = addDaysISO(today, -i);
    completions["seed-move"] = { ...completions["seed-move"], [iso]: true };
  }

  return { habits, completions };
}
