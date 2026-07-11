import type { MigrationRiskLevel } from "./types";

export function classifyMigrationRisk(factors: {
  record_volume?: number;
  contains_restricted_data?: boolean;
  contains_youth_data?: boolean;
  identity_ambiguity?: boolean;
  legacy_system_shutdown?: boolean;
}): { risk_level: MigrationRiskLevel; risk_factors: string[]; required_dry_runs: number } {
  const risk_factors: string[] = [];
  let score = 0;

  if ((factors.record_volume ?? 0) > 10000) {
    score += 2;
    risk_factors.push("Large record volume");
  } else if ((factors.record_volume ?? 0) > 1000) {
    score += 1;
    risk_factors.push("Moderate record volume");
  }

  if (factors.contains_restricted_data) {
    score += 2;
    risk_factors.push("Contains restricted data");
  }
  if (factors.contains_youth_data) {
    score += 2;
    risk_factors.push("Contains youth or student data");
  }
  if (factors.identity_ambiguity) {
    score += 1;
    risk_factors.push("Identity ambiguity likely");
  }
  if (factors.legacy_system_shutdown) {
    score += 2;
    risk_factors.push("Legacy system shutdown dependency");
  }

  let risk_level: MigrationRiskLevel = "M1";
  if (score >= 5) risk_level = "M4";
  else if (score >= 3) risk_level = "M3";
  else if (score >= 1) risk_level = "M2";

  return {
    risk_level,
    risk_factors,
    required_dry_runs: risk_level === "M4" ? 2 : risk_level === "M3" ? 1 : 1,
  };
}
