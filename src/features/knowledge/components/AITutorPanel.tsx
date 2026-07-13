import type { AICommandBarView } from "@/lib/civic-action/builds/11.12/ux";

export function AITutorPanel({ bar }: { bar: AICommandBarView }) {
  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-6">
      <h1 className="text-lg font-semibold text-indigo-900">AI Assistant</h1>
      <p className="mt-2 text-sm text-indigo-800">Guidance only — not final institutional authority.</p>
      <ul className="mt-4 space-y-2 text-sm text-indigo-900">
        {bar.prompts.map((p) => (
          <li key={p} className="rounded bg-white/70 px-3 py-2">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
