import type { InstitutionalMemoryArtifact } from "@/lib/civic-action/builds/11.7/intelligence/institutional-memory";
import Link from "next/link";

export function InstitutionMemoryBrowser({ artifacts }: { artifacts: InstitutionalMemoryArtifact[] }) {
  return (
    <section aria-labelledby="inst-memory" className="card">
      <h2 id="inst-memory" className="text-lg font-bold text-slate-900">
        Institutional Memory
      </h2>
      <ul className="mt-3 space-y-2">
        {artifacts.length === 0 ? (
          <li className="text-sm text-slate-600">No preserved artifacts indexed yet.</li>
        ) : (
          artifacts.map((a) => (
            <li key={a.artifact_id}>
              <Link href={a.href} className="text-sm font-medium text-teal-800 hover:underline">
                {a.title}
              </Link>
              <p className="text-xs text-slate-500">
                {a.artifact_type} · {a.preserved_at.slice(0, 10)}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
