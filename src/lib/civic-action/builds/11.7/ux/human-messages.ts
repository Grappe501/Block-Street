/**
 * CAE-11.7-W4 — Human-readable communication errors
 */
import { isCommunicationDomainError } from "../services/errors";
import type { CommunicationCommandResult } from "../services/commands";
import type { HumanBlockedState } from "./view-models";
import { t } from "./locale";

export function humanizeCommunicationError(error: unknown, locale: "en" | "es" = "en"): HumanBlockedState {
  if (isCommunicationDomainError(error)) {
    switch (error.code) {
      case "COMMUNICATION_PERMISSION_DENIED":
      case "COMMUNICATION_VISIBILITY_DENIED":
        return {
          title: t(locale, "error.permission.title"),
          explanation: t(locale, "error.permission.body"),
          items: [],
          next_action: "Request access from the conversation owner or moderator.",
          support_path: "Get Help",
        };
      case "COMMUNICATION_TRANSITION_NOT_ALLOWED":
        return {
          title: "This change is not available right now.",
          explanation: error.message,
          items: error.suggested_action ? [error.suggested_action] : [],
          next_action: "Follow the governed communication lifecycle steps.",
          support_path: "Get Help",
        };
      case "COMMUNICATION_ARCHIVED_READ_ONLY":
        return {
          title: "This communication is archived.",
          explanation: error.message,
          items: [],
          next_action: "View history or start a new conversation.",
          support_path: "Get Help",
        };
      case "COMMUNICATION_AI_IMPERSONATION_FORBIDDEN":
        return {
          title: "AI cannot speak as a Human here.",
          explanation: error.human_message ?? error.message,
          items: [],
          next_action: "Use AI suggestions — you decide what to post.",
          support_path: "Get Help",
        };
      case "COMMUNICATION_INVITATION_REQUIRED":
        return {
          title: "You need an invitation to participate.",
          explanation: error.message,
          items: [error.blocking_requirement ?? "Ask to be added as a participant."],
          next_action: "Contact the conversation owner.",
          support_path: "Get Help",
        };
      default:
        return {
          title: "This action could not be completed.",
          explanation: error.human_message ?? error.message,
          items: [],
          support_path: "Get Help",
        };
    }
  }
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  return { title: "Something went wrong.", explanation: message, items: [], support_path: "Get Help" };
}

export function humanizeCommunicationCommandFailure(
  result: CommunicationCommandResult,
  locale: "en" | "es" = "en"
): HumanBlockedState | null {
  if (result.success) return null;
  if (result.validation_errors.length > 0) {
    return {
      title: "We cannot move forward yet.",
      explanation: "A few items still need attention:",
      items: result.validation_errors.map((e) => e.human_message ?? e.message),
      next_action: result.next_required_actions[0] ?? "Review the checklist and try again.",
      support_path: "Get Help",
    };
  }
  return {
    title: "The command did not complete.",
    explanation: result.warnings.join(" ") || "Please review and try again.",
    items: result.next_required_actions,
    support_path: "Get Help",
  };
}
