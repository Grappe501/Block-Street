"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ObjectiveWorkspaceShellView } from "@/lib/civic-action/builds/11.2/ux";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-800",
  proposed: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  ready: "bg-violet-100 text-violet-800",
  active: "bg-green-100 text-green-800",
  on_track: "bg-green-100 text-green-800",
  needs_attention: "bg-amber-100 text-amber-800",
  at_risk: "bg-red-100 text-red-800",
  completed: "bg-slate-100 text-slate-700",
  archived: "bg-slate-200 text-slate-600",
};

export function ObjectiveWorkspaceShell({
  shell,
  children,
}: {
  shell: ObjectiveWorkspaceShellView;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/initiatives/${shell.initiative_id}/objectives/${shell.objective_id}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href={`/initiatives/${shell.initiative_id}/objectives`}
            className="text-xs text-orange-700 hover:underline"
          >
            ← Our Objectives
          </Link>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-orange-700">{shell.institution_name}</p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{shell.display_name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {shell.health_label} · {shell.viewer_role_label}
              </p>
              <p className="mt-2 max-w-2xl text-sm text-slate-700">{shell.purpose_line}</p>
            </div>
            <span className={`badge ${STATUS_COLORS[shell.lifecycle_state] ?? "bg-slate-100"}`}>
              {shell.lifecycle_label}
            </span>
          </div>
          {shell.archived_banner && (
            <p className="mt-3 rounded border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-800">
              {shell.archived_banner}
            </p>
          )}
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4" aria-label="Objective sections">
          <ul className="flex gap-1 border-t border-slate-100 pt-2">
            {shell.nav_sections.map((section) => {
              const isActive = pathname === section.href;
              return (
                <li key={section.key}>
                  <Link
                    href={section.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-t px-3 py-2 text-sm font-medium ${
                      isActive ? "border-b-2 border-orange-600 text-orange-800" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
