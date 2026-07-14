import Link from "next/link";

export default function OrientationCompletePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-6">
        <h1 className="text-3xl font-bold">Orientation status</h1>
        <p className="mt-3 text-sm text-slate-700">
          Soft-beta completion recorded locally when you chose a next step. Your College Community remains the center —
          return anytime.
        </p>
        <ul className="mt-6 space-y-2 text-sm font-semibold">
          <li><Link className="text-brand-700 underline" href="/colleges">My College Community</Link></li>
          <li><Link className="text-brand-700 underline" href="/orientation/power-of-5">My Power of 5</Link></li>
          <li><Link className="text-brand-700 underline" href="/orientation">Continue Orientation</Link></li>
          <li><Link className="text-brand-700 underline" href="/admin/college-command">College Command (hosts)</Link></li>
        </ul>
      </div>
    </div>
  );
}
