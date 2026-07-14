import Link from "next/link";

export default function OrientationPowerBridgePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Campus Power of 5</h1>
        <p className="mt-3 text-sm text-slate-700">
          The most useful first action is bringing people you already know at your school into the College Community.
        </p>
        <Link href="/colleges" className="mt-6 inline-block rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white">
          Choose college for Power of 5 →
        </Link>
        <Link href="/power-of-5/start" className="mt-3 block text-sm font-semibold text-brand-700 underline">
          Or open general Power of 5 starter
        </Link>
      </div>
    </div>
  );
}
