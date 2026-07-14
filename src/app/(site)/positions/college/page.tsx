import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { COLLEGE_POSITIONS } from "@/lib/meeting/positions-catalog";

export const metadata = {
  title: "College Team positions — soft beta",
};

export default function CollegePositionsPage() {
  return (
    <MeetingChrome
      title="College Team"
      subtitle="Campus seats from tonight’s agenda: social, voter registration, community, events, and outreach. Each campus shapes the work for its community."
    >
      <p className="mb-4 text-sm">
        <Link href="/positions" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← All positions
        </Link>
      </p>
      <MeetingLinkList
        items={COLLEGE_POSITIONS.map((p) => ({
          href: `/positions/${p.id}`,
          label: p.title,
          note: `Reports toward ${p.reportsTo}`,
        }))}
      />
      <p className="mt-6 text-sm text-slate-600">
        Command shell:{" "}
        <Link href="/admin/college-command" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          College Command
        </Link>
      </p>
    </MeetingChrome>
  );
}
