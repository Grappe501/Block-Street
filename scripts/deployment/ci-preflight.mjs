#!/usr/bin/env node
/**
 * CI preflight — fail fast when required build secrets are missing.
 * Usage: node scripts/deployment/ci-preflight.mjs
 */
const isCi = process.env.GITHUB_ACTIONS === "true" || process.env.CI === "true";

if (!isCi) {
  console.log("ci-preflight skipped — not running in CI");
  process.exit(0);
}

if (!process.env.AUTH_SESSION_SECRET) {
  console.error(
    "CI configuration error: AUTH_SESSION_SECRET is required for production builds.\n" +
      "Add a CI-only repository secret in GitHub Actions (Settings → Secrets and variables → Actions)."
  );
  process.exit(1);
}

console.log("ci-preflight passed — AUTH_SESSION_SECRET is configured");
