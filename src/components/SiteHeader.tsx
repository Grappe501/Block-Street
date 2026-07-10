import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            BS
          </span>
          <div>
            <div className="text-lg font-bold text-slate-900">Block Street</div>
            <div className="text-xs text-slate-500">Arkansas Student Organizing</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/join" className="hover:text-brand-600">
            Join
          </Link>
          <Link href="/council" className="hover:text-brand-600">
            Council
          </Link>
          <Link href="/admin" className="hover:text-brand-600">
            Director
          </Link>
        </nav>
        <Link href="/join" className="btn-primary md:hidden">
          Join
        </Link>
      </div>
    </header>
  );
}
