/**
 * CAL-P1.2 — policy evaluator tests (executed by scripts/phase11/test-calendar-rbac.mjs).
 * Assertions live in the runner; this file documents the contract surface.
 */
export const suite = "rbac-policy";
export const covers = [
  "unauthenticated public-only",
  "suspended no mutations",
  "multi-role accumulation",
  "candidate access explicit",
  "publication access explicit",
];
