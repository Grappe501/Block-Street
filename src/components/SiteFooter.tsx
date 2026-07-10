import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-900">Block Street</p>
            <p className="text-sm text-slate-500">
              Student-led. Campus-rooted. County-connected. Nonpartisan by design.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/council" className="hover:text-brand-600">
              Leadership Council
            </Link>
            <Link href="/admin" className="hover:text-brand-600">
              Director Workbench
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          v0.1.0 — Building the Arkansas youth organizing network
        </p>
      </div>
    </footer>
  );
}
