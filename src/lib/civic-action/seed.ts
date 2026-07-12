import { recordInitiativeAudit } from "./audit";
import {
  isStoreSeeded,
  persistActionEvidence,
  persistAdaptations,
  persistCoalitionInitiatives,
  persistCommunicationsPlans,
  persistExecutionMissions,
  persistFieldOperations,
  persistInitiatives,
  persistObjectives,
  persistOperationalDecisions,
  persistOperationalEvents,
  persistOperationalIncidents,
  persistOperationalResources,
  persistPlaybooks,
  persistResponsibilities,
  persistResourceAllocations,
  persistWorkstreams,
} from "./data";

const INIT_ID = "ini-youth-civic-2026";
const INST = "inst-block-street";

export function seedCivicActionStore() {
  if (isStoreSeeded()) return { seeded: false, message: "Store already seeded" };

  const initiative = {
    id: INIT_ID,
    institution_id: INST,
    name: "Youth Civic Leadership Initiative",
    public_name_optional: "Youth Civic Leadership",
    description: "Increase active youth civic participation through recruitment, education, council formation, and community service.",
    initiative_type: "leadership_initiative" as const,
    problem_statement: "Declining youth civic participation in target counties",
    purpose: "Develop youth leaders and increase sustained civic engagement",
    target_population: "Youth ages 16–24",
    geographic_scope: "Pulaski, Washington, Benton counties",
    organizational_scope: "inst-block-street",
    executive_owner_human_id: "usr-001",
    operational_owner_human_id: "usr-002",
    start_at: "2026-06-01T00:00:00Z",
    target_end_at: "2026-05-31T23:59:59Z",
    status: "active" as const,
    risk_level: "medium" as const,
    privacy_level: "internal" as const,
  };

  const objective = {
    id: "obj-youth-participation-001",
    initiative_id: INIT_ID,
    title: "Increase active youth participation",
    description: "Grow active youth participants from baseline to target by end of initiative period",
    objective_type: "participation",
    baseline: 120,
    target: 300,
    current_value: 315,
    measurement_method: "Active participant registry with 30-day activity threshold",
    owner_human_id: "usr-002",
    start_at: "2026-06-01T00:00:00Z",
    due_at: "2026-05-31T23:59:59Z",
    status: "completed" as const,
    confidence: "high" as const,
    metric_class: "outcome" as const,
  };

  const workstreams = [
    { id: "ws-recruitment", initiative_id: INIT_ID, name: "Recruitment", description: "School and campus outreach", owner_human_id: "usr-002", status: "active" as const, priority: 1, start_at: "2026-06-01T00:00:00Z", target_end_at: "2026-05-31T23:59:59Z", dependency_ids: [] },
    { id: "ws-education", initiative_id: INIT_ID, name: "Civic Education", description: "Training and curriculum delivery", owner_human_id: "usr-001", status: "active" as const, priority: 2, start_at: "2026-06-15T00:00:00Z", target_end_at: "2026-05-31T23:59:59Z", dependency_ids: [] },
    { id: "ws-council", initiative_id: INIT_ID, name: "Youth Council Formation", description: "Establish youth councils", owner_human_id: "usr-002", status: "active" as const, priority: 2, start_at: "2026-07-01T00:00:00Z", target_end_at: "2026-05-31T23:59:59Z", dependency_ids: ["ws-recruitment"] },
    { id: "ws-service", initiative_id: INIT_ID, name: "Community Service", description: "Service project coordination", owner_human_id: "usr-002", status: "active" as const, priority: 3, start_at: "2026-08-01T00:00:00Z", target_end_at: "2026-05-31T23:59:59Z", dependency_ids: ["ws-education"] },
  ];

  const missions = [
    { id: "msn-school-visit-pulaski", workstream_id: "ws-recruitment", initiative_id: INIT_ID, title: "Pulaski County school visit", purpose: "Recruit youth at target high schools", instructions: "Visit 3 schools, collect interest forms", target_role: "field_lead", required_skills: ["outreach"], estimated_effort: "4h", location_scope: "Pulaski County", owner_human_id: "usr-002", assigned_human_id: "usr-002", start_at: "2026-07-08T00:00:00Z", due_at: "2026-07-15T17:00:00Z", completion_standard: "Attendance recorded, 15+ interest forms", verification_method: "field_evidence", status: "completed" as const, blocker_reason: null },
    { id: "msn-transport-backup", workstream_id: "ws-recruitment", initiative_id: INIT_ID, title: "Backup transportation allocation", purpose: "Resolve transportation blocker for school visit", instructions: "Coordinate partner van for rescheduled visit", target_role: "logistics", required_skills: ["partnerships"], estimated_effort: "2h", location_scope: "Pulaski County", owner_human_id: "usr-001", assigned_human_id: "usr-001", start_at: "2026-07-10T00:00:00Z", due_at: "2026-07-12T17:00:00Z", completion_standard: "Transport confirmed and mission rescheduled", verification_method: "partner_confirmation", status: "completed" as const, blocker_reason: null },
    { id: "msn-mentor-recruit", workstream_id: "ws-education", initiative_id: INIT_ID, title: "Additional mentor recruitment", purpose: "Address mentor capacity shortage", instructions: "Recruit 5 additional mentors", target_role: "recruiter", required_skills: ["mentoring"], estimated_effort: "6h", location_scope: "Statewide", owner_human_id: "usr-002", assigned_human_id: null, start_at: "2026-07-12T00:00:00Z", due_at: "2026-07-20T17:00:00Z", completion_standard: "5 mentors onboarded", verification_method: "attendance", status: "in_progress" as const, blocker_reason: null },
    { id: "msn-public-event", workstream_id: "ws-service", initiative_id: INIT_ID, title: "Public youth leadership event", purpose: "Community visibility and recruitment", instructions: "Execute event with safety and communications approval", target_role: "event_lead", required_skills: ["events"], estimated_effort: "8h", location_scope: "Little Rock", owner_human_id: "usr-001", assigned_human_id: "usr-001", start_at: "2026-07-14T00:00:00Z", due_at: "2026-07-14T22:00:00Z", completion_standard: "Event held with documented attendance", verification_method: "attendance_and_feedback", status: "completed" as const, blocker_reason: null },
    { id: "msn-partnership-washington", workstream_id: "ws-recruitment", initiative_id: INIT_ID, title: "Washington County partnership mission", purpose: "Address participation gap through local partner", instructions: "Establish partnership with county youth coalition", target_role: "partnership_lead", required_skills: ["coalition"], estimated_effort: "5h", location_scope: "Washington County", owner_human_id: "usr-002", assigned_human_id: "usr-002", start_at: "2026-07-11T00:00:00Z", due_at: "2026-07-25T17:00:00Z", completion_standard: "Partnership agreement signed", verification_method: "document", status: "in_progress" as const, blocker_reason: null },
    { id: "msn-blocked-transport", workstream_id: "ws-recruitment", initiative_id: INIT_ID, title: "School visit — transportation failed", purpose: "Original visit blocked", instructions: "Conduct visit when transport available", target_role: "field_lead", required_skills: ["outreach"], estimated_effort: "4h", location_scope: "Pulaski County", owner_human_id: "usr-002", assigned_human_id: "usr-002", start_at: "2026-07-09T00:00:00Z", due_at: "2026-07-10T17:00:00Z", completion_standard: "Visit completed", verification_method: "field_evidence", status: "blocked" as const, blocker_reason: "Transportation unavailable — escalated" },
  ];

  persistInitiatives([initiative]);
  persistObjectives([objective]);
  persistWorkstreams(workstreams);
  persistExecutionMissions(missions);

  persistResponsibilities([
    { id: "rsp-001", initiative_id: INIT_ID, workstream_id: "ws-recruitment", mission_id: null, human_id: "usr-002", institution_membership_id: "mem-002", responsibility_type: "owner", scope: "Recruitment workstream", starts_at: "2026-06-01T00:00:00Z", ends_at: null, status: "active" },
    { id: "rsp-002", initiative_id: INIT_ID, workstream_id: "ws-recruitment", mission_id: null, human_id: "usr-001", institution_membership_id: "mem-001", responsibility_type: "backup", scope: "Recruitment backup", starts_at: "2026-06-01T00:00:00Z", ends_at: null, status: "active" },
    { id: "rsp-003", initiative_id: INIT_ID, workstream_id: "ws-education", mission_id: null, human_id: "usr-001", institution_membership_id: "mem-001", responsibility_type: "owner", scope: "Civic education", starts_at: "2026-06-15T00:00:00Z", ends_at: null, status: "active" },
  ]);

  persistOperationalEvents([
    { id: "evt-training-001", institution_id: INST, initiative_id: INIT_ID, workstream_id: "ws-education", mission_id: null, calendar_scope: "initiative", title: "Youth civic training session", event_type: "training", start_at: "2026-07-12T18:00:00Z", end_at: "2026-07-12T20:00:00Z", timezone: "America/Chicago", location: "Community Center", virtual_location: null, owner_human_id: "usr-001", visibility: "internal", status: "scheduled" },
    { id: "evt-review-001", institution_id: INST, initiative_id: INIT_ID, workstream_id: null, mission_id: null, calendar_scope: "initiative", title: "Weekly initiative review", event_type: "review", start_at: "2026-07-14T10:00:00Z", end_at: "2026-07-14T11:00:00Z", timezone: "America/Chicago", location: null, virtual_location: "https://meet.example/weekly", owner_human_id: "usr-002", visibility: "team", status: "scheduled" },
  ]);

  persistOperationalResources([
    { id: "res-mentors", institution_id: INST, resource_type: "human_time", name: "Mentor capacity", description: "Available mentor hours per week", owner_human_id: "usr-001", quantity: 40, availability: 12, location: null, restriction: null, status: "allocated" },
    { id: "res-transport", institution_id: INST, resource_type: "transportation", name: "Partner van", description: "Coalition partner transportation", owner_human_id: "usr-002", quantity: 2, availability: 1, location: "Pulaski County", restriction: "Advance booking required", status: "available" },
  ]);

  persistResourceAllocations([
    { id: "alloc-transport-001", resource_id: "res-transport", initiative_id: INIT_ID, workstream_id: "ws-recruitment", mission_id: "msn-transport-backup", quantity: 1, starts_at: "2026-07-12T08:00:00Z", ends_at: "2026-07-12T18:00:00Z", approved_by: "usr-001", status: "approved" },
  ]);

  persistCommunicationsPlans([
    { id: "com-outreach-001", initiative_id: INIT_ID, audience: "Youth participants", objective: "Recruit for leadership cohort", message: "Join the Youth Civic Leadership program — learn, serve, lead.", messenger_human_id: "usr-002", channels: ["email", "in_platform"], schedule: "2026-07-13T09:00:00Z", approval_required: true, owner_human_id: "usr-002", status: "approved", ai_drafted: true },
  ]);

  persistFieldOperations([
    { id: "fld-school-visit", initiative_id: INIT_ID, geographic_scope: "Pulaski County", operation_type: "campus_action", field_lead_human_id: "usr-002", team_id: null, start_at: "2026-07-12T14:00:00Z", end_at: "2026-07-12T17:00:00Z", target: "3 high schools", status: "completed" },
  ]);

  persistCoalitionInitiatives([
    { id: "col-washington-youth", host_institution_id: INST, participating_institution_ids: ["inst-block-street", "inst-pulaski-youth"], name: "Washington County Youth Coalition Partnership", purpose: "Shared recruitment in underperforming county", governance_agreement_id: "agr-coalition-001", shared_objectives: ["obj-youth-participation-001"], data_scope: "aggregate_participation_only", start_at: "2026-07-11T00:00:00Z", end_at: "2026-05-31T23:59:59Z", status: "active" },
  ]);

  persistOperationalDecisions([
    { id: "dec-comms-001", institution_id: INST, initiative_id: INIT_ID, decision_type: "communications", question: "Approve youth outreach communication?", options: ["Approve", "Revise", "Reject"], recommendation: "Approve with minor edits", evidence: "Draft reviewed; audience and consent verified", decision_authority_human_id: "usr-001", required_approvers: ["usr-001"], due_at: "2026-07-12T17:00:00Z", status: "approved", decision: "Approved", decided_at: "2026-07-12T10:00:00Z", ai_recommended: true },
    { id: "dec-safety-001", institution_id: INST, initiative_id: INIT_ID, decision_type: "compliance", question: "Approve public event safety plan?", options: ["Approve", "Revise", "Reject"], recommendation: "Approve", evidence: "Safety checklist complete", decision_authority_human_id: "usr-001", required_approvers: ["usr-001"], due_at: "2026-07-13T17:00:00Z", status: "approved", decision: "Approved", decided_at: "2026-07-13T09:00:00Z", ai_recommended: false },
    { id: "dec-partnership-001", institution_id: INST, initiative_id: INIT_ID, decision_type: "partnership", question: "Approve Washington County partnership mission?", options: ["Approve", "Defer", "Reject"], recommendation: "Approve new partnership mission", evidence: "Participation below target in Washington County", decision_authority_human_id: "usr-001", required_approvers: ["usr-001"], due_at: "2026-07-15T17:00:00Z", status: "pending", decision: null, decided_at: null, ai_recommended: true },
  ]);

  persistAdaptations([
    { id: "adp-partnership", initiative_id: INIT_ID, trigger: "objective_off_track", observed_condition: "Washington County participation below target", original_assumption: "Organic growth sufficient", new_evidence: "County participation 40% below projection", recommended_change: "Add partnership mission for local coalition", approved_change: "Approved Washington County partnership mission", approved_by: "usr-001", effective_at: "2026-07-11T00:00:00Z", outcome: "Participation improving", status: "approved" },
  ]);

  persistActionEvidence([
    { id: "evd-event-attendance", initiative_id: INIT_ID, workstream_id: "ws-service", mission_id: "msn-public-event", submitted_by_human_id: "usr-001", evidence_type: "attendance", description: "142 attendees, 23 new volunteer signups", artifact_reference: "attendance-sheet-2026-07-14", occurred_at: "2026-07-14T20:00:00Z", location_scope: "Little Rock", verification_status: "verified", reviewed_by: "usr-002" },
    { id: "evd-council-formed", initiative_id: INIT_ID, workstream_id: "ws-council", mission_id: null, submitted_by_human_id: "usr-002", evidence_type: "document", description: "28 youth council members seated", artifact_reference: "council-roster-2026", occurred_at: "2026-05-20T00:00:00Z", location_scope: "Multi-county", verification_status: "verified", reviewed_by: "usr-001" },
  ]);

  persistPlaybooks([
    { id: "ply-youth-civic-leadership", name: "Youth Civic Leadership Playbook", initiative_type: "leadership_initiative", problem_addressed: "Declining youth civic participation", required_conditions: ["Verified sponsors", "Institution capacity", "Mentor pipeline"], steps: ["Define objective", "Create workstreams", "Assign owners", "Schedule training", "Execute field ops", "Measure outcomes", "After-action review"], roles: ["Initiative owner", "Workstream lead", "Field lead", "Approver"], timeline: "12-month cycle", resources: ["Mentors", "Transportation", "Training space"], risks: ["Capacity shortage", "School calendar conflicts"], success_metrics: ["Active participants", "Council members", "Service hours"], source_initiative_id: INIT_ID, version: "1.0", status: "published" },
  ]);

  persistOperationalIncidents([]);

  recordInitiativeAudit({ initiative_id: INIT_ID, institution_id: INST, actor_human_id: "system", event_type: "initiative_seeded", summary: "Youth Civic Leadership Initiative seeded for CAE-001" });

  return { seeded: true, initiative_id: INIT_ID };
}
