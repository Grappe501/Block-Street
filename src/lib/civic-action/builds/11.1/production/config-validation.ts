/**
 * CAE-11.1-W8 — Configuration and environment validation
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();

export function validateProductionConfiguration(): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];

  const requiredFiles = [
    "data/deployment/environments.json",
    "data/deployment/feature_flags.json",
    "data/phase-11/initiative_production_manifest.json",
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

  try {
    const envs = JSON.parse(readFileSync(join(ROOT, "data/deployment/environments.json"), "utf8"));
    const production = envs.environments?.find((e: { name: string }) => e.name === "production");
    checks.push({
      check_id: "env-production",
      category: "environment",
      title: "Production environment registered",
      status: production?.status === "operational" ? "pass" : "attention",
      detail: production ? `status=${production.status}` : "Not found",
      blocking: false,
    });
    checks.push({
      check_id: "env-staging",
      category: "environment",
      title: "Staging environment registered",
      status: envs.environments?.some((e: { name: string }) => e.name === "staging") ? "pass" : "attention",
      detail: "Staging required before production promotion",
      blocking: false,
    });
  } catch {
    checks.push({
      check_id: "env-parse",
      category: "environment",
      title: "Environment registry",
      status: "fail",
      detail: "Could not parse environments.json",
      blocking: true,
    });
  }

  const manifestPath = join(ROOT, "data/phase-11/initiative_production_manifest.json");
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    checks.push({
      check_id: "ini-feature-flags",
      category: "initiative_flags",
      title: "Initiative engine feature flags",
      status: manifest.initiative_feature_flags?.INITIATIVE_ENGINE_ENABLED ? "pass" : "fail",
      detail: "INITIATIVE_ENGINE_ENABLED must be true for launch",
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

export function configurationReady(): boolean {
  return validateProductionConfiguration().filter((c) => c.blocking).every((c) => c.status === "pass");
}
