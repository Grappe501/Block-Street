/**
 * CAE-11.2-W8 — Configuration and environment validation
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();

export function validateObjectiveProductionConfiguration(): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];

  const requiredFiles = [
    "data/deployment/environments.json",
    "data/deployment/feature_flags.json",
    "data/phase-11/objective_production_manifest.json",
    "netlify.toml",
  ];

  for (const file of requiredFiles) {
    checks.push({
      check_id: `cfg-file-${file.replace(/\//g, "-")}`,
      category: "configuration",
      title: `Required file: ${file}`,
      status: existsSync(join(ROOT, file)) ? "pass" : "fail",
      detail: existsSync(join(ROOT, file)) ? "Present" : "Missing",
      blocking: true,
    });
  }

  try {
    const flags = JSON.parse(readFileSync(join(ROOT, "data/deployment/feature_flags.json"), "utf8"));
    const requiredFlags = [
      "DEPLOYMENT_PIPELINE_ENABLED",
      "DEPLOYMENT_APPROVALS_REQUIRED",
      "DEPLOYMENT_SMOKE_TESTS_REQUIRED",
    ];
    for (const flag of requiredFlags) {
      checks.push({
        check_id: `flag-${flag}`,
        category: "feature_flags",
        title: flag,
        status: flags[flag] === true ? "pass" : "fail",
        detail: flags[flag] === true ? "Enabled" : "Disabled or missing",
        blocking: true,
      });
    }
  } catch {
    checks.push({
      check_id: "flag-parse",
      category: "feature_flags",
      title: "Feature flags parse",
      status: "fail",
      detail: "Could not parse feature_flags.json",
      blocking: true,
    });
  }

  const manifestPath = join(ROOT, "data/phase-11/objective_production_manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    checks.push({
      check_id: "obj-feature-flags",
      category: "objective_flags",
      title: "Objective engine feature flags",
      status: manifest.objective_feature_flags?.OBJECTIVE_ENGINE_ENABLED ? "pass" : "fail",
      detail: "OBJECTIVE_ENGINE_ENABLED must be true for launch",
      blocking: true,
    });
    checks.push({
      check_id: "rollback-strategy",
      category: "rollback",
      title: "Rollback strategy documented",
      status: manifest.rollback_strategy?.documented ? "pass" : "attention",
      detail: manifest.rollback_strategy?.summary ?? "See production manifest",
      blocking: false,
    });
  }

  return checks;
}

export function objectiveConfigurationReady(): boolean {
  return validateObjectiveProductionConfiguration().filter((c) => c.blocking).every((c) => c.status === "pass");
}
