import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { COLLEGE_POSITIONS } from "@/lib/meeting/positions-catalog";

export const metadata = {
  title: "Open positions — soft beta",
  description: "College Team seats open for soft-beta interest — welcoming, not appointments.",
};

export default function PositionsCatalogPage() {
  return (
    <MeetingChrome
      title="Positions"
      subtitle="These College Team seats are open for soft-beta interest. Expressing interest is a welcome — not a certified appointment."
    >
      <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/positions/open" className="text-brand-800 underline-offset-2 hover:underline">
          Open seats
        </Link>
        <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
          College Team
        </Link>
        <Link href="/positions/county" className="text-brand-800 underline-offset-2 hover:underline">
          County
        </Link>
        <Link href="/positions/functional" className="text-brand-800 underline-offset-2 hover:underline">
          Functional
        </Link>
      </nav>

      <MeetingLinkList
        items={COLLEGE_POSITIONS.map((p) => ({
          href: `/positions/${p.id}`,
          label: p.title,
          note: `${p.command} · ${p.status} · soft beta`,
        }))}
      />

      <div className="mt-8">
        <HonestyPanel
          workingNow={["College position pages and interest form", "Agenda-aligned seat titles"]}
          stillCompleting={["County and functional deep rosters", "Durable appointments"]}
        />
      </div>
    </MeetingChrome>
  );
}
