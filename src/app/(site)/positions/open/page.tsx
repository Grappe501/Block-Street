import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { listOpenCollegePositions } from "@/lib/meeting/positions-catalog";

export const metadata = {
  title: "Open seats — soft beta",
};

export default function OpenPositionsPage() {
  const open = listOpenCollegePositions();
  return (
    <MeetingChrome
      title="Open seats"
      subtitle="Every seat below is open in soft beta. We’re glad you’re looking — take a role that fits, or help recruit for one."
    >
      <p className="mb-4 text-sm">
        <Link href="/positions" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← All positions
        </Link>
      </p>
      <MeetingLinkList
        items={open.map((p) => ({
          href: `/positions/${p.id}`,
          label: p.title,
          note: p.primaryContribution,
        }))}
      />
      <p className="mt-6 text-sm text-slate-600">
        Prefer to explore first?{" "}
        <Link href="/join/explore" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          Join explore
        </Link>
      </p>
    </MeetingChrome>
  );
}
