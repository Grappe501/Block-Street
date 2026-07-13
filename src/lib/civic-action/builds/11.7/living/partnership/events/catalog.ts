/**
 * CAE-11.7-W10 — Partnership events
 */
export const PARTNERSHIP_EVENT_CATALOG = [
  { event: "recommendation.reviewed", domain: "partnership", description: "Human reviewed recommendation with evidence" },
  { event: "feedback.received", domain: "feedback", description: "Human feedback recorded for institutional learning" },
  { event: "trust.updated", domain: "trust", description: "Recommendation trust calibration recalculated" },
  { event: "outcome.recorded", domain: "outcome", description: "Decision outcome compared to expectation" },
  { event: "lesson.learned", domain: "wisdom", description: "Institutional lesson captured from outcome" },
  { event: "wisdom.updated", domain: "wisdom", description: "Organizational wisdom accumulated" },
  { event: "institution.evolved", domain: "institution", description: "Living institution maturity updated" },
  { event: "governance.updated", domain: "governance", description: "Governance change versioned and traceable" },
  { event: "reflection.recorded", domain: "learning", description: "Human reflection captured for learning loop" },
  { event: "self_evaluation.completed", domain: "evaluation", description: "AI self-evaluation completed transparently" },
] as const;
