import { Suspense } from "react";
import { PersonalHomeShell } from "@/components/person-home/PersonalHomeShell";

export const metadata = {
  title: "Home — Block Street",
  description: "Your personal operating loop — place, team, next action, and committee connection",
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-500">Loading…</div>}>
      <PersonalHomeShell />
    </Suspense>
  );
}
