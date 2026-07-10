import Link from "next/link";
import { PLATFORM } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-900">{PLATFORM.workingName}</p>
            <p className="text-sm text-slate-500">{PLATFORM.motto}</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/map" className="hover:text-brand-600">Arkansas Map</Link>
            <Link href="/schools" className="hover:text-brand-600">Schools</Link>
            <Link href="/admin" className="hover:text-brand-600">Director Workbench</Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Independent youth organizing network. Not affiliated with or endorsed by any institution.
        </p>
        <p className="mt-2 text-xs text-slate-400">v0.2.0 — Constitution + Registry</p>
      </div>
    </footer>
  );
}
