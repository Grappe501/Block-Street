import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}

import { CAMPUS_POSITIONS, getCampusTeam } from "@/lib/college-community/catalog";

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="People we need">
      <p className="text-sm text-slate-700">Leadership and volunteer vacancies. Expressing interest is not an appointment.</p>
      <ul className="mt-4 space-y-2">
        {CAMPUS_POSITIONS.map((p) => (
          <li key={p.id}>
            <Link href={`${base}/positions/${p.id}`} className="block rounded-xl border bg-white px-4 py-3 hover:border-brand-400">
              <p className="font-semibold">{p.title} <span className="text-xs text-slate-500">({p.kind})</span></p>
              <p className="text-xs text-slate-600">{getCampusTeam(p.teamId)?.name} · {p.firstTask}</p>
            </Link>
          </li>
        ))}
      </ul>
    </CollegeChrome>
  );
}
