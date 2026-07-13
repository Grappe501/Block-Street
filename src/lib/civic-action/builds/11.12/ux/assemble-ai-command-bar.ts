/**
 * CAE-11.12-W4 — AI command bar (advisory only)
 */
import type { AICommandBarView } from "./view-models";

export function assembleAICommandBar(): AICommandBarView {
  return {
    prompts: [
      "Summarize this article.",
      "Explain this competency.",
      "Show everything related to this Mission.",
      "What do I need before certification?",
      "Find contradictory guidance.",
      "Translate this explanation into conversational Spanish.",
    ],
    advisory_only: true,
    canonical_mutation_allowed: false,
  };
}
