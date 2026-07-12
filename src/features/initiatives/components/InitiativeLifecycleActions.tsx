import type { InitiativeUiAction } from "@/lib/civic-action/builds/11.1/ux";

export function InitiativeLifecycleActions({
  actions,
  onAction,
}: {
  actions: InitiativeUiAction[];
  onAction?: (action: InitiativeUiAction) => void;
}) {
  if (actions.length === 0) return null;

  return (
    <section className="card">
      <h2 className="text-lg font-bold text-slate-900">Lifecycle Actions</h2>
      <p className="mt-1 text-sm text-slate-600">Explicit governed actions — not direct status editing.</p>
      <ul className="mt-4 space-y-3">
        {actions.map((action) => (
          <li key={action.action_key} className="rounded-lg border border-slate-200 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{action.label}</p>
                <p className="mt-1 text-sm text-slate-600">{action.description}</p>
                {action.impact_summary && (
                  <p className="mt-1 text-xs text-slate-500">{action.impact_summary}</p>
                )}
                {!action.available && action.blocked_reason_optional && (
                  <p className="mt-2 text-sm text-amber-800">{action.blocked_reason_optional}</p>
                )}
              </div>
              <button
                type="button"
                disabled={!action.available}
                onClick={() => onAction?.(action)}
                className={action.available ? "btn-primary" : "btn-secondary cursor-not-allowed opacity-60"}
              >
                {action.label}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
