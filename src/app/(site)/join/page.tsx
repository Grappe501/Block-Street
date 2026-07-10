import Link from "next/link";
import { getCampuses, getCounties } from "@/lib/data";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const params = await searchParams;
  const path = params.path;
  const campuses = getCampuses();
  const counties = getCounties();

  if (path === "campus") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/join" className="text-sm text-brand-600 hover:underline">
          ← Back to join options
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Choose Your Campus</h1>
        <p className="mt-2 text-slate-600">
          Select your school to join its organizing hub. More schools added as students onboard.
        </p>
        <div className="mt-8 grid gap-3">
          {campuses.map((campus) => (
            <Link
              key={campus.slug}
              href={`/campus/${campus.slug}`}
              className="card flex items-center justify-between transition hover:border-brand-300 hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-900">{campus.name}</p>
                <p className="text-sm text-slate-500">{campus.city}, AR</p>
              </div>
              {campus.isFoundingCouncil && (
                <span className="badge bg-brand-100 text-brand-800">Council</span>
              )}
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Don&apos;t see your school? Coming in a future version — schools can self-register.
        </p>
      </div>
    );
  }

  if (path === "county") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/join" className="text-sm text-brand-600 hover:underline">
          ← Back to join options
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Choose Your County</h1>
        <p className="mt-2 text-slate-600">
          All 75 Arkansas counties have a youth organizing hub.
        </p>
        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {counties.map((county) => (
            <Link
              key={county.slug}
              href={`/county/${county.slug}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {county.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Join Block Street</h1>
      <p className="mt-3 text-lg text-slate-600">
        How are you connecting to the Arkansas youth organizing network?
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link href="/join?path=campus" className="card group text-center transition hover:border-brand-300 hover:shadow-md">
          <div className="text-4xl">🎓</div>
          <h2 className="mt-4 text-xl font-bold group-hover:text-brand-700">
            I&apos;m in School
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            College, university, trade school, or junior college
          </p>
        </Link>
        <Link href="/join?path=county" className="card group text-center transition hover:border-brand-300 hover:shadow-md">
          <div className="text-4xl">📍</div>
          <h2 className="mt-4 text-xl font-bold group-hover:text-brand-700">
            I&apos;m Not in School
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join your Arkansas county youth hub
          </p>
        </Link>
      </div>
      <div className="mt-10 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Coming in Phase 4:</strong> Full signup with profile, share link, QR code, and personal network board.
      </div>
    </div>
  );
}
