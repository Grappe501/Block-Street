/**
 * CAE-11.6-W15 — Certification events
 */
export const CERTIFICATION_EVENT_CATALOG = [
  { event: "certification.created", domain: "certification", description: "Certification record created with standard" },
  { event: "certification.issued", domain: "certification", description: "Certification issued with evidence" },
  { event: "certification.expired", domain: "certification", description: "Certification expired and flagged for renewal" },
  { event: "audit.completed", domain: "audit", description: "Institutional audit completed with findings" },
  { event: "evidence.recorded", domain: "evidence", description: "Evidence linked to certification" },
  { event: "readiness.assessed", domain: "readiness", description: "Operational readiness assessed across domains" },
  { event: "compliance.violation.detected", domain: "compliance", description: "Continuous compliance violation detected" },
  { event: "launch.approved", domain: "launch", description: "Launch approved after quality gates" },
  { event: "launch.blocked", domain: "launch", description: "Launch blocked pending remediation" },
  { event: "renewal.completed", domain: "renewal", description: "Certification renewed with revalidation" },
] as const;
