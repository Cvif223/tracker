import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSeed } from "./seed";
import { todayISO } from "./dates";
import type { Completions, Habit, HabitColor, HabitSnapshot } from "./types";

interface HabitState extends HabitSnapshot {
  hydrated: boolean;
  addHabit: (input: { name: string; note: string; color: HabitColor }) => string;
  updateHabit: (id: string, input: { name: string; note: string; color: HabitColor }) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, iso: string) => void;
  rehydrateStore: () => void;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readPersisted(): Partial<HabitSnapshot> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("ritm-habits-v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Partial<HabitSnapshot> } | Partial<HabitSnapshot>;
    if (parsed && typeof parsed === "object" && "state" in parsed) {
      return parsed.state ?? null;
    }
    return parsed as Partial<HabitSnapshot>;
  } catch {
    return null;
  }
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: {},
      hasSeeded: false,
      hydrated: false,
      addHabit: ({ name, note, color }) => {
        const id = newId();
        const habit: Habit = {
          id,
          name: name.trim(),
          note: note.trim(),
          color,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: [...state.habits, habit],
          completions: { ...state.completions, [id]: {} },
        }));
        return id;
      },
      updateHabit: (id, input) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  name: input.name.trim(),
                  note: input.note.trim(),
                  color: input.color,
                }
              : habit,
          ),
        }));
      },
      deleteHabit: (id) => {
        set((state) => {
          const { [id]: _removed, ...rest } = state.completions;
          return {
            habits: state.habits.filter((habit) => habit.id !== id),
            completions: rest,
          };
        });
      },
      toggleCompletion: (habitId, iso) => {
        if (iso > todayISO()) return;
        set((state) => {
          const current = state.completions[habitId] ?? {};
          const next: Record<string, true> = { ...current };
          if (next[iso]) delete next[iso];
          else next[iso] = true;
          return {
            completions: { ...state.completions, [habitId]: next },
          };
        });
      },
      rehydrateStore: () => {
        if (get().hydrated) return;
        const persisted = readPersisted();
        if (persisted?.hasSeeded) {
          set({
            habits: persisted.habits ?? [],
            completions: persisted.completions ?? {},
            hasSeeded: true,
            hydrated: true,
          });
          return;
        }
        const seed = createSeed();
        set({
          habits: seed.habits,
          completions: seed.completions,
          hasSeeded: true,
          hydrated: true,
        });
      },
    }),
    {
      name: "ritm-habits-v1",
      skipHydration: true,
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
        hasSeeded: state.hasSeeded,
      }),
    },
  ),
);

export function selectCompletions(state: HabitState): Completions {
  return state.completions;
}

if (typeof window !== "undefined") {
  useHabitStore.getState().rehydrateStore();
}

