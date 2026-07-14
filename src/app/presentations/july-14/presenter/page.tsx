import { Suspense } from "react";
import { July14MeetingDeck } from "@/components/presentations/July14MeetingDeck";

export default function July14PresenterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading presenter mode…</div>}>
      <July14MeetingDeck mode="presenter" />
    </Suspense>
  );
}
