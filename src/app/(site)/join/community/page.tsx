import Link from "next/link";
import {
  getCounties,
  getInstitutionsByCounty,
  PLATFORM,
} from "@/lib/data";

export default async function JoinCommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; county?: string }>;
}) {
  const params = await searchParams;
  const { path, county: countySlug } = params;
  const counties = getCounties();

  if (path === "student" && countySlug) {
    const county = counties.find((c) => c.slug === countySlug);
    const schools = getInstitutionsByCounty(countySlug);
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/join/community?path=student" className="text-sm text-brand-600 hover:underline">
          ← Back to counties
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Choose Our School in {county?.name ?? countySlug}
        </h1>
        <p className="mt-2 text-slate-600">
          Every school has equal standing. Don&apos;t see yours? More schools added as students onboard.
        </p>
        {schools.length === 0 ? (
          <div className="mt-8 card border-amber-200 bg-amber-50">
            <p className="text-amber-800">
              No schools listed in this county yet. You can still join via the county youth hub.
            </p>
            <Link href={`/county/${countySlug}`} className="btn-primary mt-4 inline-block">
              Join {county?.name} County Hub
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-3">
            {schools.map((school) => (
              <Link
                key={school.slug}
                href={`/schools/${school.slug}`}
                className="card flex items-center justify-between transition hover:border-brand-300 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-slate-900">{school.name}</p>
                  <p className="text-sm text-slate-500">{school.city}, AR · {school.sector}</p>
                </div>
                <span className={`badge ${school.representationStatus === "building" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                  {school.representationStatus === "building" ? "Building" : "Join"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (path === "student") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/join/community" className="text-sm text-brand-600 hover:underline">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Step 1: Pick Our County</h1>
        <p className="mt-2 text-slate-600">
          Choose the county where our school is located. (Honor system — we trust you.)
        </p>
        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {counties.map((county) => {
            const schoolCount = getInstitutionsByCounty(county.slug).length;
            return (
              <Link
                key={county.slug}
                href={`/join/community?path=student&county=${county.slug}`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="font-medium text-slate-900">{county.name}</span>
                {schoolCount > 0 && (
                  <span className="ml-2 text-xs text-slate-400">{schoolCount} school{schoolCount !== 1 ? "s" : ""}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (path === "county") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/join/community" className="text-sm text-brand-600 hover:underline">← Back</Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Choose Our County</h1>
        <p className="mt-2 text-slate-600">
          For young adults ages 16–24 not currently in school. Our county is our organizing home.
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
      <Link href="/join" className="text-sm text-indigo-700 hover:underline">← Identity entry</Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Join {PLATFORM.workingName}</h1>
      <p className="mt-3 text-lg text-slate-600">Ages 16–24. County and school pathways.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link href="/join/community?path=student" className="card group text-center transition hover:border-brand-300 hover:shadow-md">
          <div className="text-4xl">🎓</div>
          <h2 className="mt-4 text-xl font-bold group-hover:text-brand-700">I&apos;m in School</h2>
          <p className="mt-2 text-sm text-slate-600">County → School → Our network</p>
        </Link>
        <Link href="/join/community?path=county" className="card group text-center transition hover:border-brand-300 hover:shadow-md">
          <div className="text-4xl">📍</div>
          <h2 className="mt-4 text-xl font-bold group-hover:text-brand-700">I&apos;m Not in School</h2>
          <p className="mt-2 text-sm text-slate-600">County youth hub for working youth</p>
        </Link>
      </div>
    </div>
  );
}
