import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { CommandCalendarNav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { ReviewQueueCard } from "@/components/calendar/assignments/ReviewQueueCard";
import { ensureAssignmentDemoFixtures, listReviewQueue } from "@/lib/calendar/assignments";

export default function CommandStaffingReviewPage() {
  ensureAssignmentDemoFixtures();
  const queue = listReviewQueue();

  return (
    <CommandChrome title="Staffing review queue" subtitle="Deterministic priority — no AI ranking" backHref="/command/events/staffing" backLabel="Staffing" nav={<CommandCalendarNav />}>
      <AssignmentSoftBetaNote />
      <CommandSection title={`${queue.length} interests`}>
        <div className="grid gap-3 sm:grid-cols-2">{queue.map((item) => <ReviewQueueCard key={item.reviewId} item={item} />)}</div>
      </CommandSection>
      <Link href="/command/events/staffing/offers" className="font-fieldSans text-sm text-field-pine underline">Offers dashboard</Link>
    </CommandChrome>
  );
}
