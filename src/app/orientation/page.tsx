import Link from "next/link";
import { ORIENTATION_SECTIONS } from "@/lib/orientation/sections";

export const metadata = {
  title: "Orientation — Block Street",
  description: "Start Orientation — find your College Community and take a useful next step.",
};

export default function OrientationHubPage() {
  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.18em] text-field-wheat">
          Block Street · Orientation
        </p>
        <h1 className="mt-3 font-fieldDisplay text-4xl text-white sm:text-5xl">Start Orientation</h1>
        <p className="mt-4 font-fieldSans text-base leading-relaxed text-field-mist/90">
          Orientation explains how Block Street works, helps you choose the student or county path, and centers on your
          College Community — teams, positions, voter registration, networking event, and Power of 5.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/orientation/presenter"
            className="rounded-xl bg-field-wheat px-5 py-4 font-fieldSans text-sm font-bold text-field-dusk"
          >
            Present Orientation
          </Link>
          <Link
            href="/orientation/participant"
            className="rounded-xl border border-field-wheat/40 px-5 py-4 font-fieldSans text-sm font-bold text-field-wheat"
          >
            Continue Orientation
          </Link>
          <Link
            href="/orientation/student"
            className="rounded-xl border border-white/20 px-5 py-4 font-fieldSans text-sm font-semibold text-field-mist"
          >
            I am a student
          </Link>
          <Link
            href="/orientation/community"
            className="rounded-xl border border-white/20 px-5 py-4 font-fieldSans text-sm font-semibold text-field-mist"
          >
            I am not a student
          </Link>
        </div>

        <section className="mt-10 rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="font-fieldDisplay text-2xl text-white">Tonight’s segments</h2>
          <ol className="mt-4 space-y-2 font-fieldSans text-sm">
            {ORIENTATION_SECTIONS.map((s) => (
              <li key={s.id} className="text-field-mist/90">
                <span className="text-field-wheat">{s.estimatedDurationMinutes} min</span> · {s.title}
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 font-fieldSans text-xs text-field-mist/50">
          Soft beta · Invite-chain PRESENT not CERTIFIED · Historical July 14 routes redirect here
        </p>
      </div>
    </div>
  );
}
