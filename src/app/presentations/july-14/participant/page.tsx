import { Suspense } from "react";
import { July14MeetingDeck } from "@/components/presentations/July14MeetingDeck";

export default function July14ParticipantPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading participant mode…</div>}>
      <July14MeetingDeck mode="participant" />
    </Suspense>
  );
}
