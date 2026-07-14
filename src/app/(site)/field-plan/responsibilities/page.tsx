import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Field Plan responsibilities — soft beta",
};

export default function FieldPlanResponsibilitiesPage() {
  return (
    <MeetingChrome
      title="Responsibilities"
      subtitle="Browse the approved Field Strategy manual and responsibility library work — we do not invent Field Plan doctrine on soft-beta pages."
      eyebrow="Soft beta · Field Plan"
    >
      <p className="mb-4 text-sm">
        <Link href="/field-plan" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Field Plan library
        </Link>
      </p>
      <ul className="mt-2 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/field-strategy" className="text-brand-800 underline-offset-2 hover:underline">
            Field Strategy manual →
          </Link>
        </li>
        <li>
          <Link href="/field-strategy/field-teams" className="text-brand-800 underline-offset-2 hover:underline">
            Field teams section →
          </Link>
        </li>
        <li>
          <span className="font-normal text-slate-700">
            Approved responsibility library continues under Field Plan data ingest — browse sources when available; soft
            beta college pages label responsibilities as provisional.
          </span>
        </li>
      </ul>
    </MeetingChrome>
  );
}
