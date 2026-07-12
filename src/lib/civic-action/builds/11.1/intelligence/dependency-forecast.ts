/**
 * CAE-11.1-W6 — Dependency cascade forecast (advisory)
 */
import { initiativeApplicationService } from "../services/application-service";
import type { IntelligenceEvidence } from "./contracts";

export type DependencyCascadeForecast = {
  initiative_id: string;
  root_dependency_id: string;
  root_description: string;
  cascade_steps: string[];
  confidence: "medium" | "low";
  evidence: IntelligenceEvidence[];
};

export function forecastDependencyCascades(initiativeId: string): DependencyCascadeForecast[] {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return [];

  const forecasts: DependencyCascadeForecast[] = [];
  const blocking = agg.dependencies.filter((d) => d.blocks_activation);

  for (const dep of blocking) {
    const steps = [
      `If "${dep.description || dep.target_id}" slips`,
      "Readiness for activation may remain blocked",
      "Dependent missions and volunteer training may delay",
      "County launch and reporting timelines may shift",
    ];
    forecasts.push({
      initiative_id: initiativeId,
      root_dependency_id: dep.initiative_dependency_id,
      root_description: dep.description || dep.target_id,
      cascade_steps: steps,
      confidence: "medium",
      evidence: [
        {
          signal_id: dep.initiative_dependency_id,
          source: "dependency_record",
          summary: `blocking=${dep.blocks_activation} target=${dep.target_type}:${dep.target_id}`,
        },
      ],
    });
  }
  return forecasts;
}
