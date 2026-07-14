import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import { getCollegePosition } from "@/lib/meeting/positions-catalog";

export default async function PositionTeamPage({
  params,
}: {
  params: Promise<{ positionId: string }>;
}) {
  const { positionId } = await params;
  const position = getCollegePosition(positionId);
  if (!position) notFound();

  return (
    <MeetingChrome
      title={`${position.title} · team`}
      subtitle="Soft beta does not publish fabricated personnel. Build your outreach circle with Power of 5 while appointments stay pending."
    >
      <p className="text-sm text-slate-700">
        This seat coordinates with other College Team leads. No durable roster is assigned here yet.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/power-of-5/my-team" className="text-brand-800 underline-offset-2 hover:underline">
            Soft-beta Power of 5 team builder →
          </Link>
        </li>
        <li>
          <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
            Other College Team seats →
          </Link>
        </li>
        <li>
          <Link href={`/positions/${position.id}`} className="text-brand-800 underline-offset-2 hover:underline">
            ← Back to {position.title}
          </Link>
        </li>
      </ul>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["Power of 5 local seat planner", "Open seat catalog"]}
          stillCompleting={["Certified appointments and shared team graphs"]}
        />
      </div>
    </MeetingChrome>
  );
}
