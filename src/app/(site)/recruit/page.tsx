import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Recruit — soft beta",
};

const STEPS = [
  "Listen first — what’s already on their mind about school, power, and the election season.",
  "Share why you’re organizing — collective power, not a hard sell.",
  "Name a clear next step — explore, interest, seat, or Power of 5.",
  "Invite with care — soft beta is not CERTIFIED invite activation.",
  "Follow up once with warmth — thank them and leave the door open.",
];

export default function RecruitPage() {
  return (
    <MeetingChrome
      title="Recruit"
      subtitle="A five-step welcoming method for soft beta. Guardrail: never pressure, never invent appointments, never claim invite CERTIFIED."
    >
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-semibold">Guardrail</p>
        <p className="mt-1">
          Soft beta welcomes interest. It does not assign personnel, certify invites, or restore flat 25% campus goals.
        </p>
      </div>

      <div className="mt-8">
        <MeetingLinkList
          items={[
            { href: "/recruit/conversation", label: "Conversation", note: "What to say in person" },
            { href: "/recruit/text", label: "Text", note: "Short message patterns" },
            { href: "/recruit/follow-up", label: "Follow-up", note: "One warm check-in" },
            { href: "/recruit/college", label: "College", note: "Campus-specific framing" },
            { href: "/recruit/power-of-5", label: "Power of 5", note: "Tie recruits to five seats" },
          ]}
        />
      </div>

      <div className="mt-8">
        <HonestyPanel
          workingNow={["Conversation / text / follow-up guides", "Links into Power of 5 planner"]}
          stillCompleting={["Durable recruitment CRM", "CERTIFIED invite outcomes"]}
        />
      </div>

      <p className="mt-6 text-sm">
        <Link href="/power-of-5" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          Power of 5 home →
        </Link>
      </p>
    </MeetingChrome>
  );
}
