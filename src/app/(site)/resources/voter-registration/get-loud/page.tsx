import Link from "next/link";
import { GetLoudRegistrationResourceCard } from "@/components/civic-resources/GetLoudRegistrationResourceCard";
import { projectGetLoudCard } from "@/lib/civic-resources/registry";

export const metadata = {
  title: "Get Loud registration resource",
};

export default function GetLoudResourceHubPage() {
  const projection = projectGetLoudCard("standard");
  if (!projection) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-slate-700">Registration resource temporarily unavailable.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/resources/voter-registration" className="text-sm text-brand-700 underline">
        ← All voter registration resources
      </Link>
      <GetLoudRegistrationResourceCard projection={projection} variant="standard" className="mt-6" />
      <p className="mt-4 text-xs text-slate-600">
        Report a broken external link to your Registration Committee lead or campaign administrator.
      </p>
    </div>
  );
}
