import Link from "next/link";
import { GetLoudResourceSection } from "@/components/civic-resources/GetLoudResourceSection";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const hub = `/college/${college.slug}/voter-registration`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="Materials">
      <GetLoudResourceSection variant="standard" className="mb-6" />
      <p className="text-sm text-slate-700">Event kit checklist. Use print and present modes for tabling.</p>
      <p className="mt-3 text-xs text-amber-800">Awaiting campus verification / legal review where marked. Soft beta.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={hub} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Back to VR overview</Link>
        <Link href={`/college/${college.slug}`} className="rounded-lg border px-3 py-2 text-xs font-semibold">College Community</Link>
      </div>
    </CollegeChrome>
  );
}
