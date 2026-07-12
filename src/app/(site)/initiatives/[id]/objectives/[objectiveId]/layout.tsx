import { notFound } from "next/navigation";
import {
  assembleObjectiveWorkspaceShell,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";
import { ObjectiveWorkspaceShell } from "@/features/objectives/components/ObjectiveWorkspaceShell";

export default async function ObjectiveLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; objectiveId: string }>;
}) {
  const { id, objectiveId } = await params;
  const shell = assembleObjectiveWorkspaceShell(id, objectiveId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
  if (!shell) notFound();

  return <ObjectiveWorkspaceShell shell={shell}>{children}</ObjectiveWorkspaceShell>;
}
