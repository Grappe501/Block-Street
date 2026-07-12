import { ProductionLaunchDashboard } from "@/features/initiatives/components/ProductionLaunchDashboard";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.1/ux";

export default function InitiativeLaunchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_name}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Launch control center</h1>
      <p className="mt-2 text-slate-600">
        Production readiness, Go/No-Go decision, deployment checklist, and executive sign-off — Humans approve every launch.
      </p>
      <div className="mt-8">
        <ProductionLaunchDashboard />
      </div>
    </div>
  );
}
