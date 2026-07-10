import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountyBySlug, INTERESTS } from "@/lib/data";

export default async function CountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const county = getCountyBySlug(slug);
  if (!county) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/join?path=county" className="text-sm text-brand-600 hover:underline">
        ← All counties
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{county.name}</h1>
      <p className="mt-2 text-slate-600">Youth organizing hub for young adults not currently in school</p>

      <div className="mt-8 card">
        <h2 className="text-lg font-bold text-slate-900">County Youth Hub</h2>
        <p className="mt-2 text-slate-600">
          This is your county catch-all on Block Street. Organize locally, connect statewide,
          and build your personal recruitment network.
        </p>
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Interest areas (Phase 4 signup):</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <span key={i.id} className="badge bg-white text-slate-600 ring-1 ring-slate-200">
                {i.label}
              </span>
            ))}
          </div>
        </div>
        <button
          disabled
          className="mt-6 btn-primary cursor-not-allowed opacity-60"
        >
          Sign Up — Coming Phase 4
        </button>
      </div>
    </div>
  );
}
