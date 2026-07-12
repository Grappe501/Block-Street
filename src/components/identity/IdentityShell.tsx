"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import { InstitutionSwitcher } from "./InstitutionSwitcher";

export function IdentityShell({
  title,
  subtitle,
  children,
  showSwitcher = true,
  nav,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showSwitcher?: boolean;
  nav?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/july-14" className="text-xs font-semibold text-indigo-700 hover:underline">
            July 14
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <LanguageToggle />
          {showSwitcher && <InstitutionSwitcher compact />}
        </div>
      </div>

      {showSwitcher && <InstitutionSwitcher />}

      {nav && <nav className="flex flex-wrap gap-2 text-sm">{nav}</nav>}

      {children}
    </div>
  );
}
