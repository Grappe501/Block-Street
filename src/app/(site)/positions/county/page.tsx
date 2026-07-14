import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "County positions — soft beta",
};

export default function CountyPositionsPage() {
  return (
    <MeetingChrome
      title="County positions"
      subtitle="A deeper county roster is still arriving. For now, start with College Team seats or browse county volunteer-command shells."
    >
      <p className="text-sm text-slate-700">
        We&apos;re waiting on a fuller county position roster before publishing seat-by-seat pages here.
        County Volunteer Command boards remain available as shells — without fabricated personnel.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
            Browse College Team seats →
          </Link>
        </li>
        <li>
          <Link href="/admin/volunteer-command" className="text-brand-800 underline-offset-2 hover:underline">
            Volunteer Command →
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
          workingNow={["Volunteer Command county shells", "County field goals"]}
          stillCompleting={["Published county seat catalog for this soft-beta path"]}
        />
      </div>
    </MeetingChrome>
  );
}
