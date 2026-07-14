"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { getCollegePosition } from "@/lib/meeting/positions-catalog";
import { presentationHrefForItem } from "@/lib/meeting/july14-registry";

function NextStepContent() {
  const params = useSearchParams();
  const positionId = params.get("position");
  const from = params.get("from");
  const item = params.get("item");
  const position = positionId ? getCollegePosition(positionId) : undefined;
  const returnHref =
    from === "july14" && item ? presentationHrefForItem(item) ?? "/presentations/july-14" : null;

  return (
    <MeetingChrome
      title="Your next step"
      subtitle="Thank you for the soft-beta interest note. Here’s a clear, welcoming path forward — still not an appointment."
      eyebrow="Soft beta · Join"
    >
      <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-700">
        <li>
          {position ? (
            <>
              Review{" "}
              <Link href={`/positions/${position.id}`} className="font-semibold text-brand-800 underline-offset-2 hover:underline">
                {position.title}
              </Link>{" "}
              first-24-hours list.
            </>
          ) : (
            <>Browse open seats and pick a path that fits.</>
          )}
        </li>
        <li>
          Start a Power of 5 seat list so you can welcome peers with intention.
        </li>
        <li>Share soft-beta feedback when something is confusing — we build with you.</li>
      </ol>
      <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
        {position ? (
          <Link href={`/positions/${position.id}`} className="rounded-lg bg-brand-700 px-4 py-2.5 text-white">
            Open {position.title}
          </Link>
        ) : (
          <Link href="/positions/open" className="rounded-lg bg-brand-700 px-4 py-2.5 text-white">
            Open seats
          </Link>
        )}
        <Link href="/power-of-5/start" className="rounded-lg border border-slate-300 px-4 py-2.5">
          Power of 5 start
        </Link>
        <Link href="/feedback" className="rounded-lg border border-slate-300 px-4 py-2.5">
          Beta feedback
        </Link>
        {returnHref ? (
          <Link href={returnHref} className="rounded-lg px-4 py-2.5 text-brand-800 underline-offset-2 hover:underline">
            ← Return to presentation
          </Link>
        ) : null}
      </div>
    </MeetingChrome>
  );
}

export default function JoinNextStepPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-600">Loading…</div>}>
      <NextStepContent />
    </Suspense>
  );
}
