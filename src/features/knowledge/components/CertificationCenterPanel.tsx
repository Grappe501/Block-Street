import type { CertificationWorkspaceView } from "@/lib/civic-action/builds/11.12/ux";

export function CertificationCenterPanel({ view }: { view: CertificationWorkspaceView }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-semibold text-slate-900">Certifications held</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {view.held.length === 0 ? (
            <li className="text-slate-500">No credentials issued yet.</li>
          ) : (
            view.held.map((c) => (
              <li key={c.id} className="rounded border border-slate-200 bg-white p-3">
                <p className="font-medium">{c.title}</p>
                {c.expires_at && <p className="text-slate-500">Expires: {c.expires_at}</p>}
              </li>
            ))
          )}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold text-slate-900">In progress</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {view.in_progress.map((c) => (
            <li key={c.id} className="rounded border border-slate-200 bg-white p-3">
              <p className="font-medium">{c.title}</p>
              <ul className="mt-1 list-disc pl-5 text-slate-600">
                {c.remaining.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
