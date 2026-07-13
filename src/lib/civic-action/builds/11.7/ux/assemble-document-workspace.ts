/**
 * CAE-11.7-W4 — Document workspace assembler
 */
import { communicationApplicationService } from "../application-service";
import type { CommunicationExperienceContext } from "./experience-context";
import { humanLabel } from "./experience-context";
import { assembleCollaborationWorkbenchShell } from "./assemble-workbench-shell";
import { resolveDocumentActions } from "./ui-actions";
import type { DocumentWorkspaceView } from "./view-models";

export function assembleDocumentWorkspace(
  documentId: string,
  ctx: CommunicationExperienceContext
): DocumentWorkspaceView | null {
  const document = communicationApplicationService.getDocument(documentId);
  if (!document) return null;

  const shell = assembleCollaborationWorkbenchShell(ctx, "contributor", "documents");

  return {
    shell,
    document_id: document.canonical_id,
    display_name: document.display_name,
    status_label: document.lifecycle_state,
    content_preview: document.content.slice(0, 500),
    editors: document.editor_human_ids.map(humanLabel),
    reviewers: document.reviewer_human_ids.map(humanLabel),
    governed_actions: resolveDocumentActions(document, ctx),
  };
}
