import { Suspense } from "react";
import { SlideDeck } from "@/components/presentations/SlideDeck";
import { JULY14_AGENDA_SLIDES } from "@/lib/presentations/july14-agenda";

/** Preserved classic section slide deck (does not replace agenda leaves 01–34). */
export default function July14DeckPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading…</div>}>
      <SlideDeck
        slides={JULY14_AGENDA_SLIDES}
        homeHref="/presentations/july-14"
        homeLabel="July 14 hub"
        deckPath="/presentations/july-14/deck"
      />
    </Suspense>
  );
}
