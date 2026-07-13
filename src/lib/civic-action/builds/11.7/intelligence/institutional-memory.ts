/**
 * CAE-11.7-W6 — Institutional memory (preserved artifacts index)
 */
import { communicationApplicationService } from "../application-service";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { DecisionRecord, DocumentRecord, KnowledgeRecord } from "../data-model";

export type InstitutionalMemoryArtifact = {
  artifact_id: string;
  artifact_type: "decision" | "document" | "knowledge" | "meeting_minutes";
  title: string;
  institution_id: string;
  initiative_id: string;
  preserved_at: string;
  href: string;
  summary: string;
};

export function indexInstitutionalMemory(institutionId: string, initiativeId?: string): InstitutionalMemoryArtifact[] {
  const artifacts: InstitutionalMemoryArtifact[] = [];

  let decisions = readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId && d.lifecycle_state === "approved"
  );
  if (initiativeId) decisions = decisions.filter((d) => d.initiative_id === initiativeId);
  for (const d of decisions) {
    artifacts.push({
      artifact_id: d.canonical_id,
      artifact_type: "decision",
      title: d.display_name,
      institution_id: d.institution_id,
      initiative_id: d.initiative_id,
      preserved_at: d.updated_at,
      href: `/communications/decisions/${d.canonical_id}`,
      summary: d.decision_text.slice(0, 120),
    });
  }

  let documents = readStoreSlice<DocumentRecord>(COMMUNICATION_STORE_KEYS.documents).filter(
    (d) => d.institution_id === institutionId && d.lifecycle_state === "published"
  );
  if (initiativeId) documents = documents.filter((d) => d.initiative_id === initiativeId);
  for (const doc of documents) {
    artifacts.push({
      artifact_id: doc.canonical_id,
      artifact_type: "document",
      title: doc.display_name,
      institution_id: doc.institution_id,
      initiative_id: doc.initiative_id,
      preserved_at: doc.updated_at,
      href: `/communications/documents/${doc.canonical_id}`,
      summary: doc.human_summary_optional ?? "Published document",
    });
  }

  let knowledge = readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
    (k) => k.institution_id === institutionId
  );
  if (initiativeId) knowledge = knowledge.filter((k) => k.initiative_id === initiativeId);
  for (const k of knowledge) {
    artifacts.push({
      artifact_id: k.canonical_id,
      artifact_type: "knowledge",
      title: k.display_name,
      institution_id: k.institution_id,
      initiative_id: k.initiative_id,
      preserved_at: k.updated_at,
      href: `/communications/knowledge`,
      summary: k.knowledge_text.slice(0, 120),
    });
  }

  return artifacts.sort((a, b) => b.preserved_at.localeCompare(a.preserved_at));
}

export function searchInstitutionalMemory(institutionId: string, query: string) {
  const q = query.toLowerCase();
  return indexInstitutionalMemory(institutionId).filter(
    (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
  );
}
