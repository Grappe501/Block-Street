/**
 * CAE-11.6-W1 — Strategy API helpers
 */
import type { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api/errors";
import type { ApiRequestContext } from "@/lib/api/types";

export const STRATEGY_API_CONTRACT_VERSION = "11.6-w1.1";
export const OPERATIONS_API_CONTRACT_VERSION = "11.6-w2.1";
export const WORKFORCE_API_CONTRACT_VERSION = "11.6-w3.1";
export const ORGANIZATION_API_CONTRACT_VERSION = "11.6-w4.1";
export const RESOURCES_API_CONTRACT_VERSION = "11.6-w5.1";
export const CALENDAR_API_CONTRACT_VERSION = "11.6-w6.1";
export const COMMUNICATIONS_API_CONTRACT_VERSION = "11.6-w7.1";
export const EXECUTIVE_API_CONTRACT_VERSION = "11.6-w8.1";
export const WORKFLOWS_API_CONTRACT_VERSION = "11.6-w9.1";
export const OPS_INTELLIGENCE_API_CONTRACT_VERSION = "11.6-w10.1";
export const RESILIENCE_API_CONTRACT_VERSION = "11.6-w11.1";
export const FEDERATION_API_CONTRACT_VERSION = "11.6-w12.1";

export type StrategyApiContext = {
  institution_id: string;
  actor_human_id: string;
  request_id: string;
  correlation_id: string;
};

export function operationalMissionIdFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("missions");
  return parts[idx + 1] ?? "";
}

export function resolveStrategyApiContext(ctx: ApiRequestContext, request: NextRequest): StrategyApiContext {
  const institutionId =
    request.nextUrl.searchParams.get("institution_id") ??
    request.headers.get("x-institution-id") ??
    ctx.organization_id_optional ??
    "inst-block-street";
  return {
    institution_id: institutionId,
    actor_human_id: ctx.actor_id ?? "usr-001",
    request_id: ctx.request_id,
    correlation_id: request.headers.get("x-correlation-id") ?? ctx.correlation_id,
  };
}

export function strategyMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: STRATEGY_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function operationsMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: OPERATIONS_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function workforceMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: WORKFORCE_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function organizationMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: ORGANIZATION_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function resourcesMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: RESOURCES_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function calendarMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: CALENDAR_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function communicationsMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: COMMUNICATIONS_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function executiveMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: EXECUTIVE_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function workflowsMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: WORKFLOWS_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function opsIntelligenceMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: OPS_INTELLIGENCE_API_CONTRACT_VERSION,
    advisory_only: true,
    ...extra,
  };
}

export function resilienceMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: RESILIENCE_API_CONTRACT_VERSION,
    ...extra,
  };
}

export function federationMeta(apiCtx: StrategyApiContext, extra?: Record<string, unknown>) {
  return {
    request_id: apiCtx.request_id,
    correlation_id: apiCtx.correlation_id,
    contract_version: FEDERATION_API_CONTRACT_VERSION,
    ...extra,
  };
}

export async function withFederationApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, federationMeta(apiCtx));
}

export async function withOrganizationApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, organizationMeta(apiCtx));
}

export async function withResourcesApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, resourcesMeta(apiCtx));
}

export async function withCalendarApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, calendarMeta(apiCtx));
}

export async function withCommunicationsApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, communicationsMeta(apiCtx));
}

export async function withExecutiveApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, executiveMeta(apiCtx));
}

export async function withWorkflowsApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, workflowsMeta(apiCtx));
}

export function workflowIdFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("workflows");
  return parts[idx + 1] ?? "";
}

export async function withOpsIntelligenceApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, opsIntelligenceMeta(apiCtx));
}

export async function withResilienceApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, resilienceMeta(apiCtx));
}

export function opsInstitutionIdFromPath(request: NextRequest): string {
  const parts = request.nextUrl.pathname.split("/");
  const idx = parts.indexOf("institutions");
  return parts[idx + 1] ?? "";
}

export async function withWorkforceApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, workforceMeta(apiCtx));
}

export async function withOperationsApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, operationsMeta(apiCtx));
}

export async function withStrategyApi<T>(
  ctx: ApiRequestContext,
  request: NextRequest,
  fn: (apiCtx: StrategyApiContext) => T | Promise<T>
) {
  const apiCtx = resolveStrategyApiContext(ctx, request);
  const data = await fn(apiCtx);
  return apiSuccess(data, strategyMeta(apiCtx));
}
