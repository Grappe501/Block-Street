/**
 * CAE-11.1-W7 — Scenario planning (compare options)
 */
import { caeId } from "../../../utils";
import type { ScenarioComparison, ScenarioOption } from "./contracts";

export function compareScenarios(
  institutionId: string,
  options: ScenarioOption[]
): ScenarioComparison {
  const sorted = [...options].sort((a, b) => {
    const impact = { low: 1, medium: 2, high: 3 };
    return impact[b.impact_band] - impact[a.impact_band];
  });

  let recommendation: string | undefined;
  if (sorted.length >= 2) {
    const highImpact = sorted.find((o) => o.impact_band === "high");
    const lowCost = options.find((o) => o.cost_band === "low");
    if (highImpact && lowCost && highImpact.option_id !== lowCost.option_id) {
      recommendation = `Consider hybrid: ${lowCost.label} phasing into ${highImpact.label} if capacity allows.`;
    } else if (highImpact) {
      recommendation = `${highImpact.label} offers greatest reach — validate capacity via simulation first.`;
    }
  }

  return {
    comparison_id: caeId("scn"),
    options,
    recommendation_optional: recommendation,
    advisory_only: true,
  };
}

export function defaultScenarioOptions(): ScenarioOption[] {
  return [
    {
      option_id: "opt-a",
      label: "Option A — lean rollout",
      cost_band: "low",
      duration_band: "long",
      impact_band: "low",
      summary: "Lower cost, longer duration, narrower reach.",
    },
    {
      option_id: "opt-b",
      label: "Option B — accelerated investment",
      cost_band: "high",
      duration_band: "short",
      impact_band: "high",
      summary: "Higher investment, shorter timeline, greater community reach.",
    },
  ];
}
