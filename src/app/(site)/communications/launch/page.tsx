import { CommunicationProductionLaunchDashboard } from "@/features/communications/components/CommunicationProductionLaunchDashboard";
import { DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.7/ux/experience-context";

export default function CommunicationLaunchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
        {DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT.institution_name}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Communication launch control</h1>
      <p className="mt-2 text-slate-600">
        Production readiness, Go/No-Go decision, deployment checklist, and executive sign-off for the Communications
        Engine (COM-002).
      </p>
      <div className="mt-8">
        <CommunicationProductionLaunchDashboard />
      </div>
    </div>
  );
}
