"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";

function BannerInner() {
  const params = useSearchParams();
  const inspect = params.get("inspect");
  if (!inspect) return null;
  return (
    <div className="border-b-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold uppercase tracking-wide">
            {inspect === "college-command"
              ? "College Leader inspection mode"
              : "Director inspection mode"}
          </p>
          <p className="mt-1 font-semibold">
            Viewing as: {inspect} · Scope: labeled surface · Changes disabled
          </p>
          <p className="mt-1 text-xs">
            Read-only. Does not impersonate or alter the inspected session.{" "}
            <Link href="/admin/director" className="font-semibold underline">
              Return to Director
            </Link>
            {" · "}
            <Link href="/admin/volunteer-command" className="font-semibold underline">
              Volunteer Command
            </Link>
            {" · "}
            <Link href="/admin/college-command" className="font-semibold underline">
              College Command
            </Link>
          </p>
        </div>
        <FieldManualNavTab variant="workspace" />
      </div>
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
