import Link from "next/link";
import { CollegePicker } from "@/components/college-community/CollegePicker";
import { listColleges } from "@/lib/college-community/institutions";

export const metadata = { title: "Find your college — Block Street" };

export default function CollegesPage() {
  const colleges = listColleges();
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation/student" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Select your college</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your College Community page — not the Director board — is the center of student onboarding.
        </p>
        <div className="mt-6">
          <CollegePicker colleges={colleges} />
        </div>
      </div>
    </div>
  );
}
