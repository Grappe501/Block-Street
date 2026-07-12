/**
 * CAE-11.1-W4 — Translate domain errors into Human language
 */
import { isInitiativeDomainError } from "../services/errors";
import type { InitiativeCommandResult } from "../services/commands";
import type { HumanBlockedState } from "./view-models";

export function humanizeDomainError(error: unknown): HumanBlockedState {
  if (isInitiativeDomainError(error)) {
    switch (error.code) {
      case "INITIATIVE_CHARTER_INCOMPLETE":
        return {
          title: "This Initiative is not ready for that step yet.",
          explanation: "Some required charter content is still missing.",
          items: error.details.missing_fields
            ? (error.details.missing_fields as string[])
            : [error.message],
          responsible_role: "Charter author or Operational Owner",
          next_action: "Complete the charter workbench sections marked as required.",
          support_path: "Get Help",
        };
      case "INITIATIVE_PERMISSION_DENIED":
        return {
          title: "You can review this Initiative, but you do not have authority for this action.",
          explanation: error.message,
          items: [],
          next_action: "Contact the Operational Owner or an Initiative administrator.",
          support_path: "Get Help",
        };
      case "INITIATIVE_OWNER_REQUIRED":
        return {
          title: "This Initiative needs an Operational Owner.",
          explanation: "New high-risk activity is paused until an eligible Human accepts responsibility.",
          items: ["Assign and confirm an Operational Owner before continuing."],
          responsible_role: "Executive Owner or sponsoring authority",
          next_action: "Open the People section to nominate or accept ownership.",
          support_path: "Get Help",
        };
      case "INITIATIVE_OWNER_INELIGIBLE":
        return {
          title: "The proposed owner cannot serve in this role.",
          explanation: error.message,
          items: ["Choose another eligible Human."],
          next_action: "Choose Another Human",
          support_path: "Get Help",
        };
      case "INITIATIVE_TRANSITION_NOT_ALLOWED":
        return {
          title: "This lifecycle change is not available right now.",
          explanation: error.message,
          items: error.current_state
            ? [`Current state: ${error.current_state}`, `Requested: ${error.requested_state ?? "change"}`]
            : [],
          next_action: "Review readiness and required approvals.",
          support_path: "Get Help",
        };
      case "INITIATIVE_BLOCKING_DEPENDENCY":
        return {
          title: "This Initiative cannot proceed until a dependency is resolved.",
          explanation: error.message,
          items: [],
          next_action: "Open Dependencies to review blocking items.",
          support_path: "Get Help",
        };
      case "INITIATIVE_ARCHIVED_READ_ONLY":
        return {
          title: "This Initiative is archived.",
          explanation: "Ordinary work is read-only. History remains available for learning and accountability.",
          items: [],
          next_action: "Create a successor Initiative for substantial new work.",
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
  return {
    title: "Something went wrong.",
    explanation: message,
    items: [],
    support_path: "Get Help",
  };
}

export function humanizeCommandFailure(result: InitiativeCommandResult): HumanBlockedState | null {
  if (result.success) return null;
  if (result.validation_errors.length > 0) {
    return {
      title: "This Initiative cannot move forward yet.",
      explanation: "A few items still need attention:",
      items: result.validation_errors.map((e) => e.message),
      next_action: result.next_required_actions[0] ?? "Review the checklist and try again.",
      support_path: "Get Help",
    };
  }
  return {
    title: "The command did not complete.",
    explanation: result.warnings.join(" ") || "Please review the Initiative state and try again.",
    items: result.next_required_actions,
    support_path: "Get Help",
  };
}

export function humanizeActivationBlockers(blockers: string[]): HumanBlockedState {
  return {
    title: "This Initiative cannot become active yet.",
    explanation: "Three things may still need attention:",
    items: blockers.length ? blockers : ["Review the readiness checklist."],
    next_action: "Open the Readiness Center",
    support_path: "Get Help",
  };
}
