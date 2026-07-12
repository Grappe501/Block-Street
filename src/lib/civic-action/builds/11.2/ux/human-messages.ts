/**
 * CAE-11.2-W4 — Human-readable execution errors
 */
import { isExecutionDomainError } from "../services/errors";
import type { ExecutionCommandResult } from "../services/commands";
import type { HumanBlockedState } from "./view-models";
import { t } from "./locale";

export function humanizeExecutionError(error: unknown, locale: "en" | "es" = "en"): HumanBlockedState {
  if (isExecutionDomainError(error)) {
    switch (error.code) {
      case "EXECUTION_PERMISSION_DENIED":
        return {
          title: t(locale, "error.permission.title"),
          explanation: t(locale, "error.permission.body"),
          items: [],
          next_action: "Request access from your Institution Administrator.",
          support_path: "Get Help",
        };
      case "EXECUTION_TRANSITION_NOT_ALLOWED":
        return {
          title: "This change is not available right now.",
          explanation: error.message,
          items: error.suggested_action ? [error.suggested_action] : [],
          next_action: "Follow the lawful lifecycle steps.",
          support_path: "Get Help",
        };
      case "EXECUTION_PARENT_CONSTRAINT":
        return {
          title: "Parent work is not ready for this step.",
          explanation: error.message,
          items: [],
          next_action: "Complete or activate parent Objective or Mission first.",
          support_path: "Get Help",
        };
      case "EXECUTION_OWNER_REQUIRED":
        return {
          title: "Owners must be assigned before activation.",
          explanation: error.message,
          items: [error.blocking_requirement ?? "Assign executive and operational owners."],
          next_action: "Open Settings to assign owners.",
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

export function humanizeExecutionCommandFailure(result: ExecutionCommandResult, locale: "en" | "es" = "en"): HumanBlockedState | null {
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
