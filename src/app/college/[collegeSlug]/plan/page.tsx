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
  const base = `/college/${college.slug}/plan`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="First-month campus organizing plan">
      <p className="text-sm text-slate-700">Systematic organizational build before school begins. Dates are configurable per campus return schedule.</p>
      <ul className="mt-4 space-y-3">
        {Object.entries(MONTH_PLAN).map(([key, week]) => (
          <li key={key}>
            <Link href={`${base}/${key.replace("week", "week-")}`} className="block rounded-xl border bg-white p-4 hover:border-brand-400">
              <p className="font-bold">{week.title}</p>
              <p className="mt-1 text-xs text-slate-600">{week.items.slice(0, 3).join(" · ")}</p>
            </Link>
          </li>
        ))}
      </ul>
    </CollegeChrome>
  );
}
