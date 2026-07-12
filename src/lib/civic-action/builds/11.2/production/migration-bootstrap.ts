/**
 * CAE-11.2-W8 — Data migration and institution bootstrap
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { ReadinessCheck } from "./contracts";

const ROOT = process.cwd();

export function assessObjectiveMigrationBootstrap(): ReadinessCheck[] {
  const checks: ReadinessCheck[] = [];
  const manifestPath = join(ROOT, "data/phase-11/objective_production_manifest.json");

  if (!existsSync(manifestPath)) {
    return [
      {
        check_id: "bootstrap-manifest",
        category: "bootstrap",
        title: "Production manifest",
        status: "fail",
        detail: "objective_production_manifest.json missing",
        blocking: true,
      },
    ];
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const bootstrap = manifest.bootstrap ?? {};

  const items: { key: string; title: string; path?: string }[] = [
    { key: "institution_seed", title: "Initial institution creation", path: bootstrap.institution_seed_path },
    { key: "objective_type_seeds", title: "Objective type seeds", path: bootstrap.objective_type_seeds_path },
    { key: "governance_defaults", title: "Default governance", path: bootstrap.governance_defaults_path },
    { key: "identity_bootstrap", title: "Identity bootstrap", path: bootstrap.identity_bootstrap_path },
    { key: "invitation_bootstrap", title: "Invitation bootstrap", path: bootstrap.invitation_bootstrap_path },
  ];

  for (const item of items) {
    const fileOk = item.path ? existsSync(join(ROOT, item.path)) : !!bootstrap[item.key];
    checks.push({
      check_id: `bootstrap-${item.key}`,
      category: "bootstrap",
      title: item.title,
      status: fileOk ? "pass" : "attention",
      detail: fileOk ? (item.path ?? "Configured in manifest") : "Bootstrap artifact pending",
      blocking: item.key === "institution_seed",
    });
  }

  checks.push({
    check_id: "migration-readiness",
    category: "migration",
    title: "Migration readiness",
    status: manifest.migration?.readiness === "ready" ? "pass" : "attention",
    detail: manifest.migration?.notes ?? "Review migration plan before production cutover",
    blocking: false,
  });

  return checks;
}

export function objectiveBootstrapReady(): boolean {
  return assessObjectiveMigrationBootstrap().filter((c) => c.blocking).every((c) => c.status === "pass");
}
