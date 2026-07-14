import framework from "../../../data/field-plan/victory-field-framework.json";
import positionContent from "../../../data/field-plan/position-content.json";

export {
  enqueueMappingReview,
  fieldPlanBroadIngestAllowed,
  getFieldPlanSourceContract,
  getFieldPlanSpineState,
  listConflictQueueItems,
  listFieldPlanGates,
  listReviewQueueItems,
  missingRequiredRecordFields,
} from "./source-contract";

export function getVictoryFieldFramework() {
  return framework;
}

export function fieldPlanFrameworkStatus(): string {
  return framework.status;
}

export function fieldPlanDoctrine(): string {
  return framework.doctrine;
}

export function listFieldPlanPhases() {
  return framework.phases;
}

export function listIngestedRoleKeys(): string[] {
  return Object.keys(positionContent.by_role_key ?? {});
}

export function getRoleFieldPlanContent(roleKey: string) {
  return (positionContent.by_role_key as Record<string, Record<string, string> | undefined>)[roleKey] ?? null;
}
