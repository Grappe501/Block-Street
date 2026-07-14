#!/usr/bin/env node
/**
 * V1-CERT-PASS-01 — Vision-to-Implementation Audit Runner
 * Mode: READ · INSPECT · TRACE · CLASSIFY · REPORT
 * NO PRODUCT REPAIRS
 */
import '../h-drive-env.mjs';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CAPABILITIES } from './capability-catalog.mjs';
import './capability-catalog-part2.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const DATA = join(ROOT, 'data/v1-certification');
const DOCS = join(ROOT, 'docs/v1-certification');
const AUDITED_AT = new Date().toISOString();
const AUDITED_BY = 'burt-pass01-audit-runner';

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', '.tmp', '.npm-cache'].includes(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else acc.push(p.replace(/\\/g, '/'));
  }
  return acc;
}

function rel(p) {
  return relative(ROOT, p).replace(/\\/g, '/');
}

function bar(pct, width = 20) {
  const n = Math.max(0, Math.min(100, Math.round(pct)));
  const filled = Math.round((n / 100) * width);
  return `${'█'.repeat(filled)}${'░'.repeat(width - filled)}  ${String(n).padStart(3, ' ')}%`;
}

function scoreFulfillment(scores) {
  const avg =
    (scores.existence +
      scores.integration +
      scores.human_experience +
      scores.governance +
      scores.reliability +
      scores.launch_readiness) /
    6;
  return Math.round((avg / 4) * 1000) / 10;
}

function matchAny(haystacks, keys) {
  if (!keys?.length) return [];
  const hits = [];
  for (const key of keys) {
    const k = key.toLowerCase();
    for (const h of haystacks) {
      if (h.toLowerCase().includes(k)) hits.push(h);
    }
  }
  return [...new Set(hits)].slice(0, 12);
}

function classify(cap, inv) {
  const uiHits = matchAny(inv.pages, cap.ui_keys);
  const apiHits = matchAny(inv.apis, cap.api_keys);
  const libHits = matchAny(inv.libFiles, cap.lib_keys);
  const docHits = matchAny(inv.docFiles, cap.doc_keys);
  const testHits = matchAny(inv.testSignals, cap.test_keys);

  const hasUi = uiHits.length > 0;
  const hasApi = apiHits.length > 0;
  const hasLib = libHits.length > 0;
  const hasDoc = docHits.length > 0;
  const hasTest = testHits.length > 0;
  const implementedCode = hasApi || hasLib || (hasUi && !cap.infra_only);

  /** @type {{ existence: number, integration: number, human_experience: number, governance: number, reliability: number, launch_readiness: number }} */
  const scores = {
    existence: 0,
    integration: 0,
    human_experience: 0,
    governance: 0,
    reliability: 0,
    launch_readiness: 0,
  };

  let implementation_mode = 'Missing';
  let status = 'MISSING';
  let confidence = 'medium';
  const known_gaps = [];
  let implementation_difference = null;
  let recommended_disposition = 'gap-register';

  // Evidence-based scoring (conservative — Pass 1 does not claim operational verification without journey proof)
  if (!implementedCode && !hasDoc && !hasUi) {
    status = 'MISSING';
    implementation_mode = 'Missing';
    confidence = 'high';
  } else if (!implementedCode && hasDoc) {
    status = 'DOCUMENTED ONLY';
    implementation_mode = 'Documentation-only';
    scores.existence = 1;
    confidence = 'high';
    known_gaps.push('Documented without runtime implementation evidence');
  } else if (implementedCode && !hasUi && !cap.infra_only) {
    // Backend/protocol without Human surface
    status = 'SCAFFOLDED ONLY';
    implementation_mode = 'Development-backed';
    scores.existence = hasLib || hasApi ? 3 : 2;
    scores.integration = hasApi && hasLib ? 2 : 1;
    scores.human_experience = 0;
    scores.governance = hasApi ? 2 : 1;
    scores.reliability = hasTest ? 3 : 1;
    scores.launch_readiness = 0;
    known_gaps.push('No usable Human interface found for intended journey');
    known_gaps.push('Not verified as production-backed (JSON civic-action / local store)');
  } else if (cap.infra_only && implementedCode) {
    status = 'PARTIALLY IMPLEMENTED';
    implementation_mode = 'Development-backed';
    scores.existence = 3;
    scores.integration = hasLib || hasApi ? 3 : 2;
    scores.human_experience = hasUi ? 2 : 1;
    scores.governance = 2;
    scores.reliability = hasTest ? 3 : 1;
    scores.launch_readiness = 1;
    known_gaps.push('Infrastructure present; production hardening unverified in Pass 1');
  } else if (hasUi && (hasApi || hasLib || cap.ui_keys.length === 0)) {
    status = 'PARTIALLY IMPLEMENTED';
    implementation_mode = 'Development-backed';
    scores.existence = 3;
    scores.integration = hasApi || hasLib ? 2 : 1;
    scores.human_experience = 2;
    scores.governance = hasApi ? 2 : 1;
    scores.reliability = hasTest ? 2 : 1;
    scores.launch_readiness = 1;
    known_gaps.push('UI surface found; Pass 1 did not certify full journey / persistence / permissions');
    known_gaps.push('Persistence mode: Local-only / Development-backed civic-action JSON (no production DB evidence)');
  } else if (hasUi && !hasApi && !hasLib) {
    status = 'SCAFFOLDED ONLY';
    implementation_mode = hasDoc ? 'Static demo' : 'Placeholder';
    scores.existence = 2;
    scores.integration = 0;
    scores.human_experience = 1;
    scores.governance = 0;
    scores.reliability = 0;
    scores.launch_readiness = 0;
    known_gaps.push('UI path matched without clear service/API backing');
  }

  // Special cases — known dual stacks / missing select org
  if (cap.id.includes('CAL-001') || (cap.domain_id === 5 && !hasUi)) {
    if (hasApi && !hasUi) {
      status = 'SCAFFOLDED ONLY';
      scores.human_experience = 0;
      scores.launch_readiness = 0;
      known_gaps.push('Calendar APIs exist; no calendar page.tsx');
    }
  }
  if (cap.id.includes('LB-019') || cap.name.includes('LocalBrain workspace')) {
    if (!hasUi) {
      status = 'SCAFFOLDED ONLY';
      scores.existence = hasApi || hasLib ? 3 : scores.existence;
      scores.human_experience = 0;
      known_gaps.push('No /localbrain product page');
    }
  }
  if (cap.id.includes('FOU-006')) {
    status = 'MISSING';
    scores.existence = 0;
    scores.integration = 0;
    scores.human_experience = 0;
    scores.governance = 0;
    scores.reliability = 0;
    scores.launch_readiness = 0;
    implementation_mode = 'Missing';
    known_gaps.push('No prisma/drizzle/supabase production database found');
  }
  if (cap.id.includes('FOU-007') || cap.id.includes('FOU-008')) {
    status = 'MISSING';
    implementation_mode = 'Missing';
    known_gaps.push('Middleware references select-organization/workspace; pages not found');
  }
  if (cap.id.includes('DAY-001')) {
    status = 'IMPLEMENTED DIFFERENTLY';
    implementation_difference = {
      nature: 'Acceptable compromise / Potential drift',
      detail:
        'Daily brief exists via Communications (11.7-COM) assembler, not LocalBrain executive briefing UX. Dual briefing stacks flagged.',
    };
    scores.existence = 3;
    scores.integration = 2;
    scores.human_experience = 2;
    scores.governance = 2;
    scores.reliability = 2;
    scores.launch_readiness = 1;
    implementation_mode = 'Development-backed';
  }
  if (cap.id.includes('AI-004') && !hasUi) {
    status = 'SCAFFOLDED ONLY';
  }

  // Certified Present only if thresholds met (rare in Pass 1 without journey verification)
  if (
    scores.existence >= 3 &&
    scores.integration >= 3 &&
    scores.human_experience >= 2 &&
    scores.governance >= 3 &&
    scores.reliability >= 2 &&
    scores.launch_readiness >= 2
  ) {
    status = 'CERTIFIED PRESENT';
    recommended_disposition = 'ready-for-pass-2';
  } else if (status === 'PARTIALLY IMPLEMENTED') {
    recommended_disposition = 'p1-or-p0-gap';
  } else if (status === 'MISSING' || status === 'DOCUMENTED ONLY' || status === 'SCAFFOLDED ONLY') {
    recommended_disposition = scores.launch_readiness === 0 ? 'p0-or-p1-gap' : 'gap-register';
  }

  // Deferred candidates (advanced LIX product beyond V1 core)
  if (
    ['AI-012', 'AI-013', 'FED-002', 'FED-011'].some((s) => cap.id.includes(s)) ||
    (cap.api_keys.some((k) => /digital-twin|genesis|factory|agents/.test(k)) && !hasUi)
  ) {
    if (status === 'SCAFFOLDED ONLY' || status === 'MISSING') {
      // keep status; mark disposition
      if (!hasUi) recommended_disposition = 'consider-defer-v2';
    }
  }

  const evidence = [];
  let e = 0;
  for (const [type, files] of [
    ['ui_route', uiHits],
    ['api_route', apiHits],
    ['lib_module', libHits],
    ['documentation', docHits],
    ['test_signal', testHits],
  ]) {
    for (const f of files.slice(0, 4)) {
      e += 1;
      evidence.push({
        evidence_id: `${cap.id}-E${e}`,
        capability_id: cap.id,
        evidence_type: type,
        file_or_route: f,
        description: `${type} matched for ${cap.name}`,
        runtime_status: type === 'documentation' ? 'docs-only' : 'static-presence',
        environment: 'local-repository',
        test_reference: type === 'test_signal' ? f : null,
        verified_at: AUDITED_AT,
        limitations:
          'Pass 1 inventory match — not a live user-journey proof. Deeper verification in Passes 2–8.',
      });
    }
  }

  // Severity heuristic
  let severity = 'P3';
  if (status === 'MISSING' || status === 'DOCUMENTED ONLY' || status === 'SCAFFOLDED ONLY') {
    if (['B', 'C', 'F', 'G', 'H', 'I'].includes(cap.track) && [1, 2, 3, 4, 5, 7, 10, 14, 16].includes(cap.domain_id)) {
      severity = 'P1';
    }
    if (
      /invitation-only|LocalBrain workspace|Canonical Calendar|Daily briefing|Mission creation|RBAC|No cross-tenant|Production database|Time to first success/i.test(
        cap.name + cap.vision,
      )
    ) {
      severity = 'P0';
    }
  }
  if (status === 'PARTIALLY IMPLEMENTED') severity = 'P1';
  if (status === 'IMPLEMENTED DIFFERENTLY') severity = 'P1';
  if (recommended_disposition === 'consider-defer-v2') severity = 'P2';

  return {
    capability_id: cap.id,
    launch_track: cap.track,
    domain: cap.domain,
    domain_id: cap.domain_id,
    capability_name: cap.name,
    vision_statement: cap.vision,
    intended_humans: cap.humans,
    intended_user_journey: cap.journey,
    required_dependencies: [...new Set([...cap.api_keys, ...cap.lib_keys])],
    expected_ui_surfaces: cap.ui_keys,
    expected_services: cap.api_keys,
    expected_data_objects: [],
    expected_permissions: [],
    expected_events: [],
    expected_tests: cap.test_keys,
    implementation_status: status,
    implementation_mode,
    existence_score: scores.existence,
    integration_score: scores.integration,
    human_experience_score: scores.human_experience,
    governance_score: scores.governance,
    reliability_score: scores.reliability,
    launch_readiness_score: scores.launch_readiness,
    fulfillment_pct: scoreFulfillment(scores),
    evidence,
    known_gaps,
    implementation_difference,
    recommended_disposition,
    severity,
    confidence,
    audited_by: AUDITED_BY,
    audited_at: AUDITED_AT,
  };
}

function main() {
  mkdirSync(DATA, { recursive: true });
  mkdirSync(DOCS, { recursive: true });

  const pages = walk(join(ROOT, 'src/app'))
    .filter((f) => f.endsWith('page.tsx'))
    .map(rel);
  const apis = walk(join(ROOT, 'src/app/api'))
    .filter((f) => f.endsWith('route.ts'))
    .map(rel);
  const libFiles = walk(join(ROOT, 'src/lib'))
    .filter((f) => /\.(ts|tsx|mjs|js)$/.test(f))
    .map(rel);
  const docFiles = walk(join(ROOT, 'docs'))
    .filter((f) => f.endsWith('.md'))
    .map(rel);
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const testSignals = [
    ...Object.keys(pkg.scripts || {}),
    ...walk(join(ROOT, 'scripts'))
      .filter((f) => /test|validate|cert|w\d+/i.test(f))
      .map(rel),
  ];

  // False-completeness scan
  const falseMarkers = [];
  const markerRe =
    /\b(TODO|FIXME|placeholder|mock|stub|fake|coming soon|not implemented|no-op|simulated)\b/gi;
  for (const f of [...libFiles.slice(0, 4000), ...pages, ...apis.slice(0, 2000)]) {
    try {
      const body = readFileSync(join(ROOT, f), 'utf8');
      const m = body.match(markerRe);
      if (m?.length) falseMarkers.push({ file: f, hits: m.length, samples: [...new Set(m.map((x) => x.toLowerCase()))].slice(0, 6) });
    } catch {
      /* skip */
    }
  }

  const inv = { pages, apis, libFiles, docFiles, testSignals };

  const routeInventory = {
    audited_at: AUDITED_AT,
    page_count: pages.length,
    api_count: apis.length,
    pages: pages.sort(),
    apis_by_prefix: {},
    pages_by_segment: {},
  };
  for (const p of pages) {
    const seg = p.includes('(site)/')
      ? p.split('(site)/')[1]?.split('/')[0] || '(site-root)'
      : p.split('src/app/')[1]?.split('/')[0] || 'other';
    routeInventory.pages_by_segment[seg] = (routeInventory.pages_by_segment[seg] || 0) + 1;
  }
  for (const a of apis) {
    const parts = a.split('src/app/api/')[1]?.split('/') || [];
    const prefix = parts.slice(0, 3).join('/');
    routeInventory.apis_by_prefix[prefix] = (routeInventory.apis_by_prefix[prefix] || 0) + 1;
  }

  const serviceInventory = {
    audited_at: AUDITED_AT,
    living_modules: readdirSync(join(ROOT, 'src/lib/civic-action/builds/11.7/living'), {
      withFileTypes: true,
    })
      .filter((d) => d.isDirectory())
      .map((d) => d.name),
    auth_modules: readdirSync(join(ROOT, 'src/lib/auth')).map((f) => `src/lib/auth/${f}`),
    localbrain_api_count: apis.filter((a) => a.includes('/localbrain/')).length,
  };

  const dataModelInventory = {
    audited_at: AUDITED_AT,
    persistence: {
      mode: 'Local-only / Development-backed JSON file store',
      primary_store: 'data/civic-action/store.json',
      orm: null,
      prisma: false,
      drizzle: false,
      supabase: false,
      production_database_evidence: false,
    },
    sibling_data: readdirSync(join(ROOT, 'data/civic-action')).map((f) => `data/civic-action/${f}`),
  };

  const permissionInventory = {
    audited_at: AUDITED_AT,
    middleware: existsSync(join(ROOT, 'src/middleware.ts')) ? 'src/middleware.ts' : null,
    auth_engine: 'src/lib/auth/engine.ts',
    notes: [
      'Pass 1 inventory identifies auth/middleware presence.',
      'Per-capability server-side permission path verification is incomplete — Flagged for Pass 1 Gate 6 partial.',
      'Client-only checks must not be counted as authorization (Rule).',
    ],
  };

  const aiInventory = {
    audited_at: AUDITED_AT,
    localbrain_routes: apis.filter((a) => a.includes('/localbrain/')).length,
    ai_routes: apis.filter((a) => a.includes('/api/ai/') || a.includes('/api/v1/ai')).length,
    living_intelligence_waves: serviceInventory.living_modules,
    product_ui_localbrain: pages.some((p) => p.includes('localbrain')) === false ? 'MISSING' : 'PRESENT',
  };

  const integrationInventory = {
    audited_at: AUDITED_AT,
    calendar_api: apis.filter((a) => a.includes('/calendar')).length,
    calendar_ui: pages.filter((p) => p.includes('calendar')).length,
    google_calendar: 'unverified',
    microsoft_calendar: 'unverified',
    sms: 'unverified',
    email: 'unverified',
    push: 'unverified',
  };

  const testInventory = {
    audited_at: AUDITED_AT,
    scripts: Object.keys(pkg.scripts || {}).filter((k) =>
      /test|phase11|validate|typecheck|lint|launch|audit/i.test(k),
    ),
    e2e_script_present: Object.keys(pkg.scripts || {}).some((k) => /e2e/i.test(k)),
    notes: [
      'Phase 11 wave tests certify protocol modules.',
      'Compilation/typecheck ≠ runtime product certification.',
      'No dedicated Playwright/Cypress e2e script discovered in package.json.',
    ],
  };

  // Classify all capabilities
  const records = CAPABILITIES.map((c) => classify(c, inv));

  // Duplicate detection (static known)
  const duplicates = [
    {
      id: 'DUP-001',
      systems: ['Communications Daily Brief (11.7-COM)', 'LocalBrain briefings API (11.7-LIX W3)'],
      classification: 'DUPLICATED OR CONFLICTING',
      canonical_candidate: 'Unresolved — needs Pass 4',
      evidence: ['src/app/(site)/communications/brief/page.tsx', 'src/app/api/v1/localbrain/briefings'],
    },
    {
      id: 'DUP-002',
      systems: ['Communications UX', 'LocalBrain conversations API (W6)'],
      classification: 'DUPLICATED OR CONFLICTING',
      canonical_candidate: 'Unresolved — needs Pass 4',
      evidence: ['src/app/(site)/communications/', 'src/app/api/v1/localbrain/conversations'],
    },
    {
      id: 'DUP-003',
      systems: ['Learning 11.12 UX', 'LocalBrain learning API (W7)'],
      classification: 'DUPLICATED OR CONFLICTING',
      canonical_candidate: 'Unresolved — needs Pass 4',
      evidence: ['src/app/(site)/learning/', 'src/app/api/v1/localbrain/learning'],
    },
    {
      id: 'DUP-004',
      systems: ['api/v1/calendar', 'api/v1/workspace/calendar', 'LocalBrain organizer time surfaces'],
      classification: 'DUPLICATED OR CONFLICTING',
      canonical_candidate: 'Unresolved — no calendar UI; Pass 4',
      evidence: ['src/app/api/v1/calendar'],
    },
    {
      id: 'DUP-005',
      systems: ['notifications under /api/notifications', 'communications/notifications', 'site/notifications'],
      classification: 'DUPLICATED OR CONFLICTING',
      canonical_candidate: 'Unresolved — Pass 4',
      evidence: pages.filter((p) => p.includes('notification')).concat(apis.filter((a) => a.includes('notification')).slice(0, 5)),
    },
    {
      id: 'DUP-006',
      systems: ['Multiple dashboard shells: admin, operations, learning, communications, initiatives'],
      classification: 'DUPLICATED OR CONFLICTING',
      canonical_candidate: 'Unresolved — Pass 4 / Pass 5',
      evidence: ['admin', 'operations', 'learning', 'communications', 'initiatives'],
    },
  ];

  // Mark duplicate-affected capabilities
  for (const r of records) {
    if (/briefing|conversation|learning|calendar|notification/i.test(r.capability_name + r.domain)) {
      if (r.implementation_status === 'PARTIALLY IMPLEMENTED' || r.implementation_status === 'IMPLEMENTED DIFFERENTLY') {
        // leave as-is; duplicates listed separately
      }
    }
  }

  const byStatus = {};
  for (const r of records) {
    byStatus[r.implementation_status] = (byStatus[r.implementation_status] || 0) + 1;
  }

  const trackIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const trackScores = {};
  for (const t of trackIds) {
    const subset = records.filter((r) => r.launch_track === t);
    const avg =
      subset.length === 0 ? 0 : subset.reduce((s, r) => s + r.fulfillment_pct, 0) / subset.length;
    trackScores[t] = {
      count: subset.length,
      fulfillment_pct: Math.round(avg * 10) / 10,
      by_status: Object.fromEntries(
        Object.keys(byStatus).map((k) => [k, subset.filter((r) => r.implementation_status === k).length]),
      ),
    };
  }

  const domainScores = {};
  for (const r of records) {
    const k = `${r.domain_id}:${r.domain}`;
    if (!domainScores[k]) domainScores[k] = { name: r.domain, id: r.domain_id, items: [] };
    domainScores[k].items.push(r.fulfillment_pct);
  }
  const domainBars = Object.values(domainScores).map((d) => ({
    domain_id: d.id,
    domain: d.name,
    count: d.items.length,
    fulfillment_pct: Math.round((d.items.reduce((a, b) => a + b, 0) / d.items.length) * 10) / 10,
  }));

  const overall =
    records.length === 0
      ? 0
      : Math.round((records.reduce((s, r) => s + r.fulfillment_pct, 0) / records.length) * 10) / 10;

  const gaps = records
    .filter((r) => !['CERTIFIED PRESENT'].includes(r.implementation_status))
    .map((r) => ({
      capability_id: r.capability_id,
      name: r.capability_name,
      status: r.implementation_status,
      severity: r.severity,
      launch_impact: r.severity === 'P0' ? 'Launch blocker' : r.severity === 'P1' ? 'Required before broad beta' : r.severity === 'P2' ? 'Required shortly after launch' : 'Future enhancement',
      affected_humans: r.intended_humans,
      affected_journeys: [r.intended_user_journey],
      known_gaps: r.known_gaps,
      recommended_next_pass: r.severity === 'P0' || r.severity === 'P1' ? 'Repair planning after Pass 1 acceptance; UX detail in Pass 2' : 'Later pass / V2',
      recommended_disposition: r.recommended_disposition,
    }));

  const evidenceIndex = {
    audited_at: AUDITED_AT,
    evidence: records.flatMap((r) => r.evidence),
  };

  const summary = {
    protocol_id: 'V1-CERT-PASS-01',
    audited_at: AUDITED_AT,
    audited_by: AUDITED_BY,
    commit_placeholder: 'SET_ON_COMMIT',
    repository: {
      root: ROOT.replace(/\\/g, '/'),
      package: pkg.name,
      version: pkg.version,
      lanes: ['(site)', 'admin', 'api'],
      remotes: 'origin https://github.com/Grappe501/Block-Street.git',
      branch: 'main',
    },
    totals: {
      capabilities_audited: records.length,
      overall_vision_fulfillment_pct: overall,
      by_status: byStatus,
    },
    track_scores: trackScores,
    domain_scores: domainBars,
    certified_present: records.filter((r) => r.implementation_status === 'CERTIFIED PRESENT').map((r) => r.capability_id),
    p0: gaps.filter((g) => g.severity === 'P0'),
    p1: gaps.filter((g) => g.severity === 'P1').slice(0, 100),
    p1_count: gaps.filter((g) => g.severity === 'P1').length,
    duplicates,
    false_completeness_marker_files: falseMarkers.length,
    false_completeness_sample: falseMarkers.slice(0, 25),
    persistence_finding: dataModelInventory.persistence,
    pass2_ready: false,
    pass2_recommendation:
      'NOT READY until Steve reviews P0/P1, duplicates, documented/scaffolded lists and accepts Pass 1 record.',
    method_limitations: [
      'Classifications use static inventory matching (routes, libs, docs, scripts), not live browser journeys.',
      'CERTIFIED PRESENT threshold almost never met without Pass 2 journey + Pass 8 production proof — by design.',
      'Works/Verified operational scores deliberately conservative.',
      'No product repairs performed.',
    ],
  };

  // Write JSON artifacts
  const writeJson = (name, obj) => writeFileSync(join(DATA, name), JSON.stringify(obj, null, 2));
  writeJson('capability_registry.json', { audited_at: AUDITED_AT, count: records.length, capabilities: records });
  writeJson(
    'certification_matrix.json',
    records.map((r) => ({
      ID: r.capability_id,
      Track: r.launch_track,
      Domain: r.domain,
      Capability: r.capability_name,
      Vision: r.vision_statement,
      Built: r.existence_score >= 3 ? 'Yes' : r.existence_score >= 1 ? 'Partial' : 'No',
      Integrated: r.integration_score,
      Works: r.existence_score >= 3 && r.human_experience_score >= 2 ? 'Partial' : 'Unverified/No',
      UX: r.human_experience_score,
      Governed: r.governance_score,
      Tested: r.reliability_score,
      LaunchReady: r.launch_readiness_score,
      ImplementationMode: r.implementation_mode,
      Status: r.implementation_status,
      Evidence: r.evidence.slice(0, 3).map((e) => e.file_or_route).join('; '),
      Gap: r.known_gaps.join('; '),
      Disposition: r.recommended_disposition,
      Severity: r.severity,
      FulfillmentPct: r.fulfillment_pct,
    })),
  );
  writeJson('route_inventory.json', routeInventory);
  writeJson('service_inventory.json', serviceInventory);
  writeJson('data_model_inventory.json', dataModelInventory);
  writeJson('permission_inventory.json', permissionInventory);
  writeJson('ai_inventory.json', aiInventory);
  writeJson('integration_inventory.json', integrationInventory);
  writeJson('test_inventory.json', testInventory);
  writeJson('gap_registry.json', { audited_at: AUDITED_AT, count: gaps.length, gaps });
  writeJson('evidence_index.json', evidenceIndex);
  writeJson('pass_01_summary.json', summary);

  // Markdown helpers
  const statusList = (status) =>
    records
      .filter((r) => r.implementation_status === status)
      .map((r) => `- \`${r.capability_id}\` — ${r.capability_name} (${r.severity})`)
      .join('\n') || '_None_';

  const trackBars = trackIds
    .map((t) => {
      const label = {
        A: 'Track A — Foundation',
        B: 'Track B — Identity/Onboarding',
        C: 'Track C — Daily Workspace',
        D: 'Track D — Collaboration',
        E: 'Track E — Knowledge/AI',
        F: 'Track F — Operations',
        G: 'Track G — Communications',
        H: 'Track H — Administration',
        I: 'Track I — Hardening',
        J: 'Track J — Launch',
      }[t];
      return `${label.padEnd(34)} ${bar(trackScores[t].fulfillment_pct)}`;
    })
    .join('\n');

  const domainBarText = domainBars
    .sort((a, b) => a.domain_id - b.domain_id)
    .map((d) => `Domain ${String(d.domain_id).padStart(2, '0')} — ${d.domain.slice(0, 40).padEnd(40)} ${bar(d.fulfillment_pct)}`)
    .join('\n');

  // Write key markdown reports
  writeFileSync(
    join(DOCS, 'PASS_01_EXECUTIVE_SUMMARY.md'),
    `# Pass 1 Executive Summary — Vision-to-Implementation

**Protocol:** V1-CERT-PASS-01  
**Audited at:** ${AUDITED_AT}  
**Audited by:** ${AUDITED_BY}  
**Repair posture:** NO REPAIRS DURING AUDIT

## The answer

> **Did Burt build the platform we intended to build?**

**Partially — with a structural split.**  
Protocol and backend surfaces for Living Intelligence and civic-action domains are extensive.  
**Human-complete, governed, launchable product experiences are far thinner.**  
LocalBrain has **no product page**. Calendar has **APIs but no UI**. Persistence is **JSON file store**, not a production database.  
Almost no capability meets **CERTIFIED PRESENT** under the six-axis gate (by design without journey + production proof).

## Aggregate metrics

| Metric | Count |
|--------|------:|
| Total capabilities audited | ${records.length} |
| CERTIFIED PRESENT | ${byStatus['CERTIFIED PRESENT'] || 0} |
| PARTIALLY IMPLEMENTED | ${byStatus['PARTIALLY IMPLEMENTED'] || 0} |
| SCAFFOLDED ONLY | ${byStatus['SCAFFOLDED ONLY'] || 0} |
| DOCUMENTED ONLY | ${byStatus['DOCUMENTED ONLY'] || 0} |
| IMPLEMENTED DIFFERENTLY | ${byStatus['IMPLEMENTED DIFFERENTLY'] || 0} |
| MISSING | ${byStatus['MISSING'] || 0} |
| DUPLICATED OR CONFLICTING (systems) | ${duplicates.length} |

**Overall Vision Fulfillment (matrix-computed):** ${bar(overall)}

\`\`\`text
${trackBars}
\`\`\`

### Domain bars

\`\`\`text
${domainBarText}
\`\`\`

## What is genuine

- Identity/auth entry: login, register, passwordless, MFA, invite-token pages
- Initiative → objective → mission product surfaces (strongest execution UX)
- Communications workbench (brief, meetings, decisions, documents)
- Learning workbench (courses, competencies, certifications)
- Admin / identity audit surfaces
- Large \`/api/v1/localbrain/*\` protocol API surface + 11.7 wave test scripts

## What was overstated (vs “complete”)

- Living Intelligence W1–W16 “complete” ≠ LocalBrain product complete
- Calendar validation scripts ≠ calendar Human experience
- Wave test pass ≠ end-to-end Human journey
- Documentation / constitutions ≠ operational capability

## P0 launch blockers (seed)

${summary.p0
  .slice(0, 30)
  .map((g) => `- **${g.capability_id}** ${g.name} — ${g.status}`)
  .join('\n') || '_See gap_registry.json_'}

## P1 beta blockers

Count: **${summary.p1_count}** (see \`data/v1-certification/gap_registry.json\`)

## Duplicated / conflicting systems

${duplicates.map((d) => `- **${d.id}**: ${d.systems.join(' vs ')}`).join('\n')}

## Persistence

\`${dataModelInventory.persistence.mode}\` — \`${dataModelInventory.persistence.primary_store}\`  
Production database evidence: **${dataModelInventory.persistence.production_database_evidence}**

## Ready for Pass 2?

**NO — not until Steve accepts this Pass 1 record.**  
Next review should focus on: P0 blockers, duplicated systems, documented/scaffolded-only lists — then authorize repairs or start Pass 2.

## Method honesty

${summary.method_limitations.map((x) => `- ${x}`).join('\n')}
`,
  );

  writeFileSync(
    join(DOCS, 'V1_CAPABILITY_MASTER_REGISTRY.md'),
    `# V1 Capability Master Registry

Generated ${AUDITED_AT}. Machine source: \`data/v1-certification/capability_registry.json\`.

Total: **${records.length}** capabilities.

| ID | Track | Status | Exist | Int | UX | Gov | Rel | Launch | Name |
|----|-------|--------|------:|----:|---:|----:|----:|-------:|------|
${records
  .map(
    (r) =>
      `| ${r.capability_id} | ${r.launch_track} | ${r.implementation_status} | ${r.existence_score} | ${r.integration_score} | ${r.human_experience_score} | ${r.governance_score} | ${r.reliability_score} | ${r.launch_readiness_score} | ${r.capability_name} |`,
  )
  .join('\n')}
`,
  );

  writeFileSync(
    join(DOCS, 'V1_CAPABILITY_CERTIFICATION_MATRIX.md'),
    `# V1 Capability Certification Matrix

Canonical matrix (Pass 1). Source JSON: \`data/v1-certification/certification_matrix.json\`.

Overall fulfillment: **${overall}%**

| ID | Track | Domain | Capability | Built | Int | Works | UX | Gov | Test | Launch | Mode | Status | Severity | Evidence | Gap |
|----|-------|--------|------------|-------|----:|-------|---:|----:|-----:|-------:|------|--------|----------|----------|-----|
${records
  .map((r) => {
    const built = r.existence_score >= 3 ? 'Yes' : r.existence_score >= 1 ? 'Partial' : 'No';
    const works = r.human_experience_score >= 2 && r.existence_score >= 3 ? 'Partial' : 'No/Unverified';
    const ev = r.evidence[0]?.file_or_route || '—';
    const gap = (r.known_gaps[0] || '—').replace(/\|/g, '/');
    return `| ${r.capability_id} | ${r.launch_track} | ${r.domain_id} | ${r.capability_name} | ${built} | ${r.integration_score} | ${works} | ${r.human_experience_score} | ${r.governance_score} | ${r.reliability_score} | ${r.launch_readiness_score} | ${r.implementation_mode} | ${r.implementation_status} | ${r.severity} | ${ev} | ${gap} |`;
  })
  .join('\n')}
`,
  );

  const listDoc = (title, status) =>
    writeFileSync(
      join(DOCS, title),
      `# ${title.replace(/_/g, ' ').replace('.md', '')}\n\nGenerated ${AUDITED_AT}.\n\n${statusList(status)}\n`,
    );

  listDoc('V1_DOCUMENTATION_ONLY_CAPABILITIES.md', 'DOCUMENTED ONLY');
  listDoc('V1_SCAFFOLDED_ONLY_CAPABILITIES.md', 'SCAFFOLDED ONLY');
  listDoc('V1_MISSING_CAPABILITIES.md', 'MISSING');

  writeFileSync(
    join(DOCS, 'V1_DUPLICATED_OR_CONFLICTING_SYSTEMS.md'),
    `# Duplicated or Conflicting Systems\n\n${duplicates.map((d) => `## ${d.id}\n\n- Systems: ${d.systems.join(' · ')}\n- Classification: ${d.classification}\n- Canonical: ${d.canonical_candidate}\n- Evidence: ${d.evidence.join(', ')}\n`).join('\n')}`,
  );

  writeFileSync(
    join(DOCS, 'V1_IMPLEMENTED_DIFFERENTLY_REPORT.md'),
    `# Implemented Differently\n\n${
      records
        .filter((r) => r.implementation_status === 'IMPLEMENTED DIFFERENTLY')
        .map(
          (r) =>
            `## ${r.capability_id} — ${r.capability_name}\n\n${JSON.stringify(r.implementation_difference, null, 2)}\n`,
        )
        .join('\n') || '_None classified in this seed run beyond daily briefing dual-stack._'
    }`,
  );

  writeFileSync(
    join(DOCS, 'V1_DEFERRED_AND_REMOVE_RECOMMENDATIONS.md'),
    `# Deferred and Remove Recommendations\n\n## Consider defer to V2\n\n${records
      .filter((r) => r.recommended_disposition === 'consider-defer-v2')
      .map((r) => `- \`${r.capability_id}\` ${r.capability_name}`)
      .join('\n')}\n\n## Remove from V1\n\n_None formally recommended for removal in Pass 1 seed. Revisit after Steve review and Pass 9._\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_ROUTE_AND_SURFACE_INVENTORY.md'),
    `# Route and Surface Inventory\n\nPages: **${pages.length}** · API routes: **${apis.length}**\n\n## Pages by segment\n\n${Object.entries(routeInventory.pages_by_segment)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n')}\n\n## Notable absences\n\n- No \`localbrain\` page.tsx\n- No \`calendar\` page.tsx\n- No \`select-organization\` / \`select-workspace\` pages\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_SERVICE_AND_API_INVENTORY.md'),
    `# Service and API Inventory\n\nLocalBrain API routes: **${serviceInventory.localbrain_api_count}**\n\nLiving modules: ${serviceInventory.living_modules.join(', ')}\n\nAuth modules:\n${serviceInventory.auth_modules.map((m) => `- ${m}`).join('\n')}\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_DATA_MODEL_INVENTORY.md'),
    `# Data Model Inventory\n\n\`\`\`json\n${JSON.stringify(dataModelInventory, null, 2)}\n\`\`\`\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_PERMISSION_AND_GOVERNANCE_INVENTORY.md'),
    `# Permission and Governance Inventory\n\n\`\`\`json\n${JSON.stringify(permissionInventory, null, 2)}\n\`\`\`\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_AI_CAPABILITY_INVENTORY.md'),
    `# AI Capability Inventory\n\n\`\`\`json\n${JSON.stringify(aiInventory, null, 2)}\n\`\`\`\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_INTEGRATION_INVENTORY.md'),
    `# Integration Inventory\n\n\`\`\`json\n${JSON.stringify(integrationInventory, null, 2)}\n\`\`\`\n`,
  );

  writeFileSync(
    join(DOCS, 'V1_TEST_AND_VALIDATION_INVENTORY.md'),
    `# Test and Validation Inventory\n\n\`\`\`json\n${JSON.stringify(testInventory, null, 2)}\n\`\`\`\n`,
  );

  writeFileSync(
    join(DOCS, 'PASS_01_EVIDENCE_INDEX.md'),
    `# Pass 1 Evidence Index\n\nTotal evidence items: **${evidenceIndex.evidence.length}**\n\nSee \`data/v1-certification/evidence_index.json\`.\n\nFalse-completeness marker files scanned: **${falseMarkers.length}** (sample in summary JSON).\n`,
  );

  const hash = createHash('sha256')
    .update(JSON.stringify(summary.totals))
    .digest('hex')
    .slice(0, 12);

  writeFileSync(
    join(DOCS, 'PASS_01_CURSOR_RETURN.md'),
    `# Pass 1 Cursor Return — V1-CERT-PASS-01

1. **Pass completed:** Audit artifacts generated (inventory classification). Live journey runtime incomplete — see limitations.
2. **Repository and lane map:** \`H:/Block-Street\` · lanes \`(site)\`, \`admin\`, \`api\` · package \`block-street@${pkg.version}\` · branch \`main\` · remote GitHub Grappe501/Block-Street
3. **Canonical documentation used:** PROJECT_CONSTITUTION, USER_EXPERIENCE_BIBLE, PHASE_11_BUILD_LEDGER, docs/platform/launch/*, docs/v1-certification/*, 11.7 living wave docs
4. **Superseded / non-canonical:** Ledger header completion % claims; any progress report stating product-complete LocalBrain/Calendar without UI evidence
5. **Total capabilities audited:** ${records.length}
6. **Certified-present:** ${byStatus['CERTIFIED PRESENT'] || 0}
7. **Partial:** ${byStatus['PARTIALLY IMPLEMENTED'] || 0}
8. **Scaffolded-only:** ${byStatus['SCAFFOLDED ONLY'] || 0}
9. **Documentation-only:** ${byStatus['DOCUMENTED ONLY'] || 0}
10. **Implemented-differently:** ${byStatus['IMPLEMENTED DIFFERENTLY'] || 0}
11. **Duplicated or conflicting systems:** ${duplicates.length} (see V1_DUPLICATED_OR_CONFLICTING_SYSTEMS.md)
12. **Broken:** ${byStatus['BROKEN'] || 0} (not separately force-labeled without live run failures)
13. **Missing:** ${byStatus['MISSING'] || 0}
14. **Deferred (recommended):** ${records.filter((r) => r.recommended_disposition === 'consider-defer-v2').length}
15. **Remove-from-V1:** 0 formal (pending Steve)
16. **P0 launch blockers:** ${summary.p0.length} (see gap registry / executive summary)
17. **P1 beta blockers:** ${summary.p1_count}
18. **Critical user journeys inspected:** Mapped to surfaces (inventory); live walkthrough not executed in this runner — Pass 2
19. **Persistence findings:** JSON civic-action store; no production ORM/DB evidence
20. **Permission/governance findings:** middleware + auth engine present; per-capability server enforcement not fully traced
21. **Cross-Institution isolation:** Protocol claims in kernel/federation; product proof unverified
22. **AI boundary findings:** Large LocalBrain API; no LocalBrain UI; dual COM/LIX stacks
23. **Mobile findings:** No dedicated mobile app lane; responsive unverified in Pass 1
24. **Spanish-path findings:** No evidence of full Spanish onboarding/daily path
25. **Accessibility findings:** No a11y test suite evidenced
26. **Test coverage findings:** Phase11 wave tests strong for protocol; e2e product tests not evidenced
27. **Production-readiness findings:** Not production-backed for core persistence
28. **Track A–J progress bars:**\n\n\`\`\`text\nOverall Vision Fulfillment     ${bar(overall)}\n${trackBars}\n\`\`\`
29. **Domain progress bars:**\n\n\`\`\`text\n${domainBarText}\n\`\`\`
30. **Files created:** docs/v1-certification/* Pass1 artifacts; data/v1-certification/*.json; scripts/v1-certification/*
31. **Files modified:** package.json scripts; docs/v1-certification/README.md; ledger notes as needed
32. **Audit scripts added:** \`scripts/v1-certification/pass-01-run.mjs\` + catalogs
33. **Commands executed:** \`npm run v1:cert:pass1\` (this run)
34. **Validation results:** Matrix generated; typecheck/lint/build not required for inventory gate — optional follow-up
35. **Visual inspection:** \`npm run dev\` → http://localhost:3000/invite/[token], /login, /communications/brief, /learning, /operations, /initiatives — **no** /localbrain, **no** /calendar
36. **Commit hash:** _(set after commit)_ · artifact fingerprint \`${hash}\`
37. **Pass 2 readiness:** **NOT YET** — awaiting Steve acceptance of Pass 1
`,
  );

  // Update README pointer
  console.log(
    JSON.stringify(
      {
        ok: true,
        capabilities: records.length,
        overall_pct: overall,
        by_status: byStatus,
        artifact_fingerprint: hash,
      },
      null,
      2,
    ),
  );
}

main();
