import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCountyBySlug,
  getPostSecondaryForCounty,
  getHighSchoolsByCounty,
  getPrivateCharterSchoolsByCounty,
  getInstitutionTypeLabel,
} from "@/lib/data";
import { CommunityWorkspace } from "@/components/community/workspace/CommunityWorkspace";

export default async function CountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  const { local: localSchools, served: servedSchools } = getPostSecondaryForCounty(slug);
  const highSchools = getHighSchoolsByCounty(slug);
  const privateCharter = getPrivateCharterSchoolsByCounty(slug);
  const privateSchools = privateCharter.filter((s) => s.sector === "private");
  const charterSchools = privateCharter.filter((s) => s.sector === "charter");

  const PostSecondaryList = ({ items, subtitle }: { items: typeof localSchools; subtitle?: string }) => (
    <div className="mt-4 grid gap-3">
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      {items.map((school) => (
        <Link
          key={school.slug}
          href={`/schools/${school.slug}`}
          className="card flex items-center justify-between transition hover:border-brand-300"
          style={{ borderLeftWidth: 4, borderLeftColor: school.colors.primary }}
        >
          <div>
            <p className="font-semibold">{school.name}</p>
            <p className="text-xs text-slate-500">{getInstitutionTypeLabel(school.type)} · {school.city}</p>
          </div>
          <span className="text-sm text-brand-600">View →</span>
        </Link>
      ))}
    </div>
  );

  return (
    <CommunityWorkspace
      kind="county"
      slug={slug}
      backHref="/map"
      backLabel="← Arkansas Map"
      subtitle="County youth organizing workspace — for students and young workers ages 16–24"
    >
      {(localSchools.length > 0 || servedSchools.length > 0) && (
        <div>
          <h2 className="text-lg font-bold text-slate-900">Post-Secondary Schools</h2>
          {localSchools.length > 0 && (
            <>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-700">In {county.name}</h3>
              <PostSecondaryList items={localSchools} />
            </>
          )}
          {servedSchools.length > 0 && (
            <>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Nearby & district-served
              </h3>
              <PostSecondaryList
                items={servedSchools}
                subtitle="Commuter and community-college district options for this county"
              />
            </>
          )}
        </div>
      )}

      {highSchools.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">Public High Schools</h2>
            <Link href="/high-schools" className="text-sm text-brand-600 hover:underline">
              All {highSchools.length} in {county.name} →
            </Link>
          </div>
          <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
            {highSchools.map((school) => (
              <Link
                key={school.slug}
                href={`/high-schools/${school.slug}`}
                className="card flex items-center justify-between py-3 transition hover:border-brand-300"
                style={{ borderLeftWidth: 3, borderLeftColor: school.colors.primary }}
              >
                <div>
                  <p className="font-semibold text-slate-900">{school.name}</p>
                  <p className="text-xs text-slate-500">{school.city}</p>
                </div>
                <span className="text-sm text-brand-600">View →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {privateCharter.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">Private &amp; Charter Schools</h2>
            <Link href="/private-schools" className="text-sm text-brand-600 hover:underline">
              All {privateCharter.length} in {county.name} →
            </Link>
          </div>
          {privateSchools.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-700">Private ({privateSchools.length})</h3>
              <div className="mt-2 max-h-48 space-y-2 overflow-y-auto">
                {privateSchools.map((school) => (
                  <Link
                    key={school.slug}
                    href={`/private-schools/${school.slug}`}
                    className="card flex items-center justify-between py-3 transition hover:border-brand-300"
                    style={{ borderLeftWidth: 3, borderLeftColor: school.colors.primary }}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{school.name}</p>
                      <p className="text-xs text-slate-500">{school.city} · Grades {school.grades}</p>
                    </div>
                    <span className="text-sm text-brand-600">View →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {charterSchools.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Charter ({charterSchools.length})</h3>
              <div className="mt-2 max-h-48 space-y-2 overflow-y-auto">
                {charterSchools.map((school) => (
                  <Link
                    key={school.slug}
                    href={`/private-schools/${school.slug}`}
                    className="card flex items-center justify-between py-3 transition hover:border-brand-300"
                    style={{ borderLeftWidth: 3, borderLeftColor: school.colors.primary }}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{school.name}</p>
                      <p className="text-xs text-slate-500">{school.city} · Grades {school.grades}</p>
                    </div>
                    <span className="text-sm text-brand-600">View →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </CommunityWorkspace>
  );
}
