import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHighSchoolBySlug,
  getCountyBySlug,
  getInstitutionTypeLabel,
} from "@/lib/data";
import { CommunityWorkspace } from "@/components/community/workspace/CommunityWorkspace";

export default async function HighSchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getHighSchoolBySlug(slug);
  if (!school) notFound();

  const county = getCountyBySlug(school.county);

  return (
    <CommunityWorkspace
      kind="high_school"
      slug={slug}
      backHref="/high-schools"
      backLabel="← All high schools"
      showGradientHeader
      subtitle={`${school.city}, ${county?.name ?? school.county} · Grades ${school.grades}`}
    >
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">About {school.shortName}</h2>
        <p className="mt-2 text-slate-600">{school.culture}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-slate-500">County</p>
            <p className="font-semibold">
              {county ? (
                <Link href={`/county/${county.slug}`} className="text-brand-600 hover:underline">
                  {county.name}
                </Link>
              ) : (
                school.county
              )}
            </p>
          </div>
          <div>
            <p className="text-slate-500">ADE LEA</p>
            <p className="font-semibold font-mono text-xs">{school.lea}</p>
          </div>
          <div>
            <p className="text-slate-500">Type</p>
            <p className="font-semibold">{getInstitutionTypeLabel(school.type)}</p>
          </div>
        </div>
        {school.dataSource && (
          <p className="mt-4 text-xs text-slate-400">Source: {school.dataSource}</p>
        )}
      </div>
      <p className="text-xs text-slate-400">
        Connected to {school.name}. Not affiliated with or endorsed by {school.name}.
      </p>
    </CommunityWorkspace>
  );
}
