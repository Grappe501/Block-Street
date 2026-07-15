import type { EventReadinessDimension } from "../operations/types";

export type CalendarTemplateCategory =
  | "organizing"
  | "voter_registration"
  | "volunteer"
  | "leadership"
  | "campaign"
  | "candidate"
  | "fundraising"
  | "community"
  | "media"
  | "partner"
  | "training"
  | "internal_operations";

export type CalendarTemplateVolunteerRole = {
  roleKey: string;
  title: string;
  numberNeeded: number;
  trainingRequired: boolean;
  required: boolean;
};

export type CalendarTemplateTask = {
  taskKey: string;
  title: string;
  required: boolean;
};

export type CalendarTemplateLogisticsItem = {
  itemKey: string;
  label: string;
  required: boolean;
};

export type CalendarTemplateMaterial = {
  materialKey: string;
  label: string;
  required: boolean;
};

export type CalendarTemplatePromotionItem = {
  itemKey: string;
  label: string;
  required: boolean;
};

export type CalendarTemplateReminder = {
  reminderKey: string;
  label: string;
  offsetHours: number;
};

export type CalendarTemplateReportField = {
  fieldKey: string;
  label: string;
  required: boolean;
  metricType?: "count" | "boolean" | "text";
  disclaimer?: string;
};

export type CalendarTemplateCandidateRequestDefaults = {
  defaultMode: "not_applicable" | "optional" | "recommended" | "required";
  briefingRequired: boolean;
  travelReviewRequired: boolean;
  publicLanguageApprovalRequired: boolean;
};

export type CalendarEventTemplate = {
  templateId: string;
  slug: string;
  version: string;
  status: "draft" | "active" | "retired";
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: CalendarTemplateCategory;
  eventType: string;
  recurringSuitable: boolean;
  recommendedFor: {
    campaignWide: boolean;
    college: boolean;
    county: boolean;
    city: boolean;
    team: boolean;
  };
  defaults: {
    publicTitlePattern?: string;
    internalTitlePattern?: string;
    publicSummary?: string;
    internalPurpose?: string;
    durationMinutes: number;
    visibility: "public" | "internal" | "private";
    timezone: string;
    candidateAttendance: "not_applicable" | "optional" | "recommended" | "required";
    approvalPathKey: string;
    publicationRequired: boolean;
    rsvpMode: "none" | "optional" | "recommended" | "required";
  };
  ownership: {
    suggestedRoleKeys: string[];
    owningTeamKeys: string[];
    ownerRequired: boolean;
  };
  readiness: {
    requiredDimensions: EventReadinessDimension[];
    optionalDimensions: EventReadinessDimension[];
    nonApplicableDimensions: EventReadinessDimension[];
  };
  volunteerRoles: CalendarTemplateVolunteerRole[];
  tasks: CalendarTemplateTask[];
  logistics: CalendarTemplateLogisticsItem[];
  materials: CalendarTemplateMaterial[];
  promotion: CalendarTemplatePromotionItem[];
  reminders: CalendarTemplateReminder[];
  reportFields: CalendarTemplateReportField[];
  candidateRequest?: CalendarTemplateCandidateRequestDefaults;
  complianceNotes: string[];
  accessibilityNotes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CalendarEventDraft = {
  title: string;
  description: string;
  event_type: string;
  start_at: string;
  end_at: string;
  visibility: "public" | "internal" | "private" | "team" | "command";
  location_name?: string | null;
  city?: string | null;
  county_slug?: string | null;
  college_slugs: string[];
  county_slugs: string[];
  city_slugs: string[];
  campaign_wide: boolean;
  owned_by_team?: string | null;
  primary_contact?: string | null;
  kelly_requested: boolean;
  template_id: string;
  template_version: string;
  template_applied_at: string;
  template_snapshot: Record<string, unknown>;
  template_readiness: CalendarEventTemplate["readiness"];
};

export type CalendarGeneratedTask = CalendarTemplateTask & { generated: true };
export type CalendarGeneratedVolunteerRole = CalendarTemplateVolunteerRole & { generated: true };
export type CalendarGeneratedLogisticsItem = CalendarTemplateLogisticsItem & { generated: true };
export type CalendarGeneratedMaterial = CalendarTemplateMaterial & { generated: true };
export type CalendarGeneratedPromotionItem = CalendarTemplatePromotionItem & { generated: true };
export type CalendarGeneratedReportRequirement = CalendarTemplateReportField & { generated: true };

export type ApplyTemplateInput = {
  template: CalendarEventTemplate;
  scopeSelection: {
    collegeSlugs: string[];
    countySlugs: string[];
    citySlugs: string[];
    teamIds: string[];
    campaignWide: boolean;
  };
  overrides: Partial<{
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    location_name: string;
    owned_by_team: string;
    primary_contact: string;
    kelly_requested: boolean;
    visibility: CalendarEventDraft["visibility"];
  }>;
};

export type ApplyTemplateResult = {
  eventDraft: CalendarEventDraft;
  generatedTasks: CalendarGeneratedTask[];
  generatedVolunteerRoles: CalendarGeneratedVolunteerRole[];
  generatedLogistics: CalendarGeneratedLogisticsItem[];
  generatedMaterials: CalendarGeneratedMaterial[];
  generatedPromotionItems: CalendarGeneratedPromotionItem[];
  generatedReportRequirements: CalendarGeneratedReportRequirement[];
  warnings: string[];
  blockedReasons: string[];
};

export type TemplateFilter = {
  category?: CalendarTemplateCategory;
  collegeSlug?: string;
  countySlug?: string;
  campaignWide?: boolean;
  candidateInvolvement?: boolean;
  volunteerNeed?: boolean;
  visibility?: "public" | "internal" | "private";
  recurringSuitable?: boolean;
  eventType?: string;
  keyword?: string;
  status?: "active" | "retired" | "draft";
};
