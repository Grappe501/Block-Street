/**
 * CAE-11.1-W7 — Community intelligence
 */
export type CommunityInsight = {
  insight_id: string;
  category: "concern" | "outreach" | "demographic" | "participation" | "priority" | "relationship";
  title: string;
  summary: string;
  confidence: "observed" | "emerging" | "strong_pattern";
};

export function gatherCommunityIntelligence(_institutionId: string): CommunityInsight[] {
  return [
    {
      insight_id: "ci-youth-participation",
      category: "participation",
      title: "Youth registration interest rising",
      summary: "Community workspace activity suggests increased youth registration inquiries in central counties.",
      confidence: "emerging",
    },
    {
      insight_id: "ci-listening-sessions",
      category: "outreach",
      title: "Listening sessions outperform town halls",
      summary: "Initiatives that began with listening sessions show higher volunteer retention in early lifecycle.",
      confidence: "strong_pattern",
    },
    {
      insight_id: "ci-trust-priority",
      category: "priority",
      title: "Transparency requests recurring",
      summary: "Community feedback themes include clearer approval timelines and public progress updates.",
      confidence: "observed",
    },
    {
      insight_id: "ci-relationship-strength",
      category: "relationship",
      title: "School partnerships strengthening",
      summary: "Cross-institution edges between schools and county bodies increased in relationship graph.",
      confidence: "emerging",
    },
  ];
}
