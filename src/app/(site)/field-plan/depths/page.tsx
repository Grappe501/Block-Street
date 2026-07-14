import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Field Plan depths — soft beta",
};

const LAYERS = [
  {
    id: "L0",
    name: "Doctrine & altitude",
    status: "Present",
    answers: "Why the campaign organizes this way",
    blocked: false,
  },
  {
    id: "L1",
    name: "Role narrative",
    status: "Partial",
    answers: "What each mapped seat owns (state-wide playbook)",
    blocked: false,
  },
  {
    id: "L2",
    name: "Geographic playbooks",
    status: "Need more depth",
    answers: "How Benton / Clark / cities adapt L1 — fill only from approved sources",
    blocked: false,
  },
  {
    id: "L3",
    name: "Phase × place ops",
    status: "Need more depth",
    answers: "Dated checklists, turf, shifts on a board",
    blocked: false,
  },
  {
    id: "L4",
    name: "Execution loop",
    status: "Blocked",
    answers: "Assign → evidence with durable RBAC — unlock after invite-chain CERTIFIED + Postgres/RBAC",
    blocked: true,
  },
];

export default function FieldPlanDepthsPage() {
  return (
    <MeetingChrome
      title="Depth layers L0–L4"
      subtitle="Language mirrors FIELD_PLAN_DEPTH_LAYERS — status-honest, no invented doctrine."
      eyebrow="Soft beta · Field Plan"
    >
      <p className="mb-6 text-sm">
        <Link href="/field-plan" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Field Plan library
        </Link>
      </p>
      <div className="space-y-3">
        {LAYERS.map((layer) => (
          <section
            key={layer.id}
            className={`rounded-lg border p-4 ${
              layer.blocked ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-950">
                {layer.id} · {layer.name}
              </h2>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {layer.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{layer.answers}</p>
            {layer.blocked ? (
              <p className="mt-2 text-sm font-semibold text-amber-900">
                L4 is blocked in soft beta. We do not claim invite CERTIFIED or durable execution loops.
              </p>
            ) : null}
          </section>
        ))}
      </div>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["L0 present", "L1 partial", "L2 Benton skeleton in docs/data"]}
          stillCompleting={["L3 depth", "L4 unlock conditions"]}
        />
      </div>
    </MeetingChrome>
  );
}
