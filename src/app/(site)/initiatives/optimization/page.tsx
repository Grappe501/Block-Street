import { ImprovementDashboard } from "@/features/initiatives/components/ImprovementDashboard";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.1/ux";

export default function InitiativeOptimizationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
        {DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_name}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Institutional optimization</h1>
      <p className="mt-2 text-slate-600">
        Continuous improvement, simulations, and organizational health — every recommendation stays advisory until Humans accept it.
      </p>
      <div className="mt-8">
        <ImprovementDashboard />
      </div>
    </div>
  );
}
