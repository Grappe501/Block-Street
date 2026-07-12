import type { HumanBlockedState } from "@/lib/civic-action/builds/11.1/ux";

export function InitiativeBlockedState({ state }: { state: HumanBlockedState }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4" role="alert">
      <h3 className="font-bold text-amber-950">{state.title}</h3>
      <p className="mt-1 text-sm text-amber-900">{state.explanation}</p>
      {state.items.length > 0 && (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-amber-950">
          {state.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )}
      {state.next_action && <p className="mt-3 text-sm font-semibold text-amber-900">{state.next_action}</p>}
      <p className="mt-2 text-xs text-amber-800 underline">{state.support_path}</p>
    </div>
  );
}
