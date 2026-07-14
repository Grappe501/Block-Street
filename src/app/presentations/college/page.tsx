import { Suspense } from "react";
import { SlideDeck } from "@/components/presentations/SlideDeck";
import { COLLEGE_NEW_USER_SLIDES } from "@/lib/presentations/college-new-user";

export default function CollegePresentationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading…</div>}>
      <SlideDeck
        slides={COLLEGE_NEW_USER_SLIDES}
        homeHref="/july-14"
        homeLabel="July 14"
        deckPath="/presentations/college"
      />
    </Suspense>
  );
}
