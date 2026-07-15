export type StaffingCriticality = "optional" | "helpful" | "required" | "critical";

export type CalendarStaffingRequirement = {
  requirementId: string;
  eventId: string;
  roleKey: string;
  roleLabel: string;
  roleDescription: string;
  minimumNeeded: number;
  targetNeeded: number;
  maximumAllowed?: number | null;
  criticality: StaffingCriticality;
  trainingRequirementKeys: string[];
  leadRequired: boolean;
  defaultShiftDurationMinutes?: number | null;
  defaultArrivalOffsetMinutes?: number | null;
  accessibilityNotes?: string | null;
  participantInstructions?: string | null;
  internalNotes?: string | null;
  generatedFromTemplate: boolean;
  templateId?: string | null;
  templateVersion?: string | null;
  status: "draft" | "active" | "fulfilled" | "canceled";
  createdAt: string;
  updatedAt: string;
};

export type CalendarVolunteerShift = {
  shiftId: string;
  eventId: string;
  requirementId: string;
  name: string;
  roleKey: string;
  roleLabel: string;
  startAt: string;
  endAt: string;
  arrivalAt?: string | null;
  checkInOpensAt?: string | null;
  minimumNeeded: number;
  targetNeeded: number;
  maximumAllowed?: number | null;
  leadRequired: boolean;
  shiftLeadUserIds: string[];
  trainingRequirementKeys: string[];
  checkInLocation?: string | null;
  instructions?: string | null;
  accessibilityNotes?: string | null;
  materialsToBring?: string[];
  status: "draft" | "open" | "full" | "closed" | "canceled" | "completed";
  generatedFromRequirement: boolean;
  generatedFromTemplate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CalendarStaffingRoleDefinition = {
  roleKey: string;
  label: string;
  description: string;
  category: string;
  defaultCriticality: StaffingCriticality;
  defaultLeadRequired: boolean;
  defaultTrainingRequirementKeys: string[];
  defaultArrivalOffsetMinutes?: number | null;
  publicSafeDescription: string;
  active: boolean;
};

export type CalendarTrainingRequirement = {
  trainingKey: string;
  label: string;
  description: string;
  category: string;
  completionMode: "self_attested" | "manager_verified" | "system_recorded" | "on_site_briefing";
  validityDays?: number | null;
  requiredForRoleKeys: string[];
  blocksConfirmationIfMissing: boolean;
  allowsInterestIfMissing: boolean;
  active: boolean;
};

export type CalendarVolunteerTrainingStatus = {
  userId: string;
  trainingKey: string;
  status: "not_started" | "in_progress" | "self_attested" | "verified" | "expired" | "waived";
  completedAt?: string | null;
  expiresAt?: string | null;
  verifiedByUserId?: string | null;
  waiverReason?: string | null;
  source: "soft_beta" | "manual" | "system" | "imported";
};

export type CalendarShiftLeadAssignment = {
  assignmentId: string;
  shiftId: string;
  userId: string;
  role: "primary_lead" | "co_lead" | "backup_lead";
  status: "suggested" | "invited" | "accepted" | "declined" | "removed";
  assignedByUserId?: string | null;
  assignedAt?: string | null;
  acceptedAt?: string | null;
  trainingStatus: "unknown" | "missing" | "eligible" | "verified";
  source: "soft_beta" | "template" | "manual";
};

export type CalendarShiftInterest = {
  interestId: string;
  eventId: string;
  shiftId?: string | null;
  requirementId?: string | null;
  userId: string;
  rolePreferenceKeys: string[];
  availability: "available" | "maybe" | "unavailable";
  interestStatus: "interested" | "under_review" | "suggested" | "withdrawn" | "not_selected";
  trainingEligibility: "unknown" | "eligible" | "missing_training" | "expired_training";
  scheduleConflict: "unknown" | "clear" | "possible" | "conflict";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarShiftConfirmation = {
  confirmationId: string;
  shiftId: string;
  eventId: string;
  userId: string;
  status: "confirmed_soft_beta";
  source: "soft_beta" | "manual";
  confirmedAt: string;
  confirmedByUserId?: string | null;
};

export type CoverageStatus =
  | "not_planned"
  | "critical_gap"
  | "under_minimum"
  | "minimum_covered"
  | "target_covered"
  | "overstaffed"
  | "not_required";

export type CalendarShiftCoverage = {
  shiftId: string;
  requirementId: string;
  minimumNeeded: number;
  targetNeeded: number;
  maximumAllowed?: number | null;
  interestedCount: number;
  eligibleInterestCount: number;
  suggestedCount: number;
  acceptedLeadCount: number;
  confirmedCount: number;
  minimumGap: number;
  targetGap: number;
  leadRequired: boolean;
  leadCovered: boolean;
  trainingEligibleCount: number;
  trainingGap: number;
  coverageStatus: CoverageStatus;
  confidence: "low" | "medium" | "high";
  reasons: string[];
};

export type EventStaffingOverallStatus =
  | "not_required"
  | "no_plan"
  | "critical_shortage"
  | "understaffed"
  | "minimum_staffed"
  | "fully_staffed"
  | "overstaffed";

export type CalendarEventStaffingSummary = {
  eventId: string;
  requirementCount: number;
  shiftCount: number;
  requiredPositions: number;
  targetPositions: number;
  confirmedPositions: number;
  eligibleInterestCount: number;
  totalInterestCount: number;
  requirementsBelowMinimum: number;
  criticalRequirementsBelowMinimum: number;
  shiftsMissingLead: number;
  shiftsWithTrainingGap: number;
  overallStatus: EventStaffingOverallStatus;
  attentionReasons: string[];
  primaryNextAction?: { label: string; route: string } | null;
};

export type GenerateShiftsFromRequirementInput = {
  eventId: string;
  requirementId: string;
  pattern: "single" | "setup_program_breakdown" | "equal_blocks" | "custom";
  blockCount?: number;
  customBlocks?: Array<{ name: string; startAt: string; endAt: string }>;
};

export type CreateRequirementInput = Omit<
  CalendarStaffingRequirement,
  "requirementId" | "createdAt" | "updatedAt" | "status"
> & { status?: CalendarStaffingRequirement["status"] };

export type CreateShiftInput = Omit<
  CalendarVolunteerShift,
  "shiftId" | "createdAt" | "updatedAt" | "status" | "shiftLeadUserIds"
> & {
  status?: CalendarVolunteerShift["status"];
  shiftLeadUserIds?: string[];
};
