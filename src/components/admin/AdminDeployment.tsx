import type { BuildProgress } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export function AdminDeployment({ progress }: { progress: BuildProgress }) {
  const { project } = progress;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Deployment Status</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">GitHub Repository</p>
              <p className="text-sm text-slate-500">{project.githubRepo ?? "Pending first push"}</p>
            </div>
            <StatusBadge status={project.githubRepo ? "done" : "pending"} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">Netlify Deploy</p>
              <p className="text-sm text-slate-500">
                {project.deployUrl ?? "Not connected"}
              </p>
            </div>
            <StatusBadge status={project.netlifyStatus === "live" ? "done" : "pending"} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">Netlify DB (Postgres)</p>
              <p className="text-sm text-slate-500">Phase 2 — after Netlify site connected</p>
            </div>
            <StatusBadge status={project.databaseStatus === "not_connected" ? "pending" : "done"} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-900">File System</p>
              <p className="text-sm text-slate-500">H: drive only — .npmrc enforced</p>
            </div>
            <StatusBadge status="done" />
          </div>
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="font-bold text-amber-900">Next: Connect Netlify</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-amber-800">
          <li>GitHub repo will be created and pushed (this step)</li>
          <li>You connect the repo in Netlify dashboard</li>
          <li>Share the Netlify URL — we update build-progress.json</li>
          <li>Phase 2: Enable Netlify DB and run migrations</li>
        </ol>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Build Configuration</h2>
        <div className="mt-3 space-y-1 font-mono text-sm text-slate-600">
          <p>netlify.toml → @netlify/plugin-nextjs</p>
          <p>Build command: npm run build</p>
          <p>Node version: 22</p>
          <p>NPM cache: H:/Block-Street/.npm-cache</p>
        </div>
      </div>
    </div>
  );
}
