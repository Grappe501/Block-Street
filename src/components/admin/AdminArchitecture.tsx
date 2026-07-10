export function AdminArchitecture() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Technology Stack</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-2 pr-4">Layer</th>
              <th className="pb-2">Technology</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {[
              ["Frontend", "Next.js 15 + TypeScript + Tailwind CSS"],
              ["Database", "Netlify DB (Postgres) — Phase 2"],
              ["Hosting", "Netlify"],
              ["Source", "GitHub"],
              ["File System", "H: drive ONLY (.npmrc enforced)"],
            ].map(([layer, tech]) => (
              <tr key={layer} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-medium">{layer}</td>
                <td className="py-2">{tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">URL Structure</h2>
        <div className="mt-4 space-y-2 font-mono text-sm">
          {[
            ["/", "Mission + home"],
            ["/join", "Signup flow (campus vs county)"],
            ["/campus/[slug]", "Campus hub landing"],
            ["/county/[slug]", "County hub landing"],
            ["/council", "Founding leadership council"],
            ["/s/[slug]", "Personal share/recruit link (Phase 4)"],
            ["/network", "Personal network board (Phase 4)"],
            ["/admin", "Director workbench (this dashboard)"],
          ].map(([route, desc]) => (
            <div key={route} className="flex gap-4 rounded bg-slate-50 px-3 py-2">
              <span className="text-brand-600">{route}</span>
              <span className="text-slate-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Organizing Philosophy</h2>
        <p className="mt-3 text-slate-700">
          The fundamental object is the <strong>person</strong>, not the campus or county.
          Every participant gets a share link, QR code, and network board.
          Relationships are stored as a referral graph.
        </p>
        <div className="mt-4 rounded-lg bg-slate-900 p-4 font-mono text-sm text-green-400">
          <pre>{`Steve
├── Sarah → Josh, Emma, Nick
├── Michael → Hannah, David
└── Emily → Chris, Noah, Olivia`}</pre>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Deployment Pipeline</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {["H: Drive", "git commit", "GitHub push", "Netlify build", "Live site"].map(
            (step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded bg-brand-100 px-3 py-1 font-medium text-brand-800">{step}</span>
                {i < arr.length - 1 && <span className="text-slate-400">→</span>}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
