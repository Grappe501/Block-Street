/**
 * CAE-11.12-W5 — Scheduled automation (commands and review queues only)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import { knowledgeApplicationService } from "../application-service";

export type KnowledgeAutomationJobRun = {
  job_id: string;
  job_type: string;
  institution_scope: string;
  started_at: string;
  completed_at: string | null;
  status: "running" | "completed" | "failed";
  records_scanned: number;
  commands_requested: number;
  review_queue_items: number;
  correlation_id: string;
};

const JOB_KEY = "knowledge_automation_job_runs";
const REVIEW_QUEUE_KEY = "knowledge_review_queue";

export function runCertificationExpirationScan(institutionId: string) {
  const job: KnowledgeAutomationJobRun = {
    job_id: caeId("kjob"),
    job_type: "certification_expiration_scan",
    institution_scope: institutionId,
    started_at: nowIso(),
    completed_at: null,
    status: "running",
    records_scanned: 0,
    commands_requested: 0,
    review_queue_items: 0,
    correlation_id: caeId("cor"),
  };

  const awards = knowledgeApplicationService.listCertificationAwards(institutionId);
  job.records_scanned = awards.length;
  const queue = readStoreSlice<{ queue_id: string; type: string; target_id: string; created_at: string }>(REVIEW_QUEUE_KEY);

  for (const award of awards) {
    if (award.expires_at && award.lifecycle_state === "awarded") {
      queue.push({
        queue_id: caeId("krq"),
        type: "certification_renewal_review",
        target_id: award.canonical_id,
        created_at: nowIso(),
      });
      job.review_queue_items += 1;
    }
  }

  job.status = "completed";
  job.completed_at = nowIso();
  writeStoreSlice(REVIEW_QUEUE_KEY, queue);
  const jobs = readStoreSlice<KnowledgeAutomationJobRun>(JOB_KEY);
  jobs.push(job);
  writeStoreSlice(JOB_KEY, jobs);
  return job;
}
