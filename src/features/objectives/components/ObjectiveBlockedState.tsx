import type { HumanBlockedState } from "@/lib/civic-action/builds/11.2/ux";

export function ObjectiveBlockedState({ state }: { state: HumanBlockedState }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4" role="alert">
      <h3 className="font-semibold text-amber-950">{state.title}</h3>
      <p className="mt-2 text-sm text-amber-900">{state.explanation}</p>
      {state.items.length > 0 && (
        <ul className="mt-2 list-inside list-disc text-sm text-amber-900">
          {state.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {state.next_action && <p className="mt-3 text-sm font-medium text-amber-950">{state.next_action}</p>}
    </div>
  );
}
