import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}

import { CAMPUS_TEAMS } from "@/lib/college-community/catalog";

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="Campus teams">
      <p className="text-sm text-slate-700">Every team below has a full drill-down with goals, first tasks, and open roles.</p>
      <ul className="mt-4 space-y-2">
        {CAMPUS_TEAMS.map((t) => (
          <li key={t.id}>
            <Link href={`${base}/teams/${t.id}`} className="block rounded-xl border bg-white px-4 py-3 hover:border-brand-400">
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-slate-600">{t.immediateAction}</p>
            </Link>
          </li>
        ))}
      </ul>
    </CollegeChrome>
  );
}
