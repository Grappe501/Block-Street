#!/usr/bin/env node
/**
 * Post-deployment smoke test scaffold — safe synthetic checks.
 */
const base = process.env.SMOKE_TEST_URL ?? "http://localhost:3000";

async function check(path, label) {
  try {
    const res = await fetch(`${base}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`PASS: ${label}`);
    return true;
  } catch (e) {
    console.error(`FAIL: ${label} — ${e.message}`);
    return false;
  }
}

const results = await Promise.all([
  check("/api/v1/health", "API v1 health"),
  check("/api/v1/deployments/health", "Deployment health"),
]);

if (results.some((r) => !r)) process.exit(1);
console.log("smoke:test passed");
