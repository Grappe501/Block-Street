/**
 * CAE-11.12-W4 — Certification workspace assembler
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import type { CertificationWorkspaceView } from "./view-models";

export function assembleCertificationWorkspace(ctx: KnowledgeExperienceContext): CertificationWorkspaceView {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "certifications");
  const awards = knowledgeApplicationService.listCertificationAwards(ctx.institution_id, ctx.actor_human_id);
  const certifications = knowledgeApplicationService.listCertifications(ctx.institution_id);

  return {
    shell,
    held: awards.map((a) => ({
      id: a.canonical_id,
      title: certifications.find((c) => c.canonical_id === a.certification_id)?.display_name ?? "Credential",
      issued_at: a.awarded_at ?? null,
      expires_at: a.expires_at ?? null,
      verify_href: `/api/public/v1/credentials/verify/${a.public_id ?? a.canonical_id}`,
    })),
    in_progress: certifications
      .filter((c) => c.lifecycle_state === "active")
      .slice(0, 3)
      .map((c) => ({
        id: c.canonical_id,
        title: c.display_name,
        remaining: ["Complete required courses", "Pass assessment", "Human approval"],
        href: `/learning/certifications/${c.canonical_id}`,
      })),
    blocked: [],
    renewal_actions: awards
      .filter((a) => a.expires_at)
      .map((a) => ({
        id: a.canonical_id,
        label: "Review renewal requirements",
        href: `/learning/certifications/${a.certification_id}`,
      })),
  };
}
