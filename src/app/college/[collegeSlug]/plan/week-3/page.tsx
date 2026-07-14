import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}

import { MONTH_PLAN } from "@/lib/college-community/catalog";

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const week = MONTH_PLAN.week3;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title={week.title}>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        {week.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/college/${college.slug}/plan`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Full plan</Link>
        <Link href={`/college/${college.slug}`} className="rounded-lg border px-3 py-2 text-xs font-semibold">College Community</Link>
      </div>
    </CollegeChrome>
  );
}
