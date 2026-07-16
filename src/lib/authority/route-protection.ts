import { readFileSync } from "fs";
import { join } from "path";
import type { MutationClassification } from "./types";

export type ProtectedRouteRecord = {
  routePattern: string;
  methods: string[];
  classification:
    | "scope_protected"
    | "base_gated_only"
    | "authenticated_self_service"
    | "public_by_design"
    | "legacy_unused"
    | "needs_investigation";
  permission?: string;
  resourceType?: string;
  scopeResolver?: string;
  csrfRequired: boolean;
  validationSchema?: string;
  auditRequired: boolean;
  ownerDomain: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  notes?: string;
};

type RegistryFile = {
  version: string;
  routes: ProtectedRouteRecord[];
};

let registryCache: RegistryFile | null = null;

function loadRegistry(): RegistryFile {
  if (registryCache) return registryCache;
  const path = join(process.cwd(), "data", "authority", "protected-routes.json");
  registryCache = JSON.parse(readFileSync(path, "utf8")) as RegistryFile;
  return registryCache;
}

function normalizePattern(pattern: string): string {
  return pattern.replace(/\[([^\]]+)\]/g, "[$1]");
}

function patternsMatch(a: string, b: string): boolean {
  return normalizePattern(a) === normalizePattern(b);
}

export function lookupRouteProtection(
  routePattern: string,
  method: string
): ProtectedRouteRecord | undefined {
  const registry = loadRegistry();
  return registry.routes.find(
    (r) =>
      patternsMatch(r.routePattern, routePattern) &&
      (r.methods.includes(method) || r.methods.includes("*") || r.methods.includes("ACTION"))
  );
}

export function clearRouteProtectionCache(): void {
  registryCache = null;
}

export function inventoryClassificationFromRegistry(
  record: ProtectedRouteRecord | undefined,
  hasPermissionGate: boolean,
  hasScopeResolver: boolean
): MutationClassification {
  if (!record) return "unprotected";
  switch (record.classification) {
    case "scope_protected":
      return hasPermissionGate && hasScopeResolver ? "protected" : hasPermissionGate ? "base_gated_only" : "unprotected";
    case "base_gated_only":
      return hasPermissionGate ? "base_gated_only" : "unprotected";
    case "authenticated_self_service":
      return hasPermissionGate ? "authenticated_only" : "authenticated_only";
    case "public_by_design":
      return "public_by_design";
    case "legacy_unused":
      return "legacy_unused";
    case "needs_investigation":
      return "needs_investigation";
    default:
      return "unprotected";
  }
}
