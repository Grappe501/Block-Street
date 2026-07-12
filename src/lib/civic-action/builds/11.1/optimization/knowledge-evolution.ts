/**
 * CAE-11.1-W7 — Knowledge evolution (living document status)
 */
export type KnowledgeDocumentStatus =
  | "frequently_used"
  | "outdated"
  | "conflicting"
  | "needs_review"
  | "superseded"
  | "recommended";

export type KnowledgeEvolutionItem = {
  document_id: string;
  title: string;
  status: KnowledgeDocumentStatus;
  reason: string;
  last_reviewed_optional?: string;
};

const KNOWLEDGE_CATALOG: KnowledgeEvolutionItem[] = [
  {
    document_id: "charter-template-v1",
    title: "Initiative charter template",
    status: "frequently_used",
    reason: "Referenced on every new Initiative draft.",
  },
  {
    document_id: "volunteer-handbook-2024",
    title: "Volunteer handbook",
    status: "needs_review",
    reason: "Onboarding questions reference outdated steps.",
  },
  {
    document_id: "governance-matrix",
    title: "Governance authority matrix",
    status: "recommended",
    reason: "Aligns with current Wave 3 lifecycle gates.",
  },
];

export function analyzeKnowledgeEvolution(_institutionId: string): KnowledgeEvolutionItem[] {
  return KNOWLEDGE_CATALOG;
}
