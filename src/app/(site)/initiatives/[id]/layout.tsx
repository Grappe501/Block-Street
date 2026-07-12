import { notFound } from "next/navigation";
import {
  assembleWorkspaceShell,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";
import { InitiativeWorkspaceShell } from "@/features/initiatives/components/InitiativeWorkspaceShell";

export default async function InitiativeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shell = assembleWorkspaceShell(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
  if (!shell) notFound();

  return <InitiativeWorkspaceShell shell={shell}>{children}</InitiativeWorkspaceShell>;
}
