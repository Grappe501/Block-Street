"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BannerInner() {
  const params = useSearchParams();
  const inspect = params.get("inspect");
  if (!inspect) return null;
  return (
    <div className="border-b-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold">Viewing as: {inspect} · Inspection mode: read-only</p>
      <p className="mt-1 text-xs">
        This does not modify the inspected session.{" "}
        <Link href="/admin/director" className="font-semibold underline">
          Return to Director
        </Link>
        {" · "}
        <Link href="/admin/college-command" className="font-semibold underline">
          Return to College Command
        </Link>
      </p>
    </div>
  );
}

export function InspectBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  );
}
