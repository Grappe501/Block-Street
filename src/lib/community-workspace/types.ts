export type CommunityKind = "county" | "institution" | "high_school" | "private_charter";

export type FunctionalRoleId =
  | "community_lead"
  | "social_lead"
  | "event_lead"
  | "registration_lead"
  | "canvass_lead"
  | "phone_bank_lead"
  | "postcard_lead";

export type RoleStatus = "open" | "interim" | "active";

export type GoalKind = "registration" | "vote_participation";

export type RepresentationStatus = "needs_organizer" | "building" | "active";

export type CommunityGoal = {
  kind: GoalKind;
  label: string;
  target: number;
  current: number;
  deadline: string;
  percent: number;
};

export type RoleAssignment = {
  role: FunctionalRoleId;
  label: string;
  holderName: string | null;
  status: RoleStatus;
  isOrganizingSpine?: boolean;
};

export type MeetupStatus = "scheduled" | "needs_social_lead";

export type SocialMeetup = {
  status: MeetupStatus;
  title: string;
  theme: string;
  wherePublic: string;
  when?: string;
  rhythm: string | null;
  rsvpCount?: number;
};

export type FunctionalLane = {
  id: string;
  label: string;
  leadRole: FunctionalRoleId;
  leadName: string | null;
  leadStatus: RoleStatus;
  nextActivation: string;
};

export type PulseItem = {
  id: string;
  text: string;
  tone: "info" | "action" | "celebrate";
};

export type CommunityWorkspaceView = {
  communityId: string;
  kind: CommunityKind;
  slug: string;
  name: string;
  shortName: string;
  countySlug: string;
  countyName: string;
  primaryColor: string;
  representationStatus: RepresentationStatus;
  releaseVersion: string;
  pulse: PulseItem[];
  goals: CommunityGoal[];
  roles: RoleAssignment[];
  meetup: SocialMeetup;
  lanes: FunctionalLane[];
  openRoleCount: number;
  signupCounty: string;
  signupSchool?: string;
  memberCount: number | null;
};

export type WorkspaceSeed = {
  goals?: Partial<Record<GoalKind, { target: number; current: number; deadline: string }>>;
  roles?: Array<{ role: FunctionalRoleId; holderName: string | null; status: RoleStatus }>;
  meetup?: Partial<SocialMeetup>;
  lanes?: Partial<Record<string, { nextActivation: string }>>;
};
