/**
 * CAE-11.12-W5 — Knowledge search projection (visibility-scoped fields only)
 */
import { knowledgeApplicationService } from "../application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import { redactRestrictedSnippet } from "../api/assemble-knowledge-view";

export type KnowledgeSearchDocument = {
  entity_id: string;
  entity_type: string;
  institution_id: string;
  title: string;
  summary: string;
  lifecycle_state: string;
  language: string;
  visibility: string;
  is_current: boolean;
  updated_at: string;
};

const INDEX_KEY = "knowledge_search_index";

export function projectKnowledgeSearchDocument(
  entityId: string,
  entityType: string
): KnowledgeSearchDocument | null {
  if (entityType === "KnowledgeArtifact" || entityType === "knowledge_artifact") {
    const artifact = knowledgeApplicationService.getArtifact(entityId);
    if (!artifact) return null;
    const restricted = artifact.visibility === "private";
    return {
      entity_id: artifact.canonical_id,
      entity_type: "KnowledgeArtifact",
      institution_id: artifact.institution_id,
      title: restricted ? "[restricted]" : artifact.display_name,
      summary: redactRestrictedSnippet(artifact.summary ?? "", !restricted),
      lifecycle_state: artifact.lifecycle_state,
      language: artifact.language,
      visibility: artifact.visibility,
      is_current: artifact.lifecycle_state !== "historical" && artifact.lifecycle_state !== "archived",
      updated_at: artifact.updated_at,
    };
  }
  if (entityType === "Course" || entityType === "course") {
    const course = knowledgeApplicationService.getCourse(entityId);
    if (!course) return null;
    return {
      entity_id: course.canonical_id,
      entity_type: "Course",
      institution_id: course.institution_id,
      title: course.display_name,
      summary: course.description?.slice(0, 200) ?? "",
      lifecycle_state: course.lifecycle_state,
      language: "en",
      visibility: "internal",
      is_current: course.lifecycle_state === "published",
      updated_at: course.updated_at,
    };
  }
  return null;
}

export function upsertKnowledgeSearchIndex(doc: KnowledgeSearchDocument) {
  const index = readStoreSlice<KnowledgeSearchDocument>(INDEX_KEY);
  const next = index.filter((d) => d.entity_id !== doc.entity_id);
  next.push(doc);
  writeStoreSlice(INDEX_KEY, next);
}

export function searchKnowledge(input: {
  institution_id: string;
  query?: string;
  include_historical?: boolean;
  actor_permissions?: string[];
}) {
  let docs = readStoreSlice<KnowledgeSearchDocument>(INDEX_KEY).filter(
    (d) => d.institution_id === input.institution_id
  );

  if (!input.include_historical) {
    docs = docs.filter((d) => d.is_current && d.lifecycle_state !== "archived");
  }

  if (input.query) {
    const q = input.query.toLowerCase();
    docs = docs.filter((d) => {
      if (d.visibility === "private" && !input.actor_permissions?.includes("civic_action.manage")) {
        return false;
      }
      return d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q);
    });
  } else {
    docs = docs.filter((d) => {
      if (d.visibility === "private" && !input.actor_permissions?.includes("civic_action.manage")) {
        return false;
      }
      return true;
    });
  }

  return docs.map((d) => ({
    entity_id: d.entity_id,
    entity_type: d.entity_type,
    title: d.title,
    summary: d.summary,
    lifecycle_state: d.lifecycle_state,
    institution_id: d.institution_id,
    is_current: d.is_current,
    why_this_matched: input.query ? "Keyword match on authorized fields" : "Institution scope",
  }));
}

export function explainKnowledgeSearchResult(entityId: string, institutionId: string) {
  const doc = readStoreSlice<KnowledgeSearchDocument>(INDEX_KEY).find(
    (d) => d.entity_id === entityId && d.institution_id === institutionId
  );
  if (!doc) return null;
  return {
    entity_id: entityId,
    is_current: doc.is_current,
    lifecycle_state: doc.lifecycle_state,
    confidence: "medium",
    version_shown: "current",
  };
}
