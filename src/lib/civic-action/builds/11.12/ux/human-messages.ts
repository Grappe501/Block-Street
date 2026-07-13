/**
 * CAE-11.12-W4 — Human-readable knowledge & learning errors
 */
import { KnowledgeDomainError } from "../services/errors";
import type { HumanBlockedState } from "./view-models";
import { t } from "./locale";

export function humanizeKnowledgeError(error: unknown, locale: "en" | "es" = "en"): HumanBlockedState {
  if (error instanceof KnowledgeDomainError) {
    switch (error.code) {
      case "KNOWLEDGE_PERMISSION_DENIED":
        return {
          title: t(locale, "error.permission.title"),
          explanation: t(locale, "error.permission.body"),
          items: [],
          next_action: "Request access from a steward or administrator.",
          support_path: "Get Help",
        };
      case "KNOWLEDGE_NOT_FOUND":
        return {
          title: "We could not find that item.",
          explanation: error.message,
          items: [],
          next_action: "Try search or ask your steward.",
          support_path: "Get Help",
        };
      default:
        return {
          title: "This action could not be completed.",
          explanation: error.message,
          items: [],
          support_path: "Get Help",
        };
    }
  }
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  return { title: "Something went wrong.", explanation: message, items: [], support_path: "Get Help" };
}
