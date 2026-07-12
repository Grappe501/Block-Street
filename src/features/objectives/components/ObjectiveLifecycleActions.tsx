import type { ObjectiveUiAction } from "@/lib/civic-action/builds/11.2/ux";

export function ObjectiveLifecycleActions({ actions }: { actions: ObjectiveUiAction[] }) {
  if (actions.length === 0) return null;
  return (
    <section className="card">
      <h2 className="font-bold text-slate-900">Governed actions</h2>
      <p className="mt-1 text-sm text-slate-600">These actions go through the execution engine — no direct status edits.</p>
      <ul className="mt-4 space-y-3">
        {actions.map((action) => (
          <li
            key={action.action_key}
            className={`rounded border px-3 py-2 ${action.available ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-70"}`}
          >
            <p className="font-semibold text-slate-900">{action.label}</p>
            <p className="text-sm text-slate-600">{action.description}</p>
            {!action.available && action.blocked_reason_optional && (
              <p className="mt-1 text-xs text-amber-800">{action.blocked_reason_optional}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
