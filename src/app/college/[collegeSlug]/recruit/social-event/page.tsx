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
    <CollegeChrome slug={college.slug} name={college.name} title="Social-event invitation">
      <p className="text-sm text-slate-700">Invite people to a welcoming social experience — keep formal explanation short.</p>
      <p className="mt-3 text-xs text-amber-800">No automatic sending. Soft-beta invitation prepared ≠ certified binding.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/college/${college.slug}/recruit`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Recruit hub</Link>
        <Link href={`/college/${college.slug}/power-of-5`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Power of 5</Link>
      </div>
    </CollegeChrome>
  );
}
