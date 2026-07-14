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
    <CollegeChrome slug={college.slug} name={college.name} title="Start Power of 5">
      <p className="text-sm text-slate-700">Name people you already know at this school: a friend, classmate, roommate, student organization member, faculty or staff contact.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/college/${college.slug}/power-of-5`} className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">Power of 5 hub</Link>
        <Link href="/orientation/next-step" className="rounded-lg border px-3 py-2 text-xs font-semibold">Orientation next step</Link>
      </div>
    </CollegeChrome>
  );
}
