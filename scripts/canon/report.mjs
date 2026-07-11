#!/usr/bin/env node
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CANON_DATA, loadKernel } from "./lib.mjs";

const { objects, requirements } = loadKernel();
const validationPath = join(CANON_DATA, "canon_validation.json");
const readinessPath = join(CANON_DATA, "canon_readiness.json");
const validation = existsSync(validationPath) ? JSON.parse(readFileSync(validationPath, "utf8")) : null;
const readiness = existsSync(readinessPath) ? JSON.parse(readFileSync(readinessPath, "utf8")) : null;

const lines = [
  "# Canon Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Summary",
  "",
  `- **Objects:** ${objects.length}`,
  `- **Requirements:** ${requirements.length}`,
  `- **Validation:** ${validation?.passed ? "PASSED" : validation ? "FAILED" : "not run"}`,
  "",
];

if (readiness) {
  lines.push("## Readiness", "");
  for (const [key, val] of Object.entries(readiness)) {
    if (val && typeof val === "object" && "percent" in val) {
      lines.push(`- **${key}:** ${val.percent}% (${val.numerator}/${val.denominator})`);
    }
  }
  lines.push("");
}

lines.push("## Registered Objects", "");
for (const o of objects) {
  lines.push(`- \`${o.canon_id}\` — ${o.canonical_name} [${o.legacy_requirement_id || o.status}]`);
}

const outPath = join(CANON_DATA, "..", "..", "canon", "reports", "canon-report.md");
writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(`Canon report written: canon/reports/canon-report.md`);
