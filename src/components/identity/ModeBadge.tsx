"use client";

import type { ReactNode } from "react";
import type { ImplementationMode } from "@/lib/july14/config";

const STYLES: Record<ImplementationMode, string> = {
  live: "bg-emerald-100 text-emerald-900 border-emerald-300",
  demo: "bg-amber-100 text-amber-900 border-amber-300",
  locked: "bg-slate-100 text-slate-600 border-slate-300",
};

const LABELS: Record<ImplementationMode, string> = {
  live: "Live",
  demo: "Demonstration",
  locked: "Locked",
};

export function ModeBadge({ mode, note }: { mode: ImplementationMode; note?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${STYLES[mode]}`}
      title={note}
    >
      {mode === "demo" ? "Demonstration Record" : LABELS[mode]}
    </span>
  );
}

export function DemoRecordBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-950" role="note">
      <strong>Demonstration Record</strong>
      {children ? ` — ${children}` : " — not a production event"}
    </div>
  );
}

export function LockedFeature({ title, reason }: { title: string; reason: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <ModeBadge mode="locked" />
        <p className="font-semibold text-slate-800">{title}</p>
      </div>
      <p className="mt-2 text-xs">{reason}</p>
    </div>
  );
}
