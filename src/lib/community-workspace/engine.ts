import workspaceSeeds from "../../../data/communities/workspace-seeds.json";
import {
  getCountyBySlug,
  getInstitutionBySlug,
  getHighSchoolBySlug,
  getPrivateCharterSchoolBySlug,
  type RepresentationStatus,
} from "@/lib/data";
import { getScopeMetrics, listPositionCards } from "@/lib/position-participation";
import { FUNCTIONAL_LANES, FUNCTIONAL_ROLES, roleLabel, toCommunityId } from "./roles";
import type {
  CommunityGoal,
  CommunityKind,
  CommunityWorkspaceView,
  FunctionalRoleId,
  GoalKind,
  PulseItem,
  RoleAssignment,
  RoleStatus,
  SocialMeetup,
  WorkspaceSeed,
} from "./types";

type SeedFile = typeof workspaceSeeds;

const GOAL_LABELS: Record<GoalKind, string> = {
  registration: "Registration Goal",
  vote_participation: "Vote Participation Goal",
};

const DEFAULT_DEADLINES: Record<GoalKind, string> = {
  registration: "2026-10-15",
  vote_participation: "2026-11-03",
};

type CommunityContext = {
  kind: CommunityKind;
  slug: string;
  name: string;
  shortName: string;
  countySlug: string;
  primaryColor: string;
  representationStatus: RepresentationStatus;
  enrollment?: number;
};

function percent(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function resolveContext(kind: CommunityKind, slug: string): CommunityContext | null {
  if (kind === "county") {
    const county = getCountyBySlug(slug);
    if (!county) return null;
    return {
      kind,
      slug,
      name: county.name,
      shortName: county.name.replace(/ County$/, ""),
      countySlug: slug,
      primaryColor: "#0d9488",
      representationStatus: "building",
    };
  }

  if (kind === "institution") {
    const school = getInstitutionBySlug(slug);
    if (!school) return null;
    return {
      kind,
      slug,
      name: school.name,
      shortName: school.shortName,
      countySlug: school.county,
      primaryColor: school.colors.primary,
      representationStatus: school.representationStatus,
      enrollment: school.enrollment,
    };
  }

  if (kind === "high_school") {
    const school = getHighSchoolBySlug(slug);
    if (!school) return null;
    return {
      kind,
      slug,
      name: school.name,
      shortName: school.shortName,
      countySlug: school.county,
      primaryColor: school.colors.primary,
      representationStatus: school.representationStatus,
      enrollment: school.enrollment,
    };
  }

  const school = getPrivateCharterSchoolBySlug(slug);
  if (!school) return null;
  return {
    kind: "private_charter",
    slug,
    name: school.name,
    shortName: school.shortName,
    countySlug: school.county,
    primaryColor: school.colors.primary,
    representationStatus: school.representationStatus,
    enrollment: school.enrollment,
  };
}

function defaultGoals(ctx: CommunityContext, confirmedParticipants: number): CommunityGoal[] {
  const seed = (workspaceSeeds.seeds as Record<string, WorkspaceSeed>)[toCommunityId(ctx.kind, ctx.slug)];
  const metrics = getScopeMetrics({
    kind: ctx.kind,
    slug: ctx.slug,
    enrollment: ctx.enrollment,
  });

  const regTarget = metrics.registration_target;
  const voteTarget = metrics.vote_participation_target;

  // Never invent people via percentage floors. Current = confirmed participants only
  // (or explicit seed.current when operators have published verified tallies).
  return (["registration", "vote_participation"] as GoalKind[]).map((kind) => {
    const seeded = seed?.goals?.[kind];
    const target = seeded?.target ?? (kind === "registration" ? regTarget : voteTarget);
    const current =
      typeof seeded?.current === "number" ? seeded.current : confirmedParticipants;
    const deadline = seeded?.deadline ?? DEFAULT_DEADLINES[kind];
    return {
      kind,
      label: GOAL_LABELS[kind],
      target,
      current,
      deadline,
      percent: percent(current, target),
    };
  });
}

function defaultRoles(ctx: CommunityContext): RoleAssignment[] {
  const seed = (workspaceSeeds.seeds as Record<string, WorkspaceSeed>)[toCommunityId(ctx.kind, ctx.slug)];
  const roleKind = ctx.kind === "county" ? "county" : "institution";
  const seededMap = new Map((seed?.roles ?? []).map((r) => [r.role, r]));

  return FUNCTIONAL_ROLES.map((def) => {
    const seeded = seededMap.get(def.id);
    const holderName = seeded?.holderName ?? null;
    const status: RoleStatus = holderName ? (seeded?.status ?? "active") : "open";
    return {
      role: def.id,
      label: roleLabel(def.id, roleKind),
      holderName,
      status,
      isOrganizingSpine: def.organizingSpine === true,
    };
  });
}

function defaultMeetup(ctx: CommunityContext, roles: RoleAssignment[]): SocialMeetup {
  const seed = (workspaceSeeds.seeds as Record<string, WorkspaceSeed>)[toCommunityId(ctx.kind, ctx.slug)];
  const socialLead = roles.find((r) => r.role === "social_lead");
  const hasSocialLead = socialLead?.status === "active" || socialLead?.status === "interim";

  if (seed?.meetup?.status === "scheduled" || (seed?.meetup?.when && hasSocialLead)) {
    return {
      status: "scheduled",
      title: seed.meetup.title ?? `${ctx.shortName} social`,
      theme: seed.meetup.theme ?? "Meet organizers, bring a friend",
      wherePublic: seed.meetup.wherePublic ?? "Location shared after RSVP",
      when: seed.meetup.when,
      rhythm: seed.meetup.rhythm ?? null,
      rsvpCount: seed.meetup.rsvpCount,
    };
  }

  return {
    status: "needs_social_lead",
    title: seed?.meetup?.title ?? `First ${ctx.shortName} social`,
    theme: seed?.meetup?.theme ?? "In-person gatherings build our network",
    wherePublic: seed?.meetup?.wherePublic ?? "Venue set once Social Lead steps up",
    rhythm: null,
  };
}

function buildLanes(roles: RoleAssignment[], seed?: WorkspaceSeed): CommunityWorkspaceView["lanes"] {
  const roleMap = new Map(roles.map((r) => [r.role, r]));
  const laneSeed = seed?.lanes ?? {};

  return FUNCTIONAL_LANES.map((lane) => {
    const lead = roleMap.get(lane.leadRole);
    const activation =
      laneSeed[lane.id]?.nextActivation ??
      (lead?.holderName
        ? `${lane.label} — connect with ${lead.holderName}`
        : `${lane.label} — needs ${lead?.label ?? "a lead"}`);
    return {
      id: lane.id,
      label: lane.label,
      leadRole: lane.leadRole,
      leadName: lead?.holderName ?? null,
      leadStatus: lead?.status ?? "open",
      nextActivation: activation,
    };
  });
}

function buildPulse(ctx: CommunityContext, goals: CommunityGoal[], roles: RoleAssignment[], meetup: SocialMeetup): PulseItem[] {
  const items: PulseItem[] = [];
  const openRoles = roles.filter((r) => r.status === "open");

  if (openRoles.length > 0) {
    const names = openRoles.slice(0, 2).map((r) => r.label).join(" and ");
    items.push({
      id: "open-roles",
      text: `${openRoles.length} open role${openRoles.length === 1 ? "" : "s"} — including ${names}`,
      tone: "action",
    });
  }

  const regGoal = goals.find((g) => g.kind === "registration");
  if (regGoal) {
    items.push({
      id: "registration",
      text: `${regGoal.percent}% toward our registration goal (${regGoal.current.toLocaleString()} of ${regGoal.target.toLocaleString()})`,
      tone: regGoal.percent >= 50 ? "celebrate" : "info",
    });
  }

  if (meetup.status === "scheduled" && meetup.when) {
    const when = new Date(meetup.when);
    items.push({
      id: "meetup",
      text: `Next social: ${when.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} — ${meetup.title}`,
      tone: "action",
    });
  } else {
    items.push({
      id: "meetup-needed",
      text: "Social Lead needed — our in-person rhythm starts with the first meetup",
      tone: "action",
    });
  }

  if (ctx.representationStatus === "needs_organizer") {
    items.push({
      id: "status",
      text: "We need a founding organizer to launch this community",
      tone: "action",
    });
  } else if (ctx.representationStatus === "building") {
    items.push({
      id: "status",
      text: "Our network is building — help us fill leadership roles",
      tone: "info",
    });
  }

  return items.slice(0, 5);
}

export function assembleCommunityWorkspace(kind: CommunityKind, slug: string): CommunityWorkspaceView | null {
  const ctx = resolveContext(kind, slug);
  if (!ctx) return null;

  const communityId = toCommunityId(kind, slug);
  const seed = (workspaceSeeds.seeds as Record<string, WorkspaceSeed>)[communityId];
  const county = getCountyBySlug(ctx.countySlug);
  const metrics = getScopeMetrics({ kind: ctx.kind, slug: ctx.slug, enrollment: ctx.enrollment });
  const goals = defaultGoals(ctx, metrics.confirmed_participants);
  const roles = defaultRoles(ctx);
  const meetup = defaultMeetup(ctx, roles);
  const positionCards = listPositionCards({ kind: ctx.kind, slug: ctx.slug });
  const openRoleCount = positionCards.filter((c) => c.lead_count + c.volunteer_count === 0).length;

  return {
    communityId,
    kind: ctx.kind,
    slug: ctx.slug,
    name: ctx.name,
    shortName: ctx.shortName,
    countySlug: ctx.countySlug,
    countyName: county?.name ?? ctx.countySlug,
    primaryColor: ctx.primaryColor,
    representationStatus: ctx.representationStatus,
    releaseVersion: workspaceSeeds.releaseVersion,
    pulse: buildPulse(ctx, goals, roles, meetup),
    goals,
    roles,
    meetup,
    lanes: buildLanes(roles, seed),
    openRoleCount,
    signupCounty: ctx.countySlug,
    signupSchool: ctx.kind === "county" ? undefined : ctx.slug,
    memberCount: metrics.confirmed_participants,
    participationMetrics: metrics,
    positionCards,
  };
}

export function getCommunityWorkspaceById(communityId: string): CommunityWorkspaceView | null {
  const [prefix, slug] = communityId.split(":");
  if (!slug) return null;
  switch (prefix) {
    case "county":
      return assembleCommunityWorkspace("county", slug);
    case "school":
      return assembleCommunityWorkspace("institution", slug);
    case "high_school":
      return assembleCommunityWorkspace("high_school", slug);
    case "private_charter":
      return assembleCommunityWorkspace("private_charter", slug);
    default:
      return null;
  }
}
