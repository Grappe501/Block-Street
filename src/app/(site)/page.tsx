import Link from "next/link";
import { getCampuses } from "@/lib/data";

export default function HomePage() {
  const council = getCampuses().filter((c) => c.isFoundingCouncil);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-200">
            Arkansas Youth & Student Organizing
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            One shared organizing home for every young Arkansan
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-100">
            Campus-rooted for students. County-connected for young adults not in school.
            Nonpartisan by design. We provide the tools — you choose the direction.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/join" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-brand-50">
              Join the Network
            </Link>
            <Link href="/council" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Founding Council
            </Link>
          </div>
        </div>
      </section>

      {/* Two Paths */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">Two Ways to Join</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
          Every young Arkansan deserves an organizing home — in school or not.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link href="/join?path=campus" className="card group transition hover:border-brand-300 hover:shadow-md">
            <div className="mb-3 text-3xl">🎓</div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700">
              I&apos;m Connected to a School
            </h3>
            <p className="mt-2 text-slate-600">
              College, university, trade school, or junior college. Join your campus hub,
              recruit your network, and organize with students statewide.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600">
              Find your campus →
            </span>
          </Link>
          <Link href="/join?path=county" className="card group transition hover:border-brand-300 hover:shadow-md">
            <div className="mb-3 text-3xl">📍</div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700">
              I&apos;m Not Currently in School
            </h3>
            <p className="mt-2 text-slate-600">
              Join your Arkansas county hub. 75 counties, each with a catch-all space
              for young adults to organize locally and connect statewide.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600">
              Find your county →
            </span>
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            Give Arkansas college students and young adults one shared organizing home —
            where every campus builds its own voice, every county welcomes those not in school,
            and student energy becomes real civic power.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Student-Led", desc: "Students decide direction" },
              { title: "Campus-Rooted", desc: "Every school gets a hub" },
              { title: "County-Connected", desc: "75 county youth spaces" },
              { title: "Nonpartisan", desc: "Tools, not direction" },
            ].map((item) => (
              <div key={item.title} className="rounded-lg bg-slate-50 p-4">
                <p className="font-semibold text-brand-700">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Council */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Founding Leadership Council</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Five Arkansas campuses anchor the initial leadership council — founding partners, not bosses.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {council.map((campus) => (
            <Link
              key={campus.slug}
              href={`/campus/${campus.slug}`}
              className="card transition hover:border-brand-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Founding Council
              </p>
              <p className="mt-1 font-bold text-slate-900">{campus.name}</p>
              <p className="text-sm text-slate-500">{campus.city}, AR</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Relational Organizing */}
      <section className="bg-brand-950 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Every Person Gets a Network</h2>
          <p className="mt-4 max-w-2xl text-brand-100">
            When you join, you get your own share link and QR code. You recruit your people.
            They get their own networks. The platform grows one trusted relationship at a time.
          </p>
          <p className="mt-4 text-sm italic text-brand-200">
            Leadership isn&apos;t measured by how many people you collect —
            it&apos;s measured by how many people you help become leaders themselves.
          </p>
          <Link href="/join" className="mt-8 inline-block rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600">
            Start Building Your Network
          </Link>
        </div>
      </section>
    </div>
  );
}
