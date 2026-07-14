"use client";

import Link from "next/link";
import { MANUAL_NAV, type ManualSectionId } from "@/lib/field-strategy/nav";

export function ManualNav({ active }: { active: ManualSectionId }) {
  return (
    <nav
      aria-label="Field Strategy Manual"
      className="sticky top-0 z-40 border-b border-field-pine/20 bg-field-dusk/95 text-field-mist backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 pr-36 sm:px-4 sm:pr-48">
        <Link
          href="/field-strategy"
          className="shrink-0 font-fieldDisplay text-lg tracking-tight text-field-wheat"
        >
          Regnat Populus
        </Link>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex min-w-max gap-1">
            {MANUAL_NAV.map((item) => {
              const on = item.id === active;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`block rounded-md px-2.5 py-2 font-fieldSans text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs ${
                      on
                        ? "bg-field-wheat/20 text-field-wheat"
                        : "text-field-mist/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="sm:hidden">{item.short}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <Link
          href="/field-strategy/presentation"
          className="shrink-0 rounded-md bg-field-wheat px-3 py-2 font-fieldSans text-[11px] font-bold uppercase tracking-wide text-field-dusk hover:bg-field-wheat/90"
        >
          Present
        </Link>
      </div>
    </nav>
  );
}
