import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="People">
      <section className="rounded-xl border bg-white p-5">
        <p className="text-sm text-slate-700">
          This College Community is ready to grow. You do not need to wait for someone else to begin. Start by inviting
          people you already know at this school.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg bg-slate-50 p-3"><dt className="font-semibold">Interested</dt><dd className="text-slate-600">Shell count · Soft beta</dd></div>
          <div className="rounded-lg bg-slate-50 p-3"><dt className="font-semibold">Participating</dt><dd className="text-slate-600">Shell count · Soft beta</dd></div>
          <div className="rounded-lg bg-slate-50 p-3"><dt className="font-semibold">Teams represented</dt><dd className="text-slate-600">Awaiting local activity</dd></div>
          <div className="rounded-lg bg-slate-50 p-3"><dt className="font-semibold">Open leadership needs</dt><dd><Link href={`${base}/positions`} className="text-brand-700 underline">View positions</Link></dd></div>
        </dl>
        <p className="mt-4 text-xs text-amber-800">Private contact information is never shown publicly. Membership states are Interest / Following / Participating — not formal appointment.</p>
      </section>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`${base}/people`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Join / follow (soft beta)</Link>
        <Link href={`${base}/recruit`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Invite someone from this school</Link>
        <Link href={`${base}/power-of-5`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Build Power of 5</Link>
      </div>
    </CollegeChrome>
  );
}
