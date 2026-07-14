import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Field Plan positions — soft beta",
};

export default function FieldPlanPositionsPage() {
  return (
    <MeetingChrome
      title="Field Plan · positions"
      subtitle="Soft-beta meeting seats live in the positions catalog. Approved Field Plan mapping continues separately — no invented doctrine here."
      eyebrow="Soft beta · Field Plan"
    >
      <p className="mb-4 text-sm">
        <Link href="/field-plan" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Field Plan library
        </Link>
      </p>
      <p className="text-sm text-slate-700">
        Browse College Team open seats for tonight&apos;s agenda roles. County and functional catalogs are still awaiting
        deeper roster pages.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/positions" className="text-brand-800 underline-offset-2 hover:underline">
            Open positions catalog →
          </Link>
        </li>
        <li>
          <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
            College Team seats →
          </Link>
        </li>
      </ul>
    </MeetingChrome>
  );
}
