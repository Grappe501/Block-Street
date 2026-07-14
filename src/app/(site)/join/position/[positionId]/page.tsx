import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { getCollegePosition, withMeetingReturn } from "@/lib/meeting/positions-catalog";

export async function generateMetadata({ params }: { params: Promise<{ positionId: string }> }) {
  const { positionId } = await params;
  const position = getCollegePosition(positionId);
  return { title: position ? `Join · ${position.title}` : "Join position" };
}

export default async function JoinPositionPage({
  params,
  searchParams,
}: {
  params: Promise<{ positionId: string }>;
  searchParams: Promise<{ from?: string; item?: string }>;
}) {
  const { positionId } = await params;
  const { from, item } = await searchParams;
  const position = getCollegePosition(positionId);
  if (!position) notFound();

  const interestHref = withMeetingReturn(`/join/interest?position=${position.id}`, from, item);

  return (
    <MeetingChrome
      title={`Join via ${position.title}`}
      subtitle="Take a welcoming next step into this open seat path. Soft beta interest is not an appointment."
      eyebrow="Soft beta · Join"
    >
      <p className="text-sm text-slate-700">{position.primaryContribution}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={interestHref} className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white">
          Express interest
        </Link>
        <Link
          href={withMeetingReturn(`/positions/${position.id}`, from, item)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold"
        >
          Full seat details
        </Link>
        <Link href="/join/explore" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-800">
          Explore first
        </Link>
      </div>
    </MeetingChrome>
  );
}
