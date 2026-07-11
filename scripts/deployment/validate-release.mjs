#!/usr/bin/env node
/**
 * Release validation gate — checks build contract and deployment registry.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const errors = [];

function requireFile(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) errors.push(`Missing required file: ${rel}`);
  return p;
}

requireFile("netlify.toml");
requireFile("data/registry/deployment-platform.json");
requireFile("data/deployment/environments.json");
requireFile("data/deployment/feature_flags.json");
requireFile("src/lib/deployment/engine.ts");

const registry = JSON.parse(readFileSync(join(root, "data/registry/deployment-platform.json"), "utf8"));
if (registry.requirementId !== "DPL-001") errors.push("deployment-platform.json requirementId must be DPL-001");
if (!registry.acceptanceCriteria) errors.push("deployment-platform.json missing acceptanceCriteria");

const flags = JSON.parse(readFileSync(join(root, "data/deployment/feature_flags.json"), "utf8"));
if (!flags.DEPLOYMENT_PIPELINE_ENABLED) errors.push("DEPLOYMENT_PIPELINE_ENABLED must be true");

if (errors.length) {
  console.error("validate:release failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log("validate:release passed — DPL-001 build contract OK");
