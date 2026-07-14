import { Suspense } from "react";
import ChoosePlaceClient from "./ChoosePlaceClient";

export default function ChoosePlacePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-500">Loading…</div>}>
      <ChoosePlaceClient />
    </Suspense>
  );
}
