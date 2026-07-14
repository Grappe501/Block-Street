import Link from "next/link";

export default function OrientationCommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">County Community path</h1>
        <p className="mt-3 text-sm text-slate-700">
          County organizing stays available and honest. Tonight’s live meeting centers the College Community path — you can
          switch anytime.
        </p>
        <Link
          href="/counties"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
        >
          Browse counties →
        </Link>
        <p className="mt-6 text-sm">
          Prefer campus work?{" "}
          <Link href="/orientation/student" className="font-semibold text-brand-700 underline">
            Enter the College Community path
          </Link>
        </p>
      </div>
    </div>
  );
}
