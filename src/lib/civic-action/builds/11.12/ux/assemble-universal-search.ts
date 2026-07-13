/**
 * CAE-11.12-W4 — Universal search assembler
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeExperienceContext } from "./experience-context";
import { resolveLearningExperienceRole } from "./experience-context";
import { assembleLearningWorkbenchShell } from "./assemble-workbench-shell";
import { t } from "./locale";
import type { UniversalSearchView } from "./view-models";

export function assembleUniversalSearch(
  ctx: KnowledgeExperienceContext,
  query: string
): UniversalSearchView {
  const role = resolveLearningExperienceRole(ctx.permissions);
  const shell = assembleLearningWorkbenchShell(ctx, role, "knowledge");
  const q = query.toLowerCase().trim();
  const results: UniversalSearchView["results"] = [];

  for (const a of knowledgeApplicationService.listArtifacts(ctx.institution_id)) {
    if (q && !a.display_name.toLowerCase().includes(q) && !(a.summary ?? "").toLowerCase().includes(q)) continue;
    const badge =
      a.lifecycle_state === "historical" || a.lifecycle_state === "archived"
        ? "historical"
        : a.lifecycle_state === "draft"
          ? "draft"
          : "current";
    results.push({
      id: a.canonical_id,
      type: "knowledge",
      title: a.display_name,
      snippet: (a.summary ?? "").slice(0, 120),
      href: `/learning/knowledge/${a.canonical_id}`,
      badge,
    });
  }

  for (const c of knowledgeApplicationService.listCourses(ctx.institution_id)) {
    if (q && !c.display_name.toLowerCase().includes(q)) continue;
    results.push({
      id: c.canonical_id,
      type: "course",
      title: c.display_name,
      snippet: "Learning course",
      href: `/learning/courses/${c.canonical_id}`,
      badge: c.lifecycle_state === "published" ? "current" : "draft",
    });
  }

  return {
    shell,
    query,
    results: results.slice(0, 20),
    placeholder: t(ctx.locale, "search.placeholder"),
  };
}
