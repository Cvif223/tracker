import type { HabitColor } from "./types";

export const HABIT_COLOR_META: Record<
  HabitColor,
  { label: string; swatch: string; fill: string; soft: string; ring: string }
> = {
  sage: {
    label: "Шалфей",
    swatch: "bg-habit-sage",
    fill: "bg-habit-sage text-primary-foreground",
    soft: "bg-habit-sage/15 text-habit-sage",
    ring: "ring-habit-sage",
  },
  terracotta: {
    label: "Терракота",
    swatch: "bg-habit-terracotta",
    fill: "bg-habit-terracotta text-primary-foreground",
    soft: "bg-habit-terracotta/15 text-habit-terracotta",
    ring: "ring-habit-terracotta",
  },
  slate: {
    label: "Сланец",
    swatch: "bg-habit-slate",
    fill: "bg-habit-slate text-primary-foreground",
    soft: "bg-habit-slate/15 text-habit-slate",
    ring: "ring-habit-slate",
  },
  forest: {
    label: "Лес",
    swatch: "bg-habit-forest",
    fill: "bg-habit-forest text-primary-foreground",
    soft: "bg-habit-forest/15 text-habit-forest",
    ring: "ring-habit-forest",
  },
  clay: {
    label: "Глина",
    swatch: "bg-habit-clay",
    fill: "bg-habit-clay text-primary-foreground",
    soft: "bg-habit-clay/15 text-habit-clay",
    ring: "ring-habit-clay",
  },
  ocean: {
    label: "Океан",
    swatch: "bg-habit-ocean",
    fill: "bg-habit-ocean text-primary-foreground",
    soft: "bg-habit-ocean/15 text-habit-ocean",
    ring: "ring-habit-ocean",
  },
  stone: {
    label: "Камень",
    swatch: "bg-habit-stone",
    fill: "bg-habit-stone text-primary-foreground",
    soft: "bg-habit-stone/15 text-habit-stone",
    ring: "ring-habit-stone",
  },
  ink: {
    label: "Чернила",
    swatch: "bg-habit-ink",
    fill: "bg-habit-ink text-primary-foreground",
    soft: "bg-habit-ink/15 text-habit-ink",
    ring: "ring-habit-ink",
  },
};

export const HEAT_LEVELS = [
  "bg-surface-2",
  "bg-habit-sage/25",
  "bg-habit-sage/45",
  "bg-habit-sage/70",
  "bg-habit-sage",
] as const;
