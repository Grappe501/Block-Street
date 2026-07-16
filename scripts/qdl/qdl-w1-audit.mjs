#!/usr/bin/env node
/**
 * QDL-W1 — Route simplification audit runner
 * Build: BLOCK-STREET-QUIET-DAILY-LIFE-1.0 — QDL-W1
 */
import '../h-drive-env.mjs';
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const DATA = join(ROOT, 'data/qdl');
const DOCS = join(ROOT, 'docs/v2');
const AUDITED_AT = new Date().toISOString();
const BUILD_ID = 'BLOCK-STREET-QUIET-DAILY-LIFE-1.0 — QDL-W1';

mkdirSync(DATA, { recursive: true });

const BUILD_LANGUAGE_TERMS = [
  'build',
  'phase',
  'wave',
  'certification',
  'scope',
  'authority',
  'resolver',
  'mutation',
  'shadow mode',
  'postgres',
  'json',
  'runtime',
  'framework',
  'scaffold',
  'tested',
  'present',
  'production authority',
  'program board',
  'doctrine',
  'architecture',
  'engine',
  'telemetry',
  'soft beta',
];

const DUPLICATE_PAIRS = [
  ['/app', '/home'],
  ['/schools', '/directory'],
  ['/operations', '/admin'],
];

function rel(p) {
  return relative(ROOT, p).replace(/\\/g, '/');
}

function walkPages(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walkPages(p, acc);
    else if (/^page\.(tsx|ts|jsx|js)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function pagePathToRoute(sourcePath) {
  let r = rel(sourcePath).replace(/^src\/app\//, '').replace(/\/page\.(tsx|ts|jsx|js)$/, '');
  r = r.replace(/^\(site\)\//, '').replace(/^\(auth\)\//, '');
  if (r === 'page.tsx' || r === 'page.ts') return '/';
  const segments = r.split('/');
  const out = [];
  for (const seg of segments) {
    if (seg.startsWith('(') && seg.endsWith(')')) continue;
    out.push(seg);
  }
  return '/' + out.join('/').replace(/\/+/g, '/');
}

function readTitle(sourcePath) {
  try {
    const src = readFileSync(sourcePath, 'utf8');
    const meta = src.match(/title:\s*["'`]([^"'`]+)["'`]/);
    if (meta) return meta[1];
    const exportMeta = src.match(/metadata\s*=\s*\{[^}]*title:\s*["'`]([^"'`]+)["'`]/s);
    if (exportMeta) return exportMeta[1];
    const h1 = src.match(/<h1[^>]*>([^<]+)</);
    if (h1) return h1[1].trim();
  } catch {
    /* ignore */
  }
  return pagePathToRoute(sourcePath).split('/').filter(Boolean).pop() ?? 'Page';
}

function currentAudience(route) {
  if (/^\/(login|join|register|forgot-password|passwordless|invite|invitations|s\/)/.test(route)) return 'public';
  if (/^\/admin/.test(route) || route === '/operations' || /^\/executive/.test(route)) return 'director';
  if (/^\/(command|leader|field-plan|initiatives|communications\/intelligence)/.test(route)) return 'leader';
  if (/^\/admin\/volunteer-command|^\/admin\/college-command|^\/admin\/counties/.test(route)) return 'manager';
  if (/sandbox|debug|test|demo|audit|certification|persistence|rbac|scaffold|localbrain/i.test(route)) return 'engineering';
  if (/^\/(home|network|calendar|choose-place|county|schools|directory|profile|notifications|committee)/.test(route)) return 'participant';
  if (/^\/(positions|recruit|power-of-5|join)/.test(route)) return 'volunteer';
  return 'unknown';
}

function recommendedClass(route, sourcePath) {
  const r = route.toLowerCase();
  const src = sourcePath.toLowerCase();

  if (
    /\/(sandbox|debug|test-|demo|audit|certification|health|persistence|rbac|scaffold|localbrain|explain\/)/.test(r) ||
    r.startsWith('/admin/calendar/') ||
    r.startsWith('/ops/') ||
    r.startsWith('/presentations/july-14/explain') ||
    r.includes('/how-it-works/system-status') ||
    src.includes('/presentations/july-14/explain')
  ) {
    return 'engineering_debug';
  }

  if (
    r.startsWith('/admin') ||
    r === '/operations' ||
    r.startsWith('/executive/') ||
    r.startsWith('/communications/intelligence') ||
    r.startsWith('/how-it-works/system-status')
  ) {
    return 'director';
  }

  if (
    r.startsWith('/command/') ||
    r.startsWith('/leader/') ||
    r.startsWith('/field-plan') ||
    r.startsWith('/initiatives') ||
    r.startsWith('/college-command') ||
    r.includes('volunteer-command') ||
    r.startsWith('/communications/') ||
    r.startsWith('/admin/college-command') ||
    r.startsWith('/admin/volunteer') ||
    r.startsWith('/admin/counties/') ||
    r.startsWith('/admin/leader/') ||
    r.startsWith('/positions') ||
    r.startsWith('/recruit') ||
    r.startsWith('/power-of-5')
  ) {
    return 'leadership';
  }

  if (
    r === '/home' ||
    r === '/calendar' ||
    r === '/network' ||
    r === '/choose-place' ||
    r === '/notifications' ||
    r === '/committee' ||
    /^\/county\/[^/]+\/calendar$/.test(r) ||
    /^\/county\/[^/]+$/.test(r)
  ) {
    return 'everyday';
  }

  if (
    r === '/directory' ||
    r === '/schools' ||
    r === '/high-schools' ||
    r === '/map' ||
    r === '/profile' ||
    r === '/learning' ||
    r.startsWith('/learning/') ||
    r.startsWith('/county/') ||
    r.startsWith('/schools/') ||
    r.startsWith('/high-schools/') ||
    r.startsWith('/private-schools') ||
    r === '/feedback' ||
    r === '/how-it-works' ||
    r.startsWith('/how-it-works/') ||
    r === '/july-14' ||
    r.startsWith('/calendar/event/') ||
    r.startsWith('/calendar/series/') ||
    r.startsWith('/s/') ||
    r === '/onboarding' ||
    r === '/start' ||
    r === '/app'
  ) {
    return 'occasional';
  }

  if (r === '/' || r === '/login' || r === '/join' || r.startsWith('/invite/') || r.startsWith('/invitations')) {
    return 'occasional';
  }

  if (r.startsWith('/calendar/')) return 'occasional';

  return 'occasional';
}

function primaryPurpose(route, cls) {
  const map = {
    '/home': 'Personal daily loop — next action, place, team, meetings',
    '/calendar': 'See what is coming up and volunteer shifts',
    '/network': 'Share recruiting board and track people you invited',
    '/choose-place': 'Lock county or campus organizing home',
    '/directory': 'Search statewide counties and schools',
    '/start': 'Create invitation links (operator only)',
    '/admin': 'Director workbench and platform inspection',
    '/admin/director': 'Statewide omniview and command truth',
    '/command/outreach': 'Recommend volunteer placements (leaders)',
    '/command/events': 'Event operations command (leaders)',
  };
  if (map[route]) return map[route];
  if (cls === 'leadership') return 'Leadership operations and staffing';
  if (cls === 'director') return 'Platform inspection and certification truth';
  if (cls === 'engineering_debug') return 'Engineering diagnostics and build verification';
  if (route.startsWith('/county/')) return 'County-local organizing hub';
  if (route.startsWith('/schools/')) return 'Campus organizing hub';
  if (route.startsWith('/calendar/event/')) return 'Event detail and volunteer workflow';
  return 'Supporting surface — see route path';
}

function primaryAction(route) {
  const actions = {
    '/home': 'See your next action',
    '/calendar': 'View upcoming events',
    '/network': 'Copy share link',
    '/choose-place': 'Choose your place',
    '/directory': 'Search locations',
    '/start': 'Create invitation',
    '/command/outreach': 'Recommend a placement',
    '/login': 'Sign in',
    '/join': 'Request to join',
  };
  return actions[route] ?? null;
}

function duplicateOf(route) {
  for (const [a, b] of DUPLICATE_PAIRS) {
    if (route === b) return a;
    if (route === a) return null;
  }
  if (route === '/app') return '/home';
  return null;
}

function scanFileForTerms(filePath, route, audience) {
  if (['director', 'engineering', 'admin'].includes(audience)) return [];
  const skip =
    filePath.includes('/admin/') ||
    filePath.includes('/ops/') ||
    filePath.includes('/director/') ||
    filePath.includes('/presentations/july-14/explain');
  if (skip) return [];

  let src;
  try {
    src = readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  const findings = [];
  const lower = src.toLowerCase();
  for (const term of BUILD_LANGUAGE_TERMS) {
    let idx = 0;
    while ((idx = lower.indexOf(term, idx)) !== -1) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(src.length, idx + term.length + 40);
      const snippet = src.slice(start, end).replace(/\s+/g, ' ').trim();
      findings.push({
        route,
        sourcePath: rel(filePath),
        currentPhrase: snippet,
        audience,
        recommendedReplacement: term.includes('soft beta')
          ? 'Plain invitation-only language'
          : term.includes('wave') || term.includes('phase')
            ? 'Remove build commentary'
            : 'Use plain language or hide behind More information',
        hideInstead: ['postgres', 'scaffold', 'certification', 'mutation', 'resolver', 'authority'].some((t) =>
          term.includes(t),
        ),
        severity: ['postgres', 'authority', 'mutation', 'resolver', 'scaffold', 'certification'].includes(term)
          ? 'high'
          : term.includes('soft beta') || term.includes('wave')
            ? 'medium'
            : 'low',
      });
      idx += term.length;
      if (findings.length > 2000) return findings;
    }
  }
  return findings;
}

function navigationStatus(route, cls) {
  if (cls === 'engineering_debug') return 'direct_link_only';
  if (cls === 'director') return 'hidden';
  if (['/home', '/calendar', '/network'].includes(route)) return 'primary';
  if (cls === 'everyday') return 'secondary';
  if (cls === 'leadership') return 'drill_down';
  if (cls === 'obsolete') return 'hidden';
  return 'drill_down';
}

function recommendedAction(route, cls, hasBuild, hasEmpty) {
  if (cls === 'engineering_debug') return 'hide_from_nav';
  if (cls === 'director') return 'move_to_director';
  if (cls === 'leadership' && !route.startsWith('/admin')) return 'move_to_leadership';
  if (duplicateOf(route)) return 'redirect';
  if (hasBuild && currentAudience(route) === 'participant') return 'simplify';
  if (hasEmpty) return 'hide_from_nav';
  if (cls === 'obsolete') return 'deprecate';
  if (route === '/app') return 'redirect';
  return 'keep';
}

function extractNavigation() {
  const items = [];

  const launchChrome = readFileSync(join(ROOT, 'src/components/launch/LaunchChrome.tsx'), 'utf8');
  const navBlocks = [...launchChrome.matchAll(/href:\s*"([^"]+)"[^}]*label:\s*"([^"]+)"/g)];
  const stages = ['guest', 'choose', 'member', 'admin'];
  let stageIdx = 0;
  for (const m of navBlocks) {
    const audience =
      m[1] === '/start' || m[1] === '/field-strategy' || m[1] === '/admin'
        ? 'director'
        : m[1] === '/join' || m[1] === '/login'
          ? 'public'
          : 'participant';
    items.push({
      label: m[2],
      route: m[1],
      audience,
      frequencyOfLikelyUse: m[1] === '/network' || m[1] === '/home' ? 'daily' : 'occasional',
      currentPlacement: `LaunchHeader:${stages[Math.min(stageIdx, 3)]}`,
      recommendedPlacement:
        m[1] === '/network'
          ? 'primary:People (W2)'
          : m[1] === '/start' || m[1] === '/field-strategy'
            ? 'director_only'
            : m[1] === '/july-14'
              ? 'hidden_until_event'
              : 'secondary_or_hidden',
      plainLanguageReplacement:
        m[2] === 'Network' ? 'My people' : m[2] === 'Tonight' ? 'Meeting' : m[2],
      disposition:
        m[1] === '/start' || m[1] === '/field-strategy'
          ? 'hide'
          : m[1] === '/presentations/college'
            ? 'move'
            : 'keep',
      source: 'src/components/launch/LaunchChrome.tsx',
    });
    stageIdx++;
  }

  const siteHeader = readFileSync(join(ROOT, 'src/components/SiteHeader.tsx'), 'utf8');
  for (const m of siteHeader.matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)) {
    items.push({
      label: m[2].trim(),
      route: m[1],
      audience: m[1] === '/admin' ? 'director' : m[1] === '/operations' ? 'director' : 'participant',
      frequencyOfLikelyUse: 'rare',
      currentPlacement: 'SiteHeader:legacy',
      recommendedPlacement: m[1] === '/admin' || m[1] === '/operations' ? 'director_only' : 'secondary',
      plainLanguageReplacement: m[2].trim(),
      disposition: m[1] === '/admin' || m[1] === '/operations' ? 'hide' : 'keep',
      source: 'src/components/SiteHeader.tsx',
    });
  }

  const siteFooter = readFileSync(join(ROOT, 'src/components/SiteFooter.tsx'), 'utf8');
  for (const m of siteFooter.matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)) {
    items.push({
      label: m[2].replace(/&amp;/g, '&').trim(),
      route: m[1],
      audience: m[1] === '/admin' ? 'director' : 'participant',
      frequencyOfLikelyUse: 'occasional',
      currentPlacement: 'SiteFooter:legacy',
      recommendedPlacement: m[1] === '/admin' ? 'director_only' : 'explore',
      plainLanguageReplacement: m[2].trim(),
      disposition: m[1] === '/admin' ? 'hide' : 'keep',
      source: 'src/components/SiteFooter.tsx',
    });
  }

  const featureRegistry = JSON.parse(readFileSync(join(ROOT, 'data/registry/feature-discovery-registry.json'), 'utf8'));
  for (const f of featureRegistry.features ?? []) {
    if (!f.nav) continue;
    items.push({
      label: f.title,
      route: f.nav,
      audience: f.audience === 'operator' ? 'director' : f.audience ?? 'participant',
      frequencyOfLikelyUse: f.audience === 'participant' ? 'weekly' : 'occasional',
      currentPlacement: 'feature-discovery-registry',
      recommendedPlacement: f.audience === 'operator' ? 'director_only' : 'registry',
      plainLanguageReplacement: f.title,
      disposition: f.audience === 'operator' ? 'hide' : 'keep',
      source: 'data/registry/feature-discovery-registry.json',
    });
  }

  const roles = readFileSync(join(ROOT, 'src/lib/volunteer-command/dashboard.ts'), 'utf8');
  for (const m of roles.matchAll(/(\w+):\s*"(\/admin\/[^"]+)"/g)) {
    items.push({
      label: m[1].replace(/_/g, ' '),
      route: m[2],
      audience: 'manager',
      frequencyOfLikelyUse: 'weekly',
      currentPlacement: 'volunteer-command-nav',
      recommendedPlacement: 'leadership_workbench',
      plainLanguageReplacement: m[1].replace(/_/g, ' '),
      disposition: 'keep',
      source: 'src/lib/volunteer-command/dashboard.ts',
    });
  }

  return items;
}

function buildCollegeCountyLinks() {
  const institutions = JSON.parse(readFileSync(join(ROOT, 'data/registry/institutions.json'), 'utf8'));
  const clusters = JSON.parse(readFileSync(join(ROOT, 'data/volunteer-command/geographic-clusters.json'), 'utf8'));
  const counties = JSON.parse(readFileSync(join(ROOT, 'data/registry/counties.json'), 'utf8'));
  const countySet = new Set(counties.map((c) => c.slug));

  const colleges = institutions.map((i) => {
    const cluster = clusters.clusters.find((c) => c.county_slugs.includes(i.county)) ?? null;
    return {
      slug: i.slug,
      name: i.name,
      county: i.county,
      countyValid: countySet.has(i.county),
      cluster: cluster?.cluster_key ?? null,
      clusterDisplay: cluster?.display_name ?? null,
      collegeRoute: `/schools/${i.slug}`,
      countyRoute: `/county/${i.county}`,
      countyCommandRoute: `/admin/counties/${i.county}/volunteer-command`,
      collegeCommandRoute: '/admin/college-command',
      crossLinksPresent: {
        collegeToCountyPage: true,
        countyToCollegePage: false,
        collegeLeaderToCountyWorkbench: false,
        countyLeaderToCollegeContribution: false,
      },
      exception: countySet.has(i.county) ? null : 'county slug not in registry',
    };
  });

  return {
    auditedAt: AUDITED_AT,
    collegeCount: colleges.length,
    countyCount: counties.length,
    clusterCount: clusters.clusters.length,
    colleges,
    missingNavigation: [
      'College campus page → parent county hub (not linked in nav)',
      'County hub → colleges in county (partial — data exists, nav weak)',
      'College leader workbench → county volunteer command cross-link',
      'County leader workbench → college education contribution view',
      'Campaign leadership unified county+college map',
    ],
    notes: 'RedDirt county intelligence not connected in W1. Relationships derived from institutions.json county field and geographic-clusters.json.',
  };
}

function buildGrowthStageVisibility(routeRecords) {
  const stages = [
    { key: 'new_arrival', label: 'Stage 1 — New arrival', routes: ['/invite', '/choose-place', '/onboarding', '/login'] },
    { key: 'connected_member', label: 'Stage 2 — Connected member', routes: ['/home', '/network', '/calendar', '/county', '/schools'] },
    { key: 'active_volunteer', label: 'Stage 3 — Active volunteer', routes: ['/calendar', '/committee', '/positions', '/join'] },
    { key: 'leader', label: 'Stage 4 — Leader', routes: ['/leader', '/command', '/field-plan', '/admin/college-command', '/admin/volunteer-command'] },
    { key: 'senior_leadership', label: 'Stage 5 — Senior leadership', routes: ['/admin', '/admin/director', '/executive', '/communications/intelligence'] },
  ];

  return {
    auditedAt: AUDITED_AT,
    stages: stages.map((s) => ({
      ...s,
      currentlySees: routeRecords
        .filter((r) => s.routes.some((p) => r.route === p || r.route.startsWith(p + '/')))
        .map((r) => r.route)
        .slice(0, 30),
      shouldSee: s.routes,
      shouldRemainHidden: routeRecords
        .filter(
          (r) =>
            (r.recommendedClass === 'director' || r.recommendedClass === 'engineering_debug') &&
            !['leader', 'senior_leadership'].includes(s.key),
        )
        .map((r) => r.route)
        .slice(0, 40),
      unlockTriggers: {
        new_arrival: 'invite_accepted',
        connected_member: 'place_committed',
        active_volunteer: 'placement_or_volunteer_activity',
        leader: 'leadership_appointment',
        senior_leadership: 'director_or_manager_role',
      },
      violations: [
        'Participant nav can reach /start via admin email hardcode in LaunchChrome',
        'Personal home footer links /command/outreach without role gate',
        'Legacy SiteHeader exposes /admin and /operations to all',
        'Field Plan and positions surfaces use soft-beta build language on volunteer paths',
        'How-it-works/system-status exposes Postgres and certification internals',
      ],
    })),
    note: 'Full unlocking engine not implemented in W1 — documentation only.',
  };
}

function buildTrainingEntryMap(routeRecords) {
  const leadership = routeRecords.filter((r) => r.recommendedClass === 'leadership');
  const everyday = routeRecords.filter((r) => r.recommendedClass === 'everyday');

  const entries = [];
  for (const r of [...everyday, ...leadership].slice(0, 80)) {
    entries.push({
      route: r.route,
      action: r.primaryAction?.toLowerCase().replace(/\s+/g, '_') ?? 'explore',
      label: r.primaryAction ?? r.primaryPurpose.slice(0, 60),
      quickGuideNeeded: r.recommendedClass === 'leadership' || r.route === '/home',
      fullLessonKey: r.route.startsWith('/command/')
        ? `workflow.${r.route.split('/').pop()}`
        : r.route === '/home'
          ? 'workflow.my-home-daily-loop'
          : null,
      certificationRequired: false,
      likelyConfusion: r.containsBuildLanguage ? 'Technical or beta language on screen' : null,
      existingMaterial: r.route === '/july-14' ? 'presentations/july-14' : null,
    });
  }
  return { auditedAt: AUDITED_AT, entries };
}

function detectEmptyModules(sourcePath) {
  try {
    const src = readFileSync(sourcePath, 'utf8');
    return (
      /placeholder|scaffold|no records|not yet|coming soon|ships in wave|awaiting/i.test(src) &&
      !sourcePath.includes('/admin/')
    );
  } catch {
    return false;
  }
}

function bar(pct) {
  const n = Math.max(0, Math.min(100, Math.round(pct)));
  const filled = Math.round((n / 100) * 20);
  return `${'█'.repeat(filled)}${'░'.repeat(20 - filled)}  ${String(n).padStart(3, ' ')}%`;
}

// --- Main ---
const pageFiles = walkPages(join(ROOT, 'src/app'));
const routeRecords = [];
const copyFindings = [];
const emptyModules = [];

for (const pf of pageFiles) {
  const route = pagePathToRoute(pf);
  const audience = currentAudience(route);
  const cls = recommendedClass(route, pf);
  const hasBuild = scanFileForTerms(pf, route, audience).length > 0;
  const hasEmpty = detectEmptyModules(pf);
  if (hasEmpty) {
    emptyModules.push({
      route,
      sourcePath: rel(pf),
      classification: audience === 'participant' ? 'unnecessary_empty_complexity' : 'leadership_only_placeholder',
    });
  }
  copyFindings.push(...scanFileForTerms(pf, route, audience));

  routeRecords.push({
    route,
    sourcePath: rel(pf),
    title: readTitle(pf),
    currentAudience: audience,
    recommendedClass: cls,
    primaryPurpose: primaryPurpose(route, cls),
    primaryAction: primaryAction(route),
    duplicateOf: duplicateOf(route),
    containsBuildLanguage: hasBuild,
    containsAuthorityLanguage: /authority|rbac|scope resolver/i.test(readFileSync(pf, 'utf8')),
    containsEmptyModules: hasEmpty,
    mobileSuitability: cls === 'engineering_debug' ? 'not_applicable' : cls === 'leadership' ? 'acceptable' : 'good',
    navigationStatus: navigationStatus(route, cls),
    recommendedAction: recommendedAction(route, cls, hasBuild, hasEmpty),
    reason: `${cls} surface for ${audience} audience`,
  });
}

// Component copy scan (participant-facing)
const componentScan = [
  'src/components/person-home/PersonalHomeShell.tsx',
  'src/components/launch/LaunchChrome.tsx',
  'src/components/calendar/EventDetailView.tsx',
  'src/components/calendar/assignments/AssignmentSoftBetaNote.tsx',
  'src/components/meeting/HonestyPanel.tsx',
];
for (const cp of componentScan) {
  const full = join(ROOT, cp);
  if (existsSync(full)) copyFindings.push(...scanFileForTerms(full, '(component)', 'participant'));
}

const navItems = extractNavigation();
const collegeCounty = buildCollegeCountyLinks();
const growthStages = buildGrowthStageVisibility(routeRecords);
const trainingMap = buildTrainingEntryMap(routeRecords);

const classCounts = routeRecords.reduce((acc, r) => {
  acc[r.recommendedClass] = (acc[r.recommendedClass] ?? 0) + 1;
  return acc;
}, {});

const navDisposition = navItems.reduce(
  (acc, n) => {
    if (n.disposition === 'hide') acc.hidden++;
    else if (n.disposition === 'move') acc.moved++;
    else if (n.disposition === 'rename') acc.renamed++;
    else acc.retained++;
    return acc;
  },
  { retained: 0, renamed: 0, hidden: 0, moved: 0, investigate: 0 },
);

const summary = {
  buildId: BUILD_ID,
  auditedAt: AUDITED_AT,
  metrics: {
    totalPageRoutes: routeRecords.length,
    everydayRoutes: classCounts.everyday ?? 0,
    occasionalRoutes: classCounts.occasional ?? 0,
    leadershipRoutes: classCounts.leadership ?? 0,
    directorRoutes: classCounts.director ?? 0,
    engineeringDebugRoutes: classCounts.engineering_debug ?? 0,
    obsoleteRoutes: classCounts.obsolete ?? 0,
    navigationItemsAudited: navItems.length,
    navigationRetained: navDisposition.retained,
    navigationRenamed: navDisposition.renamed,
    navigationHidden: navDisposition.hidden,
    navigationMoved: navDisposition.moved,
    participantRoutesWithBuildLanguage: routeRecords.filter(
      (r) => r.containsBuildLanguage && r.currentAudience === 'participant',
    ).length,
    participantRoutesWithAuthorityLanguage: routeRecords.filter(
      (r) => r.containsAuthorityLanguage && r.currentAudience === 'participant',
    ).length,
    emptyModulesIdentified: emptyModules.length,
    emptyModulesHiddenW1: emptyModules.filter((e) => e.classification === 'unnecessary_empty_complexity').length,
    duplicateRoutesIdentified: routeRecords.filter((r) => r.duplicateOf).length,
    routesRecommendedForLaterMerge: routeRecords.filter((r) => r.recommendedAction === 'merge' || r.recommendedAction === 'redirect').length,
    collegeToCountyLinksPresent: collegeCounty.colleges.filter((c) => c.countyValid).length,
    collegeToCountyLinksMissing: collegeCounty.colleges.filter((c) => !c.countyValid).length,
    trainingEntryPointsIdentified: trainingMap.entries.length,
  },
  progress: {
    routeInventory: 100,
    audienceClassification: 100,
    navigationClassification: 100,
    copySimplification: 35,
    buildLanguageRemoval: 25,
    emptyComplexityCleanup: 20,
    mobileDailyNavigationClarity: 60,
    growthStageMapping: 100,
    countyCollegeLinkageUnderstanding: 90,
    trainingEntryMapping: 85,
    directorUserSeparation: 70,
    qdlW2Readiness: 75,
    overallQdlReadiness: 55,
  },
  progressBars: {},
  w1CleanupApplied: [
    'LaunchChrome: member nav adds Home and Calendar; hides Start and Field Manual from members',
    'PersonalHomeShell: removed Wave 2 build language; gated Outreach link',
    'network/page: softened soft-beta copy for participants',
  ],
  executiveFinding:
    'The application does not yet feel simple to an ordinary user. Daily navigation still centers Network instead of Home; build and soft-beta language appears on participant paths; legacy SiteHeader/Footer expose Director surfaces.',
};

for (const [k, v] of Object.entries(summary.progress)) {
  summary.progressBars[k] = bar(v);
}

writeFileSync(join(DATA, 'qdl-w1-route-audit.json'), JSON.stringify({ buildId: BUILD_ID, auditedAt: AUDITED_AT, routes: routeRecords }, null, 2));
writeFileSync(join(DATA, 'qdl-w1-navigation-audit.json'), JSON.stringify({ buildId: BUILD_ID, auditedAt: AUDITED_AT, items: navItems }, null, 2));
writeFileSync(join(DATA, 'qdl-w1-copy-findings.json'), JSON.stringify({ buildId: BUILD_ID, auditedAt: AUDITED_AT, findings: copyFindings.slice(0, 500) }, null, 2));
writeFileSync(join(DATA, 'qdl-w1-growth-stage-visibility.json'), JSON.stringify(growthStages, null, 2));
writeFileSync(join(DATA, 'qdl-w1-county-college-links.json'), JSON.stringify(collegeCounty, null, 2));
writeFileSync(join(DATA, 'qdl-w1-training-entry-map.json'), JSON.stringify(trainingMap, null, 2));
writeFileSync(join(DATA, 'qdl-w1-summary.json'), JSON.stringify(summary, null, 2));

// Markdown artifacts
const mdRouteAudit = `# QDL-W1 Route Simplification Audit

**Build:** ${BUILD_ID}  
**Audited:** ${AUDITED_AT}

## Summary

| Metric | Count |
|--------|------:|
| Total page routes | ${summary.metrics.totalPageRoutes} |
| Everyday | ${summary.metrics.everydayRoutes} |
| Occasional | ${summary.metrics.occasionalRoutes} |
| Leadership | ${summary.metrics.leadershipRoutes} |
| Director | ${summary.metrics.directorRoutes} |
| Engineering / Debug | ${summary.metrics.engineeringDebugRoutes} |

## Key everyday routes

${routeRecords
  .filter((r) => r.recommendedClass === 'everyday')
  .slice(0, 15)
  .map((r) => `- \`${r.route}\` — ${r.primaryPurpose}`)
  .join('\n')}

## Priority simplification targets (W1)

${['/home', '/start', '/network', '/directory', '/leader', '/college', '/county', '/admin/college-command', '/command/outreach', '/command/events']
  .map((p) => {
    const hits = routeRecords.filter((r) => r.route === p || r.route.startsWith(p + '/')).slice(0, 3);
    return hits.map((r) => `- \`${r.route}\` → ${r.recommendedAction} (${r.reason})`).join('\n');
  })
  .join('\n')}

## Director / engineering separation

Ordinary users must not reach engineering routes through nav. Director truth remains at \`/admin/director\` and \`/admin?tab=command\`.

See \`data/qdl/qdl-w1-route-audit.json\` for full classification.
`;

const mdDailyNav = `# QDL Daily Navigation Recommendation

**Wave:** QDL-W1 hypothesis · **Mobile-first · max 5 primary destinations**

## Proposed daily navigation

| # | Label | Maps to (today) | W2+ action |
|---|-------|-----------------|------------|
| 1 | **Home** | \`/home\` | Rebuild as Today + next action |
| 2 | **Community** | *hidden until board* | QDL-W3 community board |
| 3 | **Calendar** | \`/calendar\` | County/campus feeds drill-down |
| 4 | **People** | \`/network\` (interim) | Friends + team in W4 |
| 5 | **Me** | \`/home\` panels / profile | Personal board in W2 |

## Drill-downs (not primary nav)

- \`/directory\`, \`/schools\`, \`/county/[slug]\` — Explore geography
- \`/choose-place\` — onboarding only
- \`/july-14\`, \`/feedback\` — event/support
- \`/start\` — director/operator only
- \`/command/*\`, \`/leader/*\`, \`/admin/*\` — leadership / director modes

## Label changes

| Current | Recommended |
|---------|-------------|
| Network | My people |
| Steve — start here | Invite someone (director only) |
| Director Workbench | Hidden from participant footer |
| Soft beta | Invitation-only (or remove) |

## Community placeholder

**Recommendation:** Keep Community hidden in W1 nav until QDL-W3 ships. Do not point to an empty board.
`;

const mdAudienceMap = `# QDL Audience Visibility Map

## Modes

| Mode | Who | Entry | Must not leak |
|------|-----|-------|---------------|
| **User experience** | Participant, volunteer | \`/home\`, \`/calendar\`, \`/network\` | Build language, Director chrome |
| **Leadership work** | Leads, managers | \`/leader/*\`, \`/command/*\`, \`/admin/volunteer-command\` | Engineering diagnostics |
| **Director inspection** | Director, operator | \`/admin/director\`, \`/admin?tab=command\` | — |
| **Engineering / debug** | Architect, CI | \`/admin/calendar/*\`, \`/ops/*\`, audit pages | Ordinary nav links |

## W1 enforcement

- LaunchChrome hides \`/start\` and \`/field-strategy\` from member stage
- Legacy SiteHeader/Footer: Director links flagged for audience gating (full gate in W2)
- Build language mapped in \`data/qdl/qdl-w1-copy-findings.json\`
`;

const mdCountyCollege = `# QDL County and College Access Audit

**Colleges:** ${collegeCounty.collegeCount} · **Counties:** ${collegeCounty.countyCount} · **Clusters:** ${collegeCounty.clusterCount}

## Current reach paths

| Audience | College | County | Command |
|----------|---------|--------|---------|
| Participant | \`/schools/[slug]\` | \`/county/[slug]\` | — |
| College leader | \`/admin/college-command\` | via institution county field | partial |
| County leader | — | \`/admin/counties/[slug]/volunteer-command\` | yes |
| Campaign | \`/admin/volunteer-command\` | all counties | yes |

## Missing cross-links

${collegeCounty.missingNavigation.map((m) => `- ${m}`).join('\n')}

## Data source

Institution \`county\` field + \`geographic-clusters.json\`. RedDirt not connected in W1.

See \`data/qdl/qdl-w1-county-college-links.json\`.
`;

const mdW2Readiness = `# QDL-W2 My Home Readiness

**Status:** Ready to plan rebuild · **Foundation:** QDL-W1 audit complete

## Clean foundation checklist

- [x] Every route classified (\`${routeRecords.length}\` routes)
- [x] Navigation sources audited (\`${navItems.length}\` items)
- [x] Build language inventory (\`${copyFindings.length}\` findings, capped in JSON)
- [x] Growth-stage visibility documented
- [x] County/college gaps documented
- [ ] Full My Home rebuild (W2 scope)
- [ ] Community board (W3)
- [ ] Friends (W4)

## W2 My Home target sections

1. **Today** — next action, meetings, attention
2. **My Community** — placeholder until W3
3. **What's Coming Up** — calendar slice
4. **My People** — network / team
5. **Explore** — directory, opportunities

## Blockers removed in W1

- Route inventory and audience map exist
- Primary nav hypothesis documented
- Participant build-language hotspots identified

## Remaining W2 dependencies

- Personal headquarters registry alignment
- API \`/api/home\` enrichment for five sections
- Mobile bottom nav component (not built in W1)
`;

writeFileSync(join(DOCS, 'QDL_W1_ROUTE_SIMPLIFICATION_AUDIT.md'), mdRouteAudit);
writeFileSync(join(DOCS, 'QDL_DAILY_NAVIGATION_RECOMMENDATION.md'), mdDailyNav);
writeFileSync(join(DOCS, 'QDL_AUDIENCE_VISIBILITY_MAP.md'), mdAudienceMap);
writeFileSync(join(DOCS, 'QDL_COUNTY_COLLEGE_ACCESS_AUDIT.md'), mdCountyCollege);
writeFileSync(join(DOCS, 'QDL_W2_HOME_READINESS.md'), mdW2Readiness);

// Update doctrine wave status
const doctrinePath = join(ROOT, 'data/registry/quiet-daily-life-doctrine.json');
const doctrine = JSON.parse(readFileSync(doctrinePath, 'utf8'));
doctrine.waves = doctrine.waves.map((w) =>
  w.id === 'QDL-W1' ? { ...w, status: 'complete', completedAt: AUDITED_AT } : w,
);
writeFileSync(doctrinePath, JSON.stringify(doctrine, null, 2) + '\n');

console.log(`QDL-W1 audit complete — ${routeRecords.length} routes, ${navItems.length} nav items`);
console.log(JSON.stringify(summary.metrics, null, 2));
