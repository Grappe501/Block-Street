import type { PlaybookEvolutionRecord } from "@/lib/civic-action/builds/11.7/optimization";

export function PlaybookLibrary({ playbooks }: { playbooks: PlaybookEvolutionRecord[] }) {
  return (
    <section aria-labelledby="playbook-lib" className="card">
      <h2 id="playbook-lib" className="text-lg font-bold text-slate-900">
        Playbook Library
      </h2>
      <ul className="mt-3 space-y-2">
        {playbooks.map((p) => (
          <li key={p.playbook_id} className="rounded-lg border border-slate-200 p-3">
            <p className="font-medium text-slate-900">
              {p.playbook_name} <span className="text-sm text-slate-500">v{p.version}</span>
            </p>
            <p className="text-xs capitalize text-teal-700">{p.status}</p>
            <p className="mt-1 text-sm text-slate-600">{p.lessons_applied[0]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
