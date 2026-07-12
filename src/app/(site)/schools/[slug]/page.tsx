import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getInstitutionBySlug,
  getCountyBySlug,
  getInstitutionTypeLabel,
} from "@/lib/data";
import { CommunityWorkspace } from "@/components/community/workspace/CommunityWorkspace";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = getInstitutionBySlug(slug);
  if (!school) notFound();

  const county = getCountyBySlug(school.county);

  return (
    <CommunityWorkspace
      kind="institution"
      slug={slug}
      backHref="/schools"
      backLabel="← All schools"
      showGradientHeader
      subtitle={`${school.city}, ${county?.name ?? school.county} · Est. ${school.founded}`}
    >
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">About {school.shortName}</h2>
        <p className="mt-2 text-slate-600">{school.culture}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-slate-500">Enrollment</p>
            <p className="font-semibold">~{school.enrollment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Founded</p>
            <p className="font-semibold">{school.founded}</p>
          </div>
          <div>
            <p className="text-slate-500">Type</p>
            <p className="font-semibold">{getInstitutionTypeLabel(school.type)} · {school.sector}</p>
          </div>
        </div>
        {county && (
          <p className="mt-4 text-sm text-slate-500">
            County hub:{" "}
            <Link href={`/county/${county.slug}`} className="text-brand-600 hover:underline">
              {county.name}
            </Link>
          </p>
        )}
        {school.website && (
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-brand-600 hover:underline"
          >
            Official website →
          </a>
        )}
        {school.hbcu && <span className="ml-3 badge bg-violet-100 text-violet-800">HBCU</span>}
      </div>
      <p className="text-xs text-slate-400">
        Connected to {school.name}. Not affiliated with or endorsed by {school.name}.
      </p>
    </CommunityWorkspace>
  );
}
