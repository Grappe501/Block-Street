#!/usr/bin/env node
/**
 * CPOS-DURABLE-AUTHORITY-1.2 — full mutation inventory + registry cross-match.
 * Scans API routes, server actions, and cross-references protected-routes.json.
 */
import "./h-drive-env.mjs";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiRoot = join(root, "src", "app", "api");
const srcRoot = join(root, "src");
const authorityDir = join(root, "data", "authority");
const outPath = join(authorityDir, "mutation-inventory.json");

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const EXPORT_CONST_RE = /export\s+const\s+(POST|PUT|PATCH|DELETE)\s*=\s*withApiGateway\s*\(/g;
const EXPORT_FN_RE = /export\s+async\s+function\s+(POST|PUT|PATCH|DELETE)\s*\(/g;

/** Routes intentionally public — auth bootstrap, health, invitation accept, etc. */
const PUBLIC_BY_DESIGN = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/password/reset-request",
  "/api/auth/password/reset",
  "/api/auth/passwordless/request",
  "/api/auth/passwordless/verify",
  "/api/auth/session",
  "/api/beta/feedback",
  "/api/invitations/[token]/accept",
  "/api/v1/health",
  "/api/v1/deployments/health",
  "/api/v1/monitoring/health",
  "/api/v1/july14/status",
  "/api/v1/community-workspace",
  "/api/v1/identity-trust/register",
  "/api/v1/identity-trust/policy",
  "/api/v1/security/posture",
  "/api/v1/public/content",
  "/api/v1/invitations/wave1/accept",
  "/api/public/v1/credentials/verify/[code]",
]);

/** Legacy routes believed unused — mark for investigation before removal. */
const LEGACY_CANDIDATES = new Set([
  "/api/ai/plan",
  "/api/ai/research",
  "/api/ai/meeting",
  "/api/ai/mission",
]);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name === "route.ts" || name === "route.js") acc.push(p);
  }
  return acc;
}

function walkSource(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkSource(p, acc);
    else if (/\.(tsx?|jsx?|mjs)$/.test(name)) acc.push(p);
  }
  return acc;
}

function routePatternFromFile(filePath) {
  const rel = relative(apiRoot, dirname(filePath)).replace(/\\/g, "/");
  if (!rel || rel === ".") return "/api";
  const segments = rel.split("/").map((seg) => {
    if (seg.startsWith("[") && seg.endsWith("]")) return `[${seg.slice(1, -1)}]`;
    return seg;
  });
  return `/api/${segments.join("/")}`;
}

function normalizePattern(pattern) {
  return pattern.replace(/\[([^\]]+)\]/g, "[$1]");
}

function patternsMatch(a, b) {
  return normalizePattern(a) === normalizePattern(b);
}

function extractGatewayBlock(source, method) {
  const startRe = new RegExp(`export\\s+const\\s+${method}\\s*=\\s*withApiGateway\\s*\\(`);
  const start = source.search(startRe);
  if (start < 0) return null;

  let depth = 0;
  let i = source.indexOf("(", start);
  let optionsStart = -1;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) {
        const block = source.slice(start, i + 1);
        const optMatch = block.match(/,\s*(\{[\s\S]*\})\s*\)\s*;?\s*$/);
        return { block, options: optMatch?.[1] ?? null };
      }
    }
  }
  return null;
}

function parseGatewayOptions(optionsStr) {
  if (!optionsStr) return {};
  const permission = optionsStr.match(/permission:\s*["'`]([^"'`]+)["'`]/)?.[1] ?? null;
  const endpoint = optionsStr.match(/endpoint:\s*["'`]([^"'`]+)["'`]/)?.[1] ?? null;
  const isPublic = /public:\s*true/.test(optionsStr);
  const hasScopeResolver = /scopeResolver:/.test(optionsStr);
  return { permission, endpoint, public: isPublic, scopeResolver: hasScopeResolver };
}

function detectLegacyProtection(source) {
  return {
    assertAuthenticated: /\bassertAuthenticated\b/.test(source),
    assertAdminPermission: /\bassertAdminPermission\b/.test(source),
    resolveAdminContext: /\bresolveAdminContext\b/.test(source),
    getSessionFromRequest: /\bgetSessionFromRequest\b/.test(source),
    assertScopedPermission: /\bassertScopedPermission\b/.test(source),
    authorize: /\bauthorize\s*\(/.test(source),
    withLegacyScopedMutation: /\bwithLegacyScopedMutation\b/.test(source),
  };
}

function classifyMutation(entry, registryMatch) {
  const hasPermissionGate =
    !!entry.permission ||
    entry.assertAdminPermission ||
    entry.resolveAdminContext ||
    entry.withLegacyScopedMutation ||
    entry.assertScopedPermission ||
    entry.authorize ||
    entry.usesCms ||
    entry.usesNotifications;
  const hasScopeResolver = !!entry.scopeResolver || !!registryMatch?.scopeResolver;

  if (registryMatch) {
    switch (registryMatch.classification) {
      case "scope_protected":
        if (hasPermissionGate && hasScopeResolver) return "protected";
        if (hasPermissionGate) return "base_gated_only";
        return "unprotected";
      case "base_gated_only":
        return hasPermissionGate ? "base_gated_only" : "unprotected";
      case "authenticated_self_service":
        return entry.assertAuthenticated || entry.getSessionFromRequest || entry.withLegacyScopedMutation
          ? "authenticated_only"
          : "authenticated_only";
      case "public_by_design":
        return "public_by_design";
      case "legacy_unused":
        return "legacy_unused";
      case "needs_investigation":
        return "needs_investigation";
      default:
        break;
    }
  }

  if (entry.kind === "server_action") {
    if (entry.withLegacyScopedMutation || (entry.assertScopedPermission && hasScopeResolver)) return "protected";
    if (entry.usesDemoUser === false && entry.authorize) return "protected";
    if (registryMatch?.classification === "scope_protected" && (entry.authorize || !entry.usesDemoUser)) return "protected";
    if (entry.usesDemoUser) return "needs_investigation";
    if (entry.assertScopedPermission || entry.authorize) return "protected";
    return "unprotected";
  }

  const route = entry.routePattern;
  if (PUBLIC_BY_DESIGN.has(route) || entry.public) return "public_by_design";
  if (LEGACY_CANDIDATES.has(route)) return "legacy_unused";

  if (entry.gateway === "withApiGateway") {
    if (entry.public) return "public_by_design";
    if (entry.permission && hasScopeResolver) return "protected";
    if (entry.permission) return "base_gated_only";
    return "authenticated_only";
  }

  if (entry.withLegacyScopedMutation && hasScopeResolver) return "protected";

  if (entry.assertScopedPermission || entry.authorize) return "protected";
  if (entry.assertAdminPermission || entry.resolveAdminContext) return "base_gated_only";
  if (entry.assertAuthenticated || entry.getSessionFromRequest) return "authenticated_only";

  if (route.startsWith("/api/auth/") && ["POST", "DELETE"].includes(entry.method)) {
    return "public_by_design";
  }

  return "unprotected";
}

function loadProtectedRoutes() {
  const file = join(authorityDir, "protected-routes.json");
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8")).routes ?? [];
}

function findRegistryMatch(routePattern, method, registry) {
  return registry.find(
    (r) =>
      patternsMatch(r.routePattern, routePattern) &&
      (r.methods.includes(method) || r.methods.includes("*"))
  );
}

function scanApiRoutes() {
  const entries = [];
  for (const file of walk(apiRoot)) {
    const source = readFileSync(file, "utf8");
    const routePattern = routePatternFromFile(file);
    const legacy = detectLegacyProtection(source);

    for (const re of [EXPORT_CONST_RE, EXPORT_FN_RE]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(source))) {
        const method = m[1];
        if (!MUTATION_METHODS.has(method)) continue;

        const isGateway = m[0].includes("withApiGateway");
        let gatewayOpts = {};
        if (isGateway) {
          const block = extractGatewayBlock(source, method);
          gatewayOpts = parseGatewayOptions(block?.options ?? null);
        }

        entries.push({
          id: `${routePattern}:${method}`,
          kind: "api_route",
          routePattern,
          method,
          sourceFile: relative(root, file).replace(/\\/g, "/"),
          gateway: isGateway ? "withApiGateway" : "legacy_handler",
          usesCms: /\bwithCms\s*\(/.test(source),
          usesNotifications: /\bwithNotifications\s*\(/.test(source),
          ...gatewayOpts,
          ...legacy,
          ownership: inferOwnership(routePattern),
        });
      }
    }
  }
  return entries;
}

function inferOwnership(routePattern) {
  if (routePattern.startsWith("/api/auth")) return "platform_auth";
  if (routePattern.startsWith("/api/admin")) return "platform_admin";
  if (routePattern.startsWith("/api/invitations")) return "onboarding";
  if (routePattern.startsWith("/api/notifications")) return "communications";
  if (routePattern.startsWith("/api/cms")) return "social_media";
  if (routePattern.includes("/calendar")) return "volunteer_management";
  if (routePattern.startsWith("/api/v1/onboarding")) return "onboarding";
  if (routePattern.startsWith("/api/v1/communications")) return "outreach";
  if (routePattern.startsWith("/api/v1/workforce")) return "volunteer_management";
  if (routePattern.startsWith("/api/v1/calendar")) return "volunteer_management";
  if (routePattern.startsWith("/api/v1/identity")) return "platform_identity";
  if (routePattern.startsWith("/api/v1/localbrain")) return "platform_ai";
  if (routePattern.startsWith("/api/ai")) return "platform_ai";
  if (routePattern.startsWith("/api/v1/civic-action")) return "campaign_command";
  return "unknown";
}

function scanServerActions() {
  const entries = [];
  for (const file of walkSource(srcRoot)) {
    const source = readFileSync(file, "utf8");
    if (!source.includes('"use server"') && !source.includes("'use server'")) continue;

    const fnRe = /export\s+async\s+function\s+(\w+)\s*\(/g;
    let m;
    while ((m = fnRe.exec(source))) {
      const fnName = m[1];
      if (/^(GET|POST|PUT|PATCH|DELETE)$/.test(fnName)) continue;
      const fnBodyStart = source.indexOf(m[0]);
      const fnSlice = source.slice(fnBodyStart, fnBodyStart + 800);
      const isCalendarAction = file.includes("calendar") && file.includes("actions");
      const mutates =
        isCalendarAction ||
        /\b(create|update|delete|insert|write|append|transition|respond|approve|publish|assign|revoke|submit|redirect|archive|cancel|confirm|dismiss|snooze|publish|propose|rsvp)/i.test(
          fnSlice
        );
      if (!mutates) continue;

      const legacy = detectLegacyProtection(source);
      entries.push({
        id: `server_action:${relative(root, file).replace(/\\/g, "/")}:${fnName}`,
        kind: "server_action",
        routePattern: null,
        method: "ACTION",
        actionName: fnName,
        sourceFile: relative(root, file).replace(/\\/g, "/"),
        gateway: "server_action",
        usesDemoUser: /DEMO_USER|usr-demo/.test(fnSlice),
        ownership: file.includes("calendar") ? "volunteer_management" : "unknown",
        ...legacy,
      });
    }
  }
  return entries;
}

function summarize(entries) {
  const counts = {
    protected: 0,
    base_gated_only: 0,
    authenticated_only: 0,
    unprotected: 0,
    public_by_design: 0,
    legacy_unused: 0,
    needs_investigation: 0,
  };
  for (const e of entries) {
    e.classification = classifyMutation(e);
    counts[e.classification] = (counts[e.classification] ?? 0) + 1;
  }
  return counts;
}

function main() {
  const registry = loadProtectedRoutes();
  const apiEntries = scanApiRoutes();
  const actionEntries = scanServerActions();
  const all = [...apiEntries, ...actionEntries];

  for (const entry of all) {
    if (entry.kind === "api_route") {
      const match = findRegistryMatch(entry.routePattern, entry.method, registry);
      entry.inProtectedRegistry = !!match;
      if (match) {
        entry.registryPermissions = match.permission ? [match.permission] : match.requiredPermissions;
        entry.registryScopeResolver = match.scopeResolver;
        entry.registryClassification = match.classification;
        if (!entry.permission && match.permission) entry.permission = match.permission;
        if (!entry.scopeResolver && match.scopeResolver) entry.scopeResolver = true;
      }
    } else if (entry.kind === "server_action") {
      const actionKey = `server_action:${entry.sourceFile}:${entry.actionName}`;
      const match =
        registry.find((r) => r.routePattern === actionKey) ??
        registry.find((r) => r.routePattern === entry.sourceFile && r.methods.includes("ACTION"));
      entry.inProtectedRegistry = !!match;
      if (match) {
        entry.registryClassification = match.classification;
        entry.registryScopeResolver = match.scopeResolver;
        if (match.scopeResolver) entry.scopeResolver = true;
      }
    }
  }

  const counts = { protected: 0, base_gated_only: 0, authenticated_only: 0, unprotected: 0, public_by_design: 0, legacy_unused: 0, needs_investigation: 0 };
  for (const e of all) {
    const match =
      e.kind === "api_route"
        ? findRegistryMatch(e.routePattern, e.method, registry)
        : registry.find((r) => r.routePattern === `server_action:${e.sourceFile}:${e.actionName}`);
    e.classification = classifyMutation(e, match);
    counts[e.classification] = (counts[e.classification] ?? 0) + 1;
  }
  const total = all.length;
  const scopedProtected = all.filter((e) => e.classification === "protected").length;

  const report = {
    version: "1.2.0",
    program: "CPOS-DURABLE-AUTHORITY-1.2",
    updated: new Date().toISOString(),
    summary: {
      total_mutations: total,
      protected_mutations: scopedProtected,
      base_gated_only: counts.base_gated_only,
      authenticated_only: counts.authenticated_only,
      unprotected: counts.unprotected,
      public_by_design: counts.public_by_design,
      legacy_unused: counts.legacy_unused,
      needs_investigation: counts.needs_investigation,
      in_protected_registry: all.filter((e) => e.inProtectedRegistry).length,
      coverage_rate: total ? Number((scopedProtected / total).toFixed(3)) : 0,
    },
    summary_line: [
      `Protected mutations: ${scopedProtected} / ${total}`,
      `Base-gated only: ${counts.base_gated_only}`,
      `Authenticated only: ${counts.authenticated_only}`,
      `Unprotected: ${counts.unprotected}`,
      `Public by design: ${counts.public_by_design}`,
      `Legacy unused: ${counts.legacy_unused}`,
      `Needs investigation: ${counts.needs_investigation}`,
    ].join("\n"),
    entries: all.sort((a, b) => (a.id ?? "").localeCompare(b.id ?? "")),
  };

  mkdirSync(authorityDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

  const protectedPath = join(authorityDir, "protected-routes.json");
  if (existsSync(protectedPath)) {
    const pr = JSON.parse(readFileSync(protectedPath, "utf8"));
    pr.mutation_inventory_status = `generated ${report.updated} — ${report.summary_line.split("\n")[0]}`;
    pr.mutation_inventory_ref = "data/authority/mutation-inventory.json";
    writeFileSync(protectedPath, JSON.stringify(pr, null, 2) + "\n");
  }

  console.log("CPOS-DURABLE-AUTHORITY-1.2 mutation inventory");
  console.log(report.summary_line);
  console.log(`Registry cross-match: ${report.summary.in_protected_registry} entries in protected-routes.json`);
  console.log(`Coverage rate (scope-protected / total): ${(report.summary.coverage_rate * 100).toFixed(1)}%`);
  console.log(`Written: ${relative(root, outPath)}`);

  return report;
}

const report = main();
export default report;
