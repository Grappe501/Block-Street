import Link from "next/link";
import sections from "@/lib/orientation/sections.json";

export default function OrientationHomePage() {
  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.18em] text-field-wheat">
          Orientation · {sections.total_minutes_target} minutes
        </p>
        <h1 className="mt-3 font-fieldDisplay text-4xl text-white sm:text-5xl">Start Orientation</h1>
        <p className="mt-4 font-fieldSans text-base leading-relaxed text-field-mist/90">
          Orientation is the standard entry for every new participant. Tonight centers the College Community path — find
          your school, understand teams and roles, prepare the first-week voter-registration drive, plan a welcoming
          campus networking event, and bring people you already know.
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
            Follow along
          </Link>
          <Link
            href="/orientation/student"
            className="rounded-xl border border-white/20 px-5 py-4 font-fieldSans text-sm font-semibold text-field-mist sm:col-span-2"
          >
            I am a student → College Community path
          </Link>
          <Link
            href="/orientation/community"
            className="rounded-xl border border-white/20 px-5 py-4 font-fieldSans text-sm font-semibold text-field-mist"
          >
            I am not a student → County path
          </Link>
          <Link
            href="/colleges"
            className="rounded-xl border border-white/20 px-5 py-4 font-fieldSans text-sm font-semibold text-field-mist"
          >
            Browse College Communities
          </Link>
        </div>

        <section className="mt-10 rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="font-fieldDisplay text-2xl text-white">What Orientation covers</h2>
          <ol className="mt-4 space-y-2 font-fieldSans text-sm text-field-mist/90">
            {sections.segments.map((s, i) => (
              <li key={s.id}>
                <span className="text-field-wheat">{i + 1}.</span> {s.title}{" "}
                <span className="text-field-mist/50">({s.estimated_duration} min)</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 font-fieldSans text-xs text-field-mist/50">
          Soft beta · Invitation-only account creation remains at{" "}
          <Link href="/join" className="text-field-wheat underline">
            /join
          </Link>
          . Invite-chain PRESENT, not CERTIFIED.
        </p>
      </div>
    </div>
  );
}
