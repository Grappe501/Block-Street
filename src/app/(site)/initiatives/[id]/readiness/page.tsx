import { notFound } from "next/navigation";
import Link from "next/link";
import {
  assembleInitiativeReadiness,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";

export default async function InitiativeReadinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const readiness = assembleInitiativeReadiness(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
  if (!readiness) notFound();

  const AreaList = ({ areas, title }: { areas: typeof readiness.must_complete; title: string }) => (
    <section className="card">
      <h2 className="font-bold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {areas.length === 0 ? <li className="text-sm text-slate-500">None</li> : areas.map((a) => (
          <li key={a.key} className="rounded border p-3">
            <p className="font-semibold">{a.label}</p>
            <ul className="mt-1 text-sm text-slate-600 list-disc pl-4">
              {a.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
            {a.action_href && <Link href={a.action_href} className="mt-2 inline-block text-sm text-orange-700 underline">{a.action_label ?? "Open"}</Link>}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold">{readiness.header}</h2>
        <p className="mt-2 text-slate-600">{readiness.summary}</p>
        {readiness.activation_preview && (
          <p className="mt-4 rounded bg-green-50 border border-green-200 p-3 text-sm text-green-900">{readiness.activation_preview}</p>
        )}
      </div>
      <AreaList areas={readiness.must_complete} title="Must Be Completed" />
      <AreaList areas={readiness.recommended} title="Recommended Before Activation" />
      <AreaList areas={readiness.after_activation} title="Will Be Needed After Activation" />
    </div>
  );
}
