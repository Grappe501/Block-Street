import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { CAMPUS_GOAL_FORMULA_VERSION, SUPERSEDED_FLAT_25_RULE } from "@/lib/field-goals/campus-goals";

export const metadata = {
  title: "Field Plan KPIs — soft beta",
};

export default function FieldPlanKpisPage() {
  return (
    <MeetingChrome
      title="KPIs"
      subtitle="Campus civic goals use enrollment share of county VAP. Flat 25% is superseded and must not reappear as active guidance."
      eyebrow="Soft beta · Field Plan"
    >
      <p className="mb-4 text-sm">
        <Link href="/field-plan" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Field Plan library
        </Link>
      </p>
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p>
          Active formula version:{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{CAMPUS_GOAL_FORMULA_VERSION}</code>
        </p>
        <p className="mt-2 text-xs text-slate-500">Superseded (do not use): {SUPERSEDED_FLAT_25_RULE}</p>
        <p className="mt-3">
          College Command exposes honesty about these figures. VAP may be estimated until ACS replaces it — soft beta never
          labels estimates as official ACS.
        </p>
      </div>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/admin/college-command" className="text-brand-800 underline-offset-2 hover:underline">
            College Command honesty →
          </Link>
        </li>
        <li>
          <Link href="/how-it-works/system-status" className="text-brand-800 underline-offset-2 hover:underline">
            System status →
          </Link>
        </li>
      </ul>
      <div className="mt-8">
        <HonestyPanel
          workingNow={[`Formula ${CAMPUS_GOAL_FORMULA_VERSION}`, "College Command shell"]}
          stillCompleting={["Broader Field Plan KPI wiring to every soft-beta seat"]}
        />
      </div>
    </MeetingChrome>
  );
}
