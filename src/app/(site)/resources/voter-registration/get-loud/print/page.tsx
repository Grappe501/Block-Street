import Image from "next/image";
import Link from "next/link";
import { loadGetLoudEducation, projectGetLoudCard } from "@/lib/civic-resources/registry";

export const metadata = {
  title: "Print · Get Loud registration QR",
};

export default function GetLoudPrintPage() {
  const projection = projectGetLoudCard("event");
  const education = loadGetLoudEducation();
  if (!projection) return null;

  return (
    <div className="mx-auto max-w-lg px-6 py-10 print:py-4">
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-8 text-center print:border-black">
        <p className="text-xs font-semibold uppercase tracking-widest">Provided by Get Loud Arkansas</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Register or update voter information</h1>
        <p className="mt-3 text-sm text-slate-700">Independent external service · Not an online registration portal</p>
        <Image
          src={projection.qrApiPath}
          alt={`QR code for ${projection.destinationDomain}`}
          width={320}
          height={320}
          unoptimized
          className="mx-auto mt-6"
        />
        <p className="mt-4 font-mono text-sm">{projection.formUrl}</p>
        <p className="mt-4 text-xs text-slate-600">{projection.shortDisclosure}</p>
        <p className="mt-3 text-xs text-slate-600">
          Confirm registration with your county clerk or Arkansas VoterView after applying.
        </p>
        <p className="mt-4 text-xs">
          <Link href={education.organizationUrl} className="underline">
            {education.organizationUrl}
          </Link>
        </p>
      </div>
    </div>
  );
}
