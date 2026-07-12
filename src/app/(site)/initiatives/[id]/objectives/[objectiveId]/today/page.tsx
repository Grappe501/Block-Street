import { notFound } from "next/navigation";
import Link from "next/link";
import {
  assembleTodaysWork,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";

export default async function TodaysWorkPage({
  params,
}: {
  params: Promise<{ id: string; objectiveId: string }>;
}) {
  const { id, objectiveId } = await params;
  const today = assembleTodaysWork(id, objectiveId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
  if (!today) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Today&apos;s Work</h1>
      <p className="text-slate-600">Automatically built from missions, tasks, and review rhythm.</p>
      {today.items.length === 0 ? (
        <div className="card">{today.empty_message}</div>
      ) : (
        <ul className="space-y-2">
          {today.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`card block ${item.priority === "high" ? "border-orange-300" : ""}`}
              >
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.why}</p>
                <p className="mt-1 text-xs text-slate-500">{item.entity_type}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
