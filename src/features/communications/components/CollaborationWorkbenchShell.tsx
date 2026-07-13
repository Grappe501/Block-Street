"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CollaborationWorkbenchShellView } from "@/lib/civic-action/builds/11.7/ux";

export function CollaborationWorkbenchShell({
  shell,
  children,
}: {
  shell: CollaborationWorkbenchShellView;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{shell.institution_name}</p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Communications Workbench</h1>
              <p className="mt-1 text-sm text-slate-600">{shell.viewer_role_label}</p>
            </div>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4" aria-label="Communication workbench sections">
          <ul className="flex gap-1 border-t border-slate-100 pt-2">
            {shell.nav_sections.map((section) => {
              const isActive =
                pathname === section.href ||
                (section.key === "missions" && pathname.startsWith("/communications/missions"));
              return (
                <li key={section.key}>
                  <Link
                    href={section.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-t px-3 py-2 text-sm font-medium ${
                      isActive ? "border-b-2 border-teal-600 text-teal-800" : "text-slate-600 hover:text-slate-900"
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
