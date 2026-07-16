import type { NextRequest } from "next/server";
import type { ApiRequestContext } from "@/lib/api/types";
import { institutionCounty } from "./scope";
import type { ScopeKind } from "./types";
import { scopeToken } from "./types";
import type { ScopeResolver, ScopeResolverInput } from "./gateway";

function bodyScope(
  body: Record<string, unknown> | null,
  keys: string[],
  kind: ScopeKind
): string | undefined {
  if (!body) return undefined;
  for (const key of keys) {
    const val = body[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return undefined;
}

async function readJsonBody(request: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const clone = request.clone();
    const text = await clone.text();
    if (!text.trim()) return null;
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function scopeInput(
  resourceType: string,
  scopeKind: ScopeKind,
  scopeId: string,
  resourceId?: string
): ScopeResolverInput {
  return {
    resourceType,
    resourceId: resourceId ?? scopeId,
    requestedScopeIds: [scopeToken(scopeKind, scopeId)],
  };
}

/** Volunteer self — actor may only mutate own record. */
export const selfScopeResolver: ScopeResolver = (ctx) =>
  scopeInput("self", "self", ctx.actor_id ?? "unknown", ctx.actor_id ?? undefined);

/** Campaign-wide Arkansas scope. */
export const campaignScopeResolver: ScopeResolver = () =>
  scopeInput("campaign", "campaign", "arkansas");

/** Institution from query, path, or body — validated against authoritative field. */
export const institutionScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const fromQuery = request.nextUrl.searchParams.get("institution_id");
  const fromPath = request.nextUrl.pathname.match(/\/institutions\/([^/]+)/)?.[1];
  const fromBody = bodyScope(body, ["institution_id", "institutionId"], "institution");
  const institutionId = fromQuery ?? fromPath ?? fromBody ?? "unknown";
  return scopeInput("institution", "institution", institutionId);
};

/** County from query or body. */
export const countyScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const fromQuery =
    request.nextUrl.searchParams.get("county_slug") ??
    request.nextUrl.searchParams.get("county");
  const fromBody = bodyScope(body, ["county_slug", "county", "county_id"], "county");
  const county = fromQuery ?? fromBody ?? "unknown";
  return scopeInput("county", "county", county);
};

/** Committee scope from path or body. */
export const committeeScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const fromPath = request.nextUrl.pathname.match(/\/committees\/([^/]+)/)?.[1];
  const fromBody = bodyScope(body, ["committee_id", "committeeId"], "committee");
  const committeeId = fromPath ?? fromBody ?? "unknown";
  return scopeInput("committee", "committee", committeeId);
};

/** Onboarding invitation — scope from institution in body. */
export const onboardingInvitationScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const institutionId = bodyScope(body, ["institution_id", "institutionId"], "institution") ?? "unknown";
  return scopeInput("onboarding", "institution", institutionId);
};

/** Onboarding journey — institution from body or journey record scope. */
export const onboardingJourneyScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const institutionId = bodyScope(body, ["institution_id", "institutionId"], "institution") ?? "unknown";
  return scopeInput("onboarding", "institution", institutionId);
};

/** Outreach / direct communications — initiative or institution scope. */
export const communicationsScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const initiativeId = bodyScope(body, ["initiative_id", "initiativeId"], "campaign");
  if (initiativeId) return scopeInput("communications", "campaign", initiativeId);
  const institutionId = bodyScope(body, ["institution_id", "institutionId"], "institution");
  if (institutionId) return scopeInput("communications", "institution", institutionId);
  return campaignScopeResolver(ctx, request);
};

/** Appointment / role assignment — scope from body, deny self-appointment upstream. */
export const appointmentScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const scopeType = (bodyScope(body, ["scope_type", "scopeType"], "county") ?? "county") as ScopeKind;
  const scopeId = bodyScope(body, ["scope_id", "scopeId", "county_slug", "institution_id"], scopeType) ?? "unknown";
  return scopeInput("appointment", scopeType, scopeId);
};

/** Leadership organizational unit assignment. */
export const leadershipUnitScopeResolver: ScopeResolver = async (ctx, request) => {
  const unitId = request.nextUrl.pathname.match(/\/organizational-units\/([^/]+)/)?.[1] ?? "unknown";
  return scopeInput("leadership", "institution", unitId);
};

/** Workforce / placement — institution from API context or body. */
export const workforceScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const institutionId = bodyScope(body, ["institution_id", "institutionId"], "institution") ?? "unknown";
  return scopeInput("workforce", "institution", institutionId);
};

/** Social / CMS content — campaign scope (social lane). */
export const socialContentScopeResolver: ScopeResolver = () =>
  scopeInput("social", "campaign", "arkansas");

/** Notification campaign sends — outreach campaign scope. */
export const notificationCampaignScopeResolver: ScopeResolver = () =>
  scopeInput("notifications", "campaign", "arkansas");

/** Missions — county or campaign from body. */
export const missionScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const county = bodyScope(body, ["county", "county_slug"], "county");
  if (county) return scopeInput("mission", "county", county);
  return campaignScopeResolver(ctx, request);
};

/** Wave-1 / sponsor invitations — institution scope from body. */
export const wave1InvitationScopeResolver: ScopeResolver = async (ctx, request) => {
  const body = await readJsonBody(request);
  const institutionId =
    bodyScope(body, ["institution_id", "organization_id", "organizationId"], "institution") ?? "unknown";
  return scopeInput("invitation", "institution", institutionId);
};

/** Admin operator surfaces — campaign scope with audit. */
export const adminOperatorScopeResolver: ScopeResolver = campaignScopeResolver;

/** Registry name → resolver */
export const SCOPE_RESOLVER_REGISTRY: Record<string, ScopeResolver> = {
  self: selfScopeResolver,
  "campaign:arkansas": campaignScopeResolver,
  campaign: campaignScopeResolver,
  institution: institutionScopeResolver,
  county: countyScopeResolver,
  committee: committeeScopeResolver,
  onboarding_invitation: onboardingInvitationScopeResolver,
  onboarding_journey: onboardingJourneyScopeResolver,
  communications: communicationsScopeResolver,
  appointment: appointmentScopeResolver,
  leadership_unit: leadershipUnitScopeResolver,
  workforce: workforceScopeResolver,
  social_content: socialContentScopeResolver,
  notification_campaign: notificationCampaignScopeResolver,
  mission: missionScopeResolver,
  wave1_invitation: wave1InvitationScopeResolver,
  admin_operator: adminOperatorScopeResolver,
  "request.organization_scope": institutionScopeResolver,
  "request.institution_scope": institutionScopeResolver,
  "request.initiative_scope": communicationsScopeResolver,
};

export function resolveScopeResolverByName(name: string | undefined): ScopeResolver | undefined {
  if (!name) return undefined;
  return SCOPE_RESOLVER_REGISTRY[name];
}

/** Validate caller-supplied scope against authoritative institution county. */
export function validateInstitutionScope(
  requestedInstitution: string,
  authoritativeInstitution: string
): boolean {
  if (requestedInstitution === authoritativeInstitution) return true;
  const reqCounty = institutionCounty(requestedInstitution);
  const authCounty = institutionCounty(authoritativeInstitution);
  return !!(reqCounty && authCounty && reqCounty === authCounty);
}
