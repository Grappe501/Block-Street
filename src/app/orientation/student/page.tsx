import Link from "next/link";

export default function OrientationStudentPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">College Community path</h1>
        <p className="mt-3 text-sm text-slate-700">
          Students, faculty, staff, graduates, campus organizations, and community supporters can participate. Choose the
          label that fits best — then select your campus.
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {[
            "Student",
            "Faculty or staff",
            "Campus organization",
            "Graduate or alumnus",
            "Community supporter",
            "Not sure yet",
          ].map((label) => (
            <li key={label}>
              <Link
                href="/colleges"
                className="block rounded-xl border bg-white px-4 py-3 font-semibold text-slate-900 hover:border-brand-400"
              >
                {label} → find my college
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-slate-500">
          County path remains available.{" "}
          <Link href="/orientation/community" className="font-semibold text-brand-700 underline">
            I am not a student
          </Link>
        </p>
      </div>
    </div>
  );
}
