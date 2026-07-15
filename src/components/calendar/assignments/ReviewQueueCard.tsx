import Link from "next/link";
import type { ReviewQueueItem } from "@/lib/calendar/assignments/review";

export function ReviewQueueCard({ item, eventId }: { item: ReviewQueueItem; eventId?: string }) {
  const href = eventId
    ? `/calendar/event/${eventId}/staffing/review/${item.interestId}`
    : `/calendar/event/${item.eventId}/staffing/review/${item.interestId}`;
  return (
    <article className="rounded-lg border bg-white p-3 font-fieldSans text-sm">
      <p className="font-bold">{item.volunteerDisplayName}</p>
      <p className="text-field-ink/70">{item.eventTitle} · {item.preferredRole ?? "Any role"}</p>
      <p>Training: {item.trainingStatus} · Conflict: {item.scheduleStatus} · Review: {item.reviewStatus}</p>
      <p className="text-xs text-field-ink/60">Coverage: {item.coverageSummary ?? "—"} · {item.suggestedNextAction}</p>
      <Link href={href} className="mt-2 inline-block text-field-pine underline text-xs">
        Open review
      </Link>
    </article>
  );
}
