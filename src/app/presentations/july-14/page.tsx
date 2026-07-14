import { Suspense } from "react";
import { SlideDeck } from "@/components/presentations/SlideDeck";
import { JULY14_AGENDA_SLIDES } from "@/lib/presentations/july14-agenda";

export default function July14PresentationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading…</div>}>
      <SlideDeck
        slides={JULY14_AGENDA_SLIDES}
        homeHref="/july-14"
        homeLabel="July 14"
        deckPath="/presentations/july-14"
      />
    </Suspense>
  );
}
