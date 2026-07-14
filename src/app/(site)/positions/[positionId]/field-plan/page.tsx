import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { getCollegePosition } from "@/lib/meeting/positions-catalog";

export default async function PositionFieldPlanPage({
  params,
}: {
  params: Promise<{ positionId: string }>;
}) {
  const { positionId } = await params;
  const position = getCollegePosition(positionId);
  if (!position) notFound();

  return (
    <MeetingChrome
      title={`${position.title} · Field Plan`}
      subtitle="Soft wrapper only — we do not invent Field Plan doctrine on this page."
    >
      <p className="text-sm text-slate-700">
        Browse the approved Field Plan library depths and position mapping. Responsibilities here remain provisional from
        the agenda until approved library content is wired to this seat.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/field-plan" className="text-brand-800 underline-offset-2 hover:underline">
            Field Plan library →
          </Link>
        </li>
        <li>
          <Link href="/field-plan/depths" className="text-brand-800 underline-offset-2 hover:underline">
            Depth layers L0–L4 →
          </Link>
        </li>
        <li>
          <Link href="/field-strategy" className="text-brand-800 underline-offset-2 hover:underline">
            Field Strategy manual (approved) →
          </Link>
        </li>
        <li>
          <Link href={`/positions/${position.id}`} className="text-brand-800 underline-offset-2 hover:underline">
            ← Back to {position.title}
          </Link>
        </li>
      </ul>
    </MeetingChrome>
  );
}
