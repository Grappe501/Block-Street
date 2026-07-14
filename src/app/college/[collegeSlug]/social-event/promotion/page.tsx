import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="Promotion">
      <p className="text-sm text-slate-700">Drafts only until approved. No automatic public posting.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/college/${college.slug}/social-event`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Event overview</Link>
        <Link href={`/college/${college.slug}`} className="rounded-lg border px-3 py-2 text-xs font-semibold">College Community</Link>
      </div>
    </CollegeChrome>
  );
}
