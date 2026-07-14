import Link from "next/link";
import { getCounties } from "@/lib/data";

export const metadata = { title: "Find your county — Block Street" };

export default function CountiesPage() {
  const counties = getCounties()
    .slice()
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation/community" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Select your county</h1>
        <p className="mt-2 text-sm text-slate-600">
          County Community path remains available. Tonight’s Orientation centers the College Community pathway — you can
          switch anytime.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/orientation/student" className="font-semibold text-brand-700 underline">
            Prefer campus work? Enter the College Community path →
          </Link>
        </p>
        <ul className="mt-6 max-h-[70vh] space-y-2 overflow-y-auto">
          {counties.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/county/${c.slug}`}
                className="block rounded-xl border bg-white px-4 py-3 hover:border-brand-400"
              >
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">County Community · Soft beta</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
