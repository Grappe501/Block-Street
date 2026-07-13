"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LearningWorkbenchShellView } from "@/lib/civic-action/builds/11.12/ux";

export function LearningWorkbenchShell({
  shell,
  children,
}: {
  shell: LearningWorkbenchShellView;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{shell.institution_name}</p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Learning & Knowledge</h1>
              <p className="mt-1 text-sm text-slate-600">{shell.viewer_role_label}</p>
            </div>
            <p className="text-xs text-slate-500">AI assistance is advisory only</p>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4" aria-label="Learning workbench sections">
          <ul className="flex gap-1 border-t border-slate-100 pt-2">
            {shell.nav_sections.map((section) => {
              const isActive = pathname === section.href || pathname.startsWith(`${section.href}/`);
              return (
                <li key={section.key}>
                  <Link
                    href={section.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-t px-3 py-2 text-sm font-medium ${
                      isActive ? "border-b-2 border-indigo-600 text-indigo-800" : "text-slate-600 hover:text-slate-900"
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
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_280px]">
        <main>{children}</main>
        <aside className="rounded-lg border border-slate-200 bg-white p-4 text-sm" aria-label="Related context panel">
          <h2 className="font-semibold text-slate-900">Context</h2>
          <p className="mt-2 text-slate-600">Related knowledge, activity, and people appear here.</p>
        </aside>
      </div>
    </div>
  );
}
