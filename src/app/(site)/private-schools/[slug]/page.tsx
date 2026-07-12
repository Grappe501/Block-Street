import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPrivateCharterSchoolBySlug,
  getCountyBySlug,
  getInstitutionTypeLabel,
} from "@/lib/data";
import { CommunityWorkspace } from "@/components/community/workspace/CommunityWorkspace";

export default async function PrivateCharterSchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getPrivateCharterSchoolBySlug(slug);
  if (!school) notFound();

  const county = getCountyBySlug(school.county);

  return (
    <CommunityWorkspace
      kind="private_charter"
      slug={slug}
      backHref="/private-schools"
      backLabel="← All private & charter schools"
      showGradientHeader
      subtitle={`${school.city}, ${county?.name ?? school.county} · Grades ${school.grades}${
        school.enrollment > 0 ? ` · ${school.enrollment} students` : ""
      }`}
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
            <p className="text-slate-500">{school.lea ? "School LEA" : "District LEA"}</p>
            <p className="font-semibold font-mono text-xs">{school.lea ?? school.districtLea}</p>
          </div>
          <div>
            <p className="text-slate-500">Type</p>
            <p className="font-semibold">{getInstitutionTypeLabel(school.type)}</p>
          </div>
        </div>
        {school.district && (
          <p className="mt-4 text-sm text-slate-500">
            District: <span className="font-medium text-slate-700">{school.district}</span>
          </p>
        )}
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
