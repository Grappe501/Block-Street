import Link from "next/link";

export default function OrientationPositionsBridgePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Campus teams & positions</h1>
        <p className="mt-3 text-sm text-slate-700">
          Pick your college first — teams and positions live inside each College Community.
        </p>
        <Link href="/colleges" className="mt-6 inline-block rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white">
          Select my college →
        </Link>
      </div>
    </div>
  );
}
