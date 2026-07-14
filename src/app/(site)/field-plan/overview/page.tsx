import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Field Plan overview — soft beta",
};

export default function FieldPlanOverviewPage() {
  return (
    <MeetingChrome
      title="Field Plan overview"
      subtitle="The Field Plan answers why we organize this way, what seats own, and how place and phase deepen the work — filled only from approved campaign sources."
      eyebrow="Soft beta · Field Plan"
    >
      <p className="mb-4 text-sm">
        <Link href="/field-plan" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Field Plan library
        </Link>
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>L0 — Doctrine & altitude: why the campaign organizes this way (present).</li>
        <li>L1 — Role narrative: what mapped seats own (partial).</li>
        <li>L2 — Geographic playbooks: how places adapt L1 (skeleton; deepen from approved sources).</li>
        <li>L3 — Phase × place ops: dated checklists and boards (still need depth).</li>
        <li>L4 — Execution loop: assign → evidence with durable RBAC (blocked).</li>
      </ul>
      <p className="mt-6 text-sm text-slate-600">
        Soft-beta meeting pages link here for context — they do not invent Field Plan doctrine for college seats.
      </p>
    </MeetingChrome>
  );
}
