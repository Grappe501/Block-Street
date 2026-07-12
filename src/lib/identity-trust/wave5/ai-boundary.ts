/** AI boundary enforcement — signals require Human review, never automatic action */

export function getAiIdentityRecommendation(question: string): {
  answer: string;
  advisory_only: true;
  cannot_approve: true;
  cannot_remove: true;
} {
  const lower = question.toLowerCase();
  const blocked = [
    "remove",
    "delete",
    "merge",
    "restrict",
    "ban",
    "fraud",
    "punish",
    "revoke",
    "deny appeal",
    "rank",
    "score",
  ];
  const isConsequential = blocked.some((w) => lower.includes(w));

  if (isConsequential) {
    return {
      answer: `I cannot perform or recommend automatic identity actions for: "${question}". Identity intelligence detects patterns; accountable Humans determine meaning. Route this matter to governed Human review (Wave 3 governance or Wave 6 intelligence review).`,
      advisory_only: true,
      cannot_approve: true,
      cannot_remove: true,
    };
  }

  return {
    answer: `Advisory response for "${question}": Identity decisions require human review board action. AI can detect patterns and recommend reviews but cannot approve, deny, merge, restrict, or remove identities.`,
    advisory_only: true,
    cannot_approve: true,
    cannot_remove: true,
  };
}
