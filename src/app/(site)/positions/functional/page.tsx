import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Functional positions — soft beta",
};

export default function FunctionalPositionsPage() {
  return (
    <MeetingChrome
      title="Functional positions"
      subtitle="Functional and area command shells exist — a full soft-beta seat catalog for every function is still completing."
    >
      <p className="text-sm text-slate-700">
        Browse leader and committee shells while we finish an approved functional roster. College Team seats are ready for
        interest today.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
            College Team seats →
          </Link>
        </li>
        <li>
          <Link href="/admin/volunteer-command" className="text-brand-800 underline-offset-2 hover:underline">
            Volunteer Command →
          </Link>
        </li>
        <li>
          <Link href="/field-plan/positions" className="text-brand-800 underline-offset-2 hover:underline">
            Field Plan → positions library →
          </Link>
        </li>
        <li>
          <Link href="/positions" className="text-brand-800 underline-offset-2 hover:underline">
            ← Back to positions catalog
          </Link>
        </li>
      </ul>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["Leader / committee shells", "Field Plan position mapping (approved sources)"]}
          stillCompleting={["Soft-beta functional seat catalog with full drill-downs"]}
        />
      </div>
    </MeetingChrome>
  );
}
