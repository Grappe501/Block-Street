import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCountyBySlug,
  getInstitutionsByCounty,
  INTERESTS,
  PLATFORM_DISCLAIMER,
} from "@/lib/data";

export default async function CountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const schools = getInstitutionsByCounty(slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/map" className="text-sm text-brand-600 hover:underline">← Arkansas Map</Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{county.name}</h1>
      <p className="mt-2 text-slate-600">County youth organizing hub — for students and young workers ages 16–24</p>

      {schools.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">Schools in {county.name}</h2>
          <div className="mt-4 grid gap-3">
            {schools.map((school) => (
              <Link
                key={school.slug}
                href={`/schools/${school.slug}`}
                className="card flex items-center justify-between transition hover:border-brand-300"
                style={{ borderLeftWidth: 4, borderLeftColor: school.colors.primary }}
              >
                <p className="font-semibold">{school.name}</p>
                <span className="text-sm text-brand-600">View →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 card">
        <h2 className="text-lg font-bold text-slate-900">County Youth Hub</h2>
        <p className="mt-2 text-slate-600">
          For young adults not in school — or anyone organizing at the county level.
          Recruit locally, connect statewide.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <span key={i.id} className="badge bg-slate-100 text-slate-600">{i.label}</span>
          ))}
        </div>
        <button disabled className="mt-6 btn-primary cursor-not-allowed opacity-60">
          Sign Up — Launching July 14
        </button>
      </div>

      <p className="mt-6 text-xs text-slate-400">{PLATFORM_DISCLAIMER}</p>
    </div>
  );
}
