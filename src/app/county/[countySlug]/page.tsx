import Link from "next/link";
import { notFound } from "next/navigation";
import { getCounties } from "@/lib/data";

export default async function CountyCommunityPage({
  params,
}: {
  params: Promise<{ countySlug: string }>;
}) {
  const { countySlug } = await params;
  const county = getCounties().find((c) => c.slug === countySlug);
  if (!county) notFound();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/counties" className="text-xs font-semibold text-brand-700">
          ← All counties
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">County Community</p>
        <h1 className="text-3xl font-bold">{county.name}</h1>
        <p className="mt-3 text-sm text-slate-700">
          County organizing remains usable and honest. Soft beta — hierarchy binding and certified invite-chain are not
          complete. Tonight’s Orientation presentation returns attention to the College Community pathway.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/orientation/student" className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">
            Open College Community path
          </Link>
          <Link href="/orientation" className="rounded-lg border px-3 py-2 text-xs font-semibold">
            Return to Orientation
          </Link>
          <Link href="/colleges" className="rounded-lg border px-3 py-2 text-xs font-semibold">
            Browse colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
