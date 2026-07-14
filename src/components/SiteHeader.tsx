import Link from "next/link";
import { PLATFORM } from "@/lib/data";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 pr-36 sm:pr-48">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            {PLATFORM.workingName.slice(0, 2)}
          </span>
          <div>
            <div className="text-lg font-bold text-slate-900">{PLATFORM.workingName}</div>
            <div className="hidden text-xs text-slate-500 sm:block">{PLATFORM.fullName}</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
          <Link href="/july-14" className="rounded bg-indigo-700 px-3 py-1.5 text-white hover:bg-indigo-800">
            July 14
          </Link>
          <Link href="/operations" className="hover:text-brand-600">Operations</Link>
          <Link href="/identity" className="hover:text-brand-600">My Identity</Link>
          <Link href="/map" className="hover:text-brand-600">Map</Link>
          <Link href="/join" className="hover:text-brand-600">Join</Link>
          <Link href="/admin" className="hover:text-brand-600">Director</Link>
        </nav>
        <Link href="/july-14" className="btn-primary md:hidden">July 14</Link>
      </div>
    </header>
  );
}
