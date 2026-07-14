import Link from "next/link";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}


const SCRIPTS = [
  "Friend or classmate",
  "Roommate",
  "Student organization leader",
  "Faculty member",
  "Staff member / campus employee",
  "Social-event invitation",
  "Voter-registration volunteer invitation",
  "Team leadership conversation",
  "Follow-up after interest",
  "Follow-up after no response",
] as const;

export default async function Page({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);
  const base = `/college/${college.slug}/recruit`;
  return (
    <CollegeChrome slug={college.slug} name={college.name} title="Campus recruitment">
      <p className="text-sm font-semibold">
        Begin with people you already know at your school. Invite them into the College Community, help them complete Orientation, and connect them to one team, event, or useful action.
      </p>
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-700">
        <li>Identify someone</li>
        <li>Start a personal conversation</li>
        <li>Invite them to Orientation or the College Community</li>
        <li>Ask what interests them</li>
        <li>Connect them to a team or event</li>
        <li>Follow up</li>
        <li>Help them take one action</li>
      </ol>
      <section className="mt-4 rounded-xl border bg-white p-4">
        <h2 className="font-bold">Script prompts (copy manually — no auto-send)</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {SCRIPTS.map((s) => (
            <li key={s} className="rounded bg-slate-50 px-2 py-1">{s}</li>
          ))}
        </ul>
      </section>
      <nav className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link href={`${base}/friends`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Friends & classmates</Link>
        <Link href={`${base}/student-organizations`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Student organizations</Link>
        <Link href={`${base}/faculty-staff`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Faculty & staff</Link>
        <Link href={`${base}/social-event`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Social-event invitation</Link>
        <Link href={`${base}/voter-registration`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">VR volunteer invitation</Link>
        <Link href={`${base}/follow-up`} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:border-brand-400">Follow-up scripts</Link>
      </nav>
    </CollegeChrome>
  );
}
