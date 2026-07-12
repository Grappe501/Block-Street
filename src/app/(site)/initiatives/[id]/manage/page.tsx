import { notFound } from "next/navigation";
import {
  assembleInitiativeOverview,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";
import { InitiativeLifecycleActions } from "@/features/initiatives/components/InitiativeLifecycleActions";

export default async function InitiativeManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const overview = assembleInitiativeOverview(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
  if (!overview) notFound();

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold">Lifecycle Controls</h2>
        <p className="mt-1 text-sm text-slate-600">Major changes use explicit governed workflows — never direct status editing.</p>
      </div>
      <InitiativeLifecycleActions actions={overview.lifecycle_actions} />
    </div>
  );
}
