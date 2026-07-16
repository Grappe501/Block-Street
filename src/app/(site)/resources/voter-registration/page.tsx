import Link from "next/link";
import { GetLoudRegistrationResourceCard } from "@/components/civic-resources/GetLoudRegistrationResourceCard";
import { getActiveExternalCivicResource, projectGetLoudCard } from "@/lib/civic-resources/registry";

export const metadata = {
  title: "Voter registration resources",
};

export default function VoterRegistrationResourcesPage() {
  const projection = projectGetLoudCard("standard");
  const sos = getActiveExternalCivicResource("arkansas-sos-voter-registration");
  const voterview = getActiveExternalCivicResource("arkansas-voterview");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Voter registration resources</h1>
      <p className="mt-2 text-sm text-slate-600">Independent and official Arkansas registration assistance.</p>

      {projection && <GetLoudRegistrationResourceCard projection={projection} variant="standard" className="mt-8" />}

      <section className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Official Arkansas resources</h2>
        {sos && (
          <Link href={sos.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 underline">
            {sos.title}
          </Link>
        )}
        {voterview && (
          <Link href={voterview.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 underline">
            {voterview.title}
          </Link>
        )}
      </section>
    </div>
  );
}
