import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { CAMPUS_GOAL_FORMULA_VERSION } from "@/lib/field-goals/campus-goals";

export const metadata = {
  title: "System status — soft beta",
};

export default function SystemStatusPage() {
  return (
    <MeetingChrome
      title="System status"
      subtitle="We serve you better when we tell the truth about readiness."
    >
      <p className="mb-6 text-sm">
        <Link href="/how-it-works" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← How it works
        </Link>
      </p>

      <HonestyPanel
        workingNow={[
          "July 14 presentation + meeting workspace checklist (local)",
          "College position catalog and soft-beta interest form",
          "Power of 5 five-seat planner (browser-local)",
          `Campus goals formula: ${CAMPUS_GOAL_FORMULA_VERSION}`,
          "Recruit conversation guides",
        ]}
        stillCompleting={[
          "Invite chain CERTIFIED — not claimed in soft beta",
          "Durable role appointments and Postgres RBAC",
          "Field Plan L3 phase×place boards",
          "Field Plan L4 execution loop (blocked until durability + invite certification)",
          "Deep county / functional seat catalogs",
        ]}
      />

      <p className="mt-6 text-sm text-slate-600">
        Campus registration goals use enrollment share of county voting-age population — not a flat 25% rule.
        VAP figures may be estimated until ACS replaces them.
      </p>
    </MeetingChrome>
  );
}
