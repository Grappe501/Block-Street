import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


const PROMPTS = ["A friend", "A classmate", "A roommate", "A student organization member", "A faculty or staff contact"] as const;

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}/power-of-5`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="Campus Power of 5">
      <p className="text-sm font-semibold text-slate-900">
        The most useful first action is to bring people you already know at your school into the College Community.
      </p>
      <ul className="mt-4 space-y-2">
        {PROMPTS.map((p, i) => (
          <li key={p} className="rounded-xl border bg-white px-4 py-3 text-sm">
            <span className="font-bold text-brand-700">{i + 1}.</span> {p}{" "}
            <span className="text-slate-500">(suggestion, not a rigid seat)</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-amber-800">Invitations preserve college, community, inviter, intended team, Orientation entry — soft beta until WP-01 certified.</p>
      <nav className="mt-4 flex flex-wrap gap-2">
        <Link href={`${base}/start`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Start</Link>
        <Link href={`${base}/invite`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Prepare invitation</Link>
        <Link href={`${base}/follow-up`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Follow-up</Link>
      </nav>
    </CollegeChrome>
  );
}
