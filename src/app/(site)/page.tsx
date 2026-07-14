import Link from "next/link";
import { getRegistryStats, PLATFORM } from "@/lib/data";

export default function HomePage() {
  const stats = getRegistryStats();

  return (
    <div>
      {/* WHY — Emotional Call to Action */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-200">
            Why We Gather
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Our generation will decide the future of Arkansas
          </h1>
          <div className="mt-8 max-w-2xl space-y-4 text-lg text-brand-100">
            <p>
              Decisions are being made about our schools, our jobs, our communities, our rights —
              and most young people aren&apos;t at the table. Not because you don&apos;t care.
              Because nobody showed you how to sit down together.
            </p>
            <p className="font-semibold text-white">
              {PLATFORM.workingName} exists because when young Arkansans organize —
              when we show up as one voice — we become impossible to ignore.
            </p>
            <p className="text-brand-200">
              This isn&apos;t about a party. This isn&apos;t about someone telling you who to vote for.
              This is about <strong className="text-white">you building the power to decide for yourselves.</strong>
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/start" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-brand-50">
              I&apos;m Steve — start here
            </Link>
            <Link href="/join" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              I have an invitation
            </Link>
          </div>
        </div>
      </section>

      {/* HOW — Collective Power */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">How We Build Power</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">One campus is a whisper. All of Arkansas is a force.</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Power comes from numbers. Numbers come from relationships. When we invite our friends,
            and they invite theirs, you&apos;re building a <strong>voting block</strong> — a collective voice
            that politicians cannot ignore.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Find Our Home", desc: "Pick our county and school — or join our county as a young worker." },
              { step: "2", title: "Recruit Our People", desc: "Get your share link and QR code. Invite everyone you know." },
              { step: "3", title: "Build Together", desc: "Form committees, register voters, decide collectively." },
            ].map((item) => (
              <div key={item.step} className="card">
                <span className="text-2xl font-bold text-brand-600">{item.step}</span>
                <p className="mt-2 font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Paths */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">Two Ways to Join</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          Ages 16–24. In school or not. Every young Arkansan has a home here.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link href="/join?path=student" className="card group transition hover:border-brand-300 hover:shadow-md">
            <div className="mb-3 text-3xl">🎓</div>
            <h3 className="text-xl font-bold group-hover:text-brand-700">I&apos;m Connected to a School</h3>
            <p className="mt-2 text-slate-600">
              Pick our county, then our college or university. Every school has equal standing.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600">Find our school →</span>
          </Link>
          <Link href="/join?path=county" className="card group transition hover:border-brand-300 hover:shadow-md">
            <div className="mb-3 text-3xl">📍</div>
            <h3 className="text-xl font-bold group-hover:text-brand-700">I&apos;m Not in School</h3>
            <p className="mt-2 text-slate-600">
              Working, between jobs, or not enrolled? Join our county youth hub. 75 counties, all welcome.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600">Find our county →</span>
          </Link>
        </div>
      </section>

      {/* Map Stats / Outreach Gap */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Fill the Map</p>
          <h2 className="mt-2 text-2xl font-bold">Who&apos;s represented? Who needs you?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Counties", value: stats.totalCounties, sub: "All have a hub" },
              { label: "Post-Secondary", value: stats.v1Institutions, sub: "Colleges & trade" },
              { label: "High Schools", value: stats.totalHighSchools, sub: "Public · every county" },
              { label: "Private & Charter", value: stats.totalPrivateCharterSchools, sub: "145 private · 102 charter" },
              { label: "Need Organizers", value: stats.needsOrganizer, sub: "Outreach targets" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-800 p-4">
                <p className="text-3xl font-bold text-brand-400">{s.value}</p>
                <p className="font-semibold">{s.label}</p>
                <p className="text-sm text-slate-400">{s.sub}</p>
              </div>
            ))}
          </div>
          <Link href="/map" className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold hover:bg-brand-500">
            View Arkansas Map →
          </Link>
        </div>
      </section>

      {/* WHAT — Coming Tools */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">What We Get</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Our organizing network</h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          Every person gets a share link, QR code, and network board. Recruit our people.
          They get their own networks. The graph grows one trusted relationship at a time.
        </p>
        <Link href="/join" className="mt-6 inline-block btn-primary">
          Start Building Our Network
        </Link>
      </section>
    </div>
  );
}
