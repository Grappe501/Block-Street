"use client";

import { useState } from "react";
import type { DepthTab } from "@/lib/field-strategy/content";

export function DepthTabs({ tabs, levelLabel = "Level 2–3" }: { tabs: DepthTab[]; levelLabel?: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  if (!current) return null;

  return (
    <div className="rounded-2xl border border-field-pine/15 bg-white/80">
      <div className="flex items-center justify-between gap-3 border-b border-field-pine/10 px-4 py-3">
        <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-moss">
          Drill down · {levelLabel}
        </p>
        <p className="hidden font-fieldSans text-[11px] text-field-ink/55 sm:block">Choose a layer</p>
      </div>
      <div className="flex gap-1 overflow-x-auto px-3 py-3">
        {tabs.map((tab) => {
          const on = tab.id === current.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 font-fieldSans text-xs font-semibold transition ${
                on
                  ? "bg-field-pine text-field-mist"
                  : "bg-field-mist text-field-ink hover:bg-field-canopy/15"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="space-y-3 px-5 pb-5 pt-1 animate-fieldRise" key={current.id}>
        {current.body.map((p) => (
          <p key={p} className="font-fieldSans text-sm leading-relaxed text-field-ink/90">
            {p}
          </p>
        ))}
        {current.bullets?.length ? (
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {current.bullets.map((b) => (
              <li
                key={b}
                className="rounded-lg border border-field-pine/10 bg-field-mist/60 px-3 py-2 font-fieldSans text-xs font-medium text-field-ink"
              >
                {b}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
