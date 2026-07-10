import Link from "next/link";
import { getCampuses } from "@/lib/data";

export default function CouncilPage() {
  const council = getCampuses().filter((c) => c.isFoundingCouncil);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Founding Leadership Council</h1>
      <p className="mt-3 text-lg text-slate-600">
        Five Arkansas campuses anchor the initial leadership council. They are founding partners
        who help guide platform development — not bosses over other schools.
      </p>

      <div className="mt-10 space-y-4">
        {council.map((campus) => (
          <Link
            key={campus.slug}
            href={`/campus/${campus.slug}`}
            className="card block transition hover:border-brand-300 hover:shadow-md"
          >
            <p className="font-bold text-slate-900">{campus.name}</p>
            <p className="text-sm text-slate-500">{campus.city}, Arkansas</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 card bg-brand-50 border-brand-200">
        <h2 className="font-bold text-brand-900">Council Responsibilities</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-800">
          <li>Represent campus diversity in platform governance</li>
          <li>Help onboard additional Arkansas schools</li>
          <li>Provide feedback on feature priorities</li>
          <li>Model relational organizing on their campuses</li>
          <li>Connect with county hubs in their regions</li>
        </ul>
      </div>
    </div>
  );
}
