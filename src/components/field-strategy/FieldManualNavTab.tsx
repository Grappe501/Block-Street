"use client";

import { openFieldManualWindow, FIELD_MANUAL_DEFAULT_PATH } from "@/lib/field-strategy/open-manual-window";

type Variant = "nav" | "header" | "admin-bar" | "workspace";

const STYLES: Record<Variant, string> = {
  nav: "whitespace-nowrap rounded-lg bg-field-wheat/20 px-3 py-2 font-semibold text-field-pine ring-1 ring-field-wheat/50 hover:bg-field-wheat/35",
  header:
    "inline-flex items-center rounded-lg bg-amber-400/20 px-3 py-1.5 text-sm font-semibold text-amber-50 ring-1 ring-amber-200/40 hover:bg-amber-400/30",
  "admin-bar":
    "inline-flex items-center rounded-md bg-amber-500/20 px-2.5 py-1 font-semibold text-amber-200 ring-1 ring-amber-400/40 hover:bg-amber-500/30",
  workspace:
    "inline-flex items-center rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-950 hover:bg-amber-100",
};

export function FieldManualNavTab({
  variant = "nav",
  path = FIELD_MANUAL_DEFAULT_PATH,
  label = "Field Manual",
  className = "",
}: {
  variant?: Variant;
  path?: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openFieldManualWindow(path)}
      className={`${STYLES[variant]} ${className}`}
      title="Opens the Field Strategy Manual in a second window — close or minimize anytime; this dashboard stays open"
      aria-label="Open Field Strategy Manual in a second window"
    >
      {label}
    </button>
  );
}
