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
    <CollegeChrome slug={college.slug} name={college.name} title="Campus events">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`${base}/social-event`} className="rounded-xl border bg-white p-4 hover:border-brand-400">
          <p className="font-semibold">Networking & recruitment event</p>
          <p className="text-xs text-slate-600 mt-1">Social planning board</p>
        </Link>
        <Link href={`${base}/voter-registration`} className="rounded-xl border bg-white p-4 hover:border-brand-400">
          <p className="font-semibold">First-week voter-registration drive</p>
          <p className="text-xs text-slate-600 mt-1">Readiness and shifts</p>
        </Link>
      </div>
    </CollegeChrome>
  );
}
