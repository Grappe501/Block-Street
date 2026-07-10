import type { BuildProgress } from "@/lib/data";
import { getRegistryStats } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export function AdminDataModel({ progress }: { progress: BuildProgress }) {
  const stats = getRegistryStats();
  const tables = [
    {
      name: "users",
      status: "pending",
      desc: "Fundamental object — every participant with share link + QR",
      columns: ["id", "slug", "first_name", "last_name", "email", "affiliation_type", "campus_id", "county_id", "referred_by_id", "interests"],
    },
    {
      name: "campuses",
      status: "pending",
      desc: "Schools and educational institutions",
      columns: ["id", "slug", "name", "type", "is_founding_council", "city", "county_id"],
    },
    {
      name: "counties",
      status: "pending",
      desc: "75 Arkansas county hubs",
      columns: ["id", "slug", "name", "fips_code"],
    },
    {
      name: "referrals",
      status: "pending",
      desc: "Relationship graph — who recruited whom",
      columns: ["id", "referrer_id", "referred_id", "created_at"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Database Status</h2>
          <StatusBadge status={progress.project.databaseStatus === "not_connected" ? "pending" : "done"} />
        </div>
        <p className="mt-2 text-slate-600">
          Netlify DB (Postgres) — connects in Phase 2 after Netlify site is created.
        </p>
      </div>

      <div className="space-y-4">
        {tables.map((table) => (
          <div key={table.name} className="card">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-brand-700">{table.name}</h3>
              <StatusBadge status={table.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">{table.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {table.columns.map((col) => (
                <span key={col} className="badge bg-slate-100 text-slate-600">{col}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Seed Data Ready</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>✅ <code className="text-brand-600">data/counties.json</code> — 75 counties</p>
          <p>✅ <code className="text-brand-600">data/registry/institutions.json</code> — {stats.totalInstitutions} post-secondary schools</p>
          <p>✅ <code className="text-brand-600">data/registry/high-schools.json</code> — {stats.totalHighSchools} public high schools (ADE)</p>
          <p>✅ <code className="text-brand-600">data/registry/county-post-secondary-service.json</code> — post-secondary county coverage</p>
          <p>✅ <code className="text-brand-600">data/registry/high-school-coverage.json</code> — high school county coverage (75/75)</p>
          <p>✅ <code className="text-brand-600">data/registry/private-charter-schools.json</code> — {stats.totalPrivateCharterSchools} private &amp; charter schools (ADE)</p>
          <p>✅ <code className="text-brand-600">data/registry/private-charter-coverage.json</code> — private/charter county coverage ({stats.countiesWithPrivateOrCharter}/75)</p>
          <p className="text-slate-500">Legacy: <code className="text-brand-600">data/campuses.json</code> — founding council seed</p>
        </div>
      </div>
    </div>
  );
}
