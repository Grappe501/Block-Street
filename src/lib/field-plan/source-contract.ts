import sourceContract from "../../../data/field-plan/source-contract.json";
import spineState from "../../../data/field-plan/ingestion/spine-state.json";
import reviewQueue from "../../../data/field-plan/ingestion/review-queue.json";
import conflictQueue from "../../../data/field-plan/ingestion/conflict-queue.json";

export type FieldPlanReviewStatus = (typeof sourceContract.review_statuses)[number];
export type FieldPlanEntityKind = (typeof sourceContract.entity_kinds)[number];

export function getFieldPlanSourceContract() {
  return sourceContract;
}

export function getFieldPlanSpineState() {
  return spineState;
}

export function fieldPlanBroadIngestAllowed(): boolean {
  return sourceContract.broad_content_ingest_allowed === true;
}

export function listFieldPlanGates() {
  return sourceContract.gates_before_broad_ingest;
}

export function listReviewQueueItems() {
  return reviewQueue.items ?? [];
}

export function listConflictQueueItems() {
  return conflictQueue.items ?? [];
}

export function enqueueMappingReview(item: {
  stable_id: string;
  title: string;
  reason: string;
  mapping_answers?: Record<string, string | null>;
}) {
  return {
    ...item,
    review_status: "queued_for_review" as const,
    policy: sourceContract.conflict_policy,
    queued_at: new Date().toISOString(),
  };
}

/** Required fields on every imported Field Plan record. */
export function missingRequiredRecordFields(record: Record<string, unknown>): string[] {
  return sourceContract.required_record_fields.filter((f) => {
    const v = record[f];
    return v === undefined || v === null || v === "";
  });
}
