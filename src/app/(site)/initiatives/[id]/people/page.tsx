import { notFound } from "next/navigation";
import { initiativeApplicationService } from "@/lib/civic-action/builds/11.1/services/application-service";
import { humanLabel } from "@/lib/civic-action/builds/11.1/ux/experience-context";

export default async function InitiativePeoplePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agg = initiativeApplicationService.getAggregate(id);
  if (!agg) notFound();
  const ini = agg.initiative;

  const roles = [
    { label: "College / Operational Lead", human: ini.operational_owner_human_id, note: "Day-to-day coordination" },
    { label: "Executive Owner", human: ini.executive_owner_human_id, note: "Institutional support" },
    { label: "Backup Owner", human: ini.backup_owner_human_id, note: "Continuity" },
    { label: "Creator", human: ini.created_by, note: "Not owner unless accepted" },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-bold">Ownership & Responsibility</h2>
      <p className="mt-1 text-sm text-slate-600">Service roles — nomination does not equal active ownership until acceptance.</p>
      <ul className="mt-4 divide-y">
        {roles.map((r) => (
          <li key={r.label} className="py-3 flex justify-between gap-4">
            <div>
              <p className="font-medium">{r.label}</p>
              <p className="text-xs text-slate-500">{r.note}</p>
            </div>
            <p className="text-sm font-semibold">{r.human ? humanLabel(r.human) : "Open role"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
