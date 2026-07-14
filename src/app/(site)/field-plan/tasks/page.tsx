import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Field Plan tasks — soft beta",
};

export default function FieldPlanTasksPage() {
  return (
    <MeetingChrome
      title="Tasks"
      subtitle="Recurring and milestone task boards are awaiting fuller scaffolds. Soft beta uses first-24h / 7d / 30d lists on position pages instead."
      eyebrow="Soft beta · Field Plan"
    >
      <p className="mb-4 text-sm">
        <Link href="/field-plan" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Field Plan library
        </Link>
      </p>
      <p className="text-sm text-slate-700">
        L3 phase×place ops and durable task assignment are still completing. For tonight, use position readiness lists and
        the meeting checklist.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
            College positions (24h / 7d / 30d) →
          </Link>
        </li>
        <li>
          <Link
            href="/admin/college-command/meeting/july-14"
            className="text-brand-800 underline-offset-2 hover:underline"
          >
            July 14 meeting workspace →
          </Link>
        </li>
      </ul>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["Soft-beta position timeboxes", "Meeting checklist (localStorage)"]}
          stillCompleting={["Approved task templates bound to durable roles", "L3 ops boards"]}
        />
      </div>
    </MeetingChrome>
  );
}
