import { createFileRoute } from "@tanstack/react-router";
import { HabitApp } from "@/components/habit-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HabitApp />;
}
