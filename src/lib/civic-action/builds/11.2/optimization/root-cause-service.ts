/**
 * CAE-11.2-W7 — Root cause categorization
 */
export const ROOT_CAUSE_CATEGORIES = [
  "planning",
  "communication",
  "training",
  "capacity",
  "funding",
  "governance",
  "technology",
  "community",
  "scheduling",
  "dependencies",
] as const;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  planning: ["plan", "scope", "charter", "objective", "strategy"],
  communication: ["communicat", "message", "email", "notify", "stakeholder"],
  training: ["train", "skill", "onboard", "learn", "procedure"],
  capacity: ["capacity", "staff", "volunteer", "workload", "burnout"],
  funding: ["fund", "budget", "cost", "resource", "money"],
  governance: ["approv", "governance", "policy", "authority", "committee"],
  technology: ["tech", "platform", "tool", "system", "data"],
  community: ["community", "engagement", "participation", "trust"],
  scheduling: ["delay", "schedule", "timeline", "late", "slip"],
  dependencies: ["depend", "block", "prerequisite", "waiting", "upstream"],
};

export function inferRootCauses(text: string, categoryHint?: string): string[] {
  const lower = `${text} ${categoryHint ?? ""}`.toLowerCase();
  const matched = ROOT_CAUSE_CATEGORIES.filter((cat) =>
    CATEGORY_KEYWORDS[cat]?.some((kw) => lower.includes(kw))
  );
  return matched.length ? matched : categoryHint ? [categoryHint] : ["planning"];
}

export function categorizeRootCause(observation: string): string {
  return inferRootCauses(observation)[0] ?? "planning";
}
