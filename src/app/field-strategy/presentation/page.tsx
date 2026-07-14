import { Suspense } from "react";
import { PresentationDeck } from "@/components/field-strategy/PresentationDeck";

export default function PresentationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-field-dusk p-8 text-field-mist">Loading presentation…</div>}>
      <PresentationDeck />
    </Suspense>
  );
}
