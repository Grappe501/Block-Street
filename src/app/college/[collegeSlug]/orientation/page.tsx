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
    <CollegeChrome slug={college.slug} name={college.name} title="Campus Orientation">
      <p className="text-sm text-slate-700">Use this campus as your College Community home while completing Orientation.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/orientation" className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Return to Orientation</Link>
        <Link href={`/college/${college.slug}`} className="rounded-lg border px-3 py-2 text-xs font-semibold">College Community home</Link>
      </div>
    </CollegeChrome>
  );
}
