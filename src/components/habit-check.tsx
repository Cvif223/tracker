import { Check } from "lucide-react";
import { HABIT_COLOR_META } from "@/lib/habits/colors";
import type { HabitColor } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

interface HabitCheckProps {
  color: HabitColor;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label: string;
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: "size-8",
  md: "size-11",
  lg: "size-12",
};

export function HabitCheck({
  color,
  checked,
  disabled,
  onToggle,
  label,
  size = "md",
}: HabitCheckProps) {
  const meta = HABIT_COLOR_META[color];
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={checked}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border transition-[background-color,border-color,transform,box-shadow] duration-150 ease-out",
        SIZE[size],
        checked
          ? cn(meta.fill, "border-transparent")
          : "border-border-strong bg-surface text-transparent hover:border-foreground/40",
        disabled && "opacity-35",
        !disabled && "active:scale-[0.96]",
      )}
    >
      <Check
        className={cn(
          "size-4 transition-[opacity,transform] duration-150 ease-out",
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
        strokeWidth={2.5}
      />
    </button>
  );
}
