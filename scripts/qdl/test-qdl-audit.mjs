#!/usr/bin/env node
/**
 * QDL-W1 audit validation
 */
import '../h-drive-env.mjs';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const DATA = join(ROOT, 'data/qdl');

const required = [
  'qdl-w1-route-audit.json',
  'qdl-w1-navigation-audit.json',
  'qdl-w1-copy-findings.json',
  'qdl-w1-growth-stage-visibility.json',
  'qdl-w1-county-college-links.json',
  'qdl-w1-training-entry-map.json',
  'qdl-w1-summary.json',
];

for (const f of required) {
  assert.ok(existsSync(join(DATA, f)), `missing artifact: ${f}`);
}

const routes = JSON.parse(readFileSync(join(DATA, 'qdl-w1-route-audit.json'), 'utf8'));
const nav = JSON.parse(readFileSync(join(DATA, 'qdl-w1-navigation-audit.json'), 'utf8'));
const copy = JSON.parse(readFileSync(join(DATA, 'qdl-w1-copy-findings.json'), 'utf8'));
const colleges = JSON.parse(readFileSync(join(DATA, 'qdl-w1-county-college-links.json'), 'utf8'));
const training = JSON.parse(readFileSync(join(DATA, 'qdl-w1-training-entry-map.json'), 'utf8'));

assert.ok(routes.routes?.length > 0, 'route audit must have routes');
assert.equal(
  routes.routes.filter((r) => !r.recommendedClass).length,
  0,
  'every route needs recommendedClass',
);
assert.equal(
  routes.routes.filter((r) => !r.primaryPurpose).length,
  0,
  'every route needs primaryPurpose',
);
assert.equal(
  routes.routes.filter((r) => r.recommendedClass === 'obsolete' && !r.reason).length,
  0,
  'obsolete routes need reason',
);

const everyday = routes.routes.filter((r) => r.recommendedClass === 'everyday');
assert.ok(everyday.length >= 5, 'expect at least 5 everyday routes');

for (const item of nav.items) {
  assert.ok(item.audience, `nav item missing audience: ${item.label} → ${item.route}`);
}

const engRoutes = new Set(
  routes.routes.filter((r) => r.recommendedClass === 'engineering_debug').map((r) => r.route),
);
const ordinaryNav = nav.items.filter(
  (n) => n.audience === 'participant' && n.disposition !== 'hide',
);
for (const item of ordinaryNav) {
  if (engRoutes.has(item.route)) {
    assert.fail(`ordinary nav points to engineering route: ${item.label} → ${item.route}`);
  }
}

const participantCopy = copy.findings?.filter((f) => f.audience === 'participant') ?? [];
for (const f of participantCopy) {
  assert.ok(
    f.recommendedReplacement || f.hideInstead !== undefined,
    `participant copy finding needs disposition: ${f.route}`,
  );
}

for (const c of colleges.colleges ?? []) {
  assert.ok(c.county, `college ${c.slug} must resolve county or exception`);
  if (!c.countyValid) assert.ok(c.exception, `college ${c.slug} needs explicit exception`);
}

const leadershipTraining = training.entries?.filter((e) =>
  routes.routes.find((r) => r.route === e.route && r.recommendedClass === 'leadership'),
);
assert.ok(leadershipTraining.length > 0, 'leadership routes need training entries');

console.log('test:qdl-audit — all checks passed');
