import Link from "next/link";

export function DailyBriefCard({ href }: { href: string }) {
  return (
    <div className="card">
      <h2 className="text-sm font-bold uppercase tracking-wide text-teal-800">Today&apos;s Brief</h2>
      <p className="mt-2 text-sm text-slate-600">
        Your daily summary of conversations, decisions, meetings, and action items.
      </p>
      <Link href={href} className="btn-primary mt-3 inline-block text-sm">
        Open Today&apos;s Brief
      </Link>
    </div>
  );
}
