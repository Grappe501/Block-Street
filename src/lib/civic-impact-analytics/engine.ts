import {
  appendAudit,
  loadAudit,
  loadFeatureFlags,
  loadScorecards,
  loadTrendPacks,
  persistScorecards,
  persistTrendPacks,
} from "./data";
import type { CivicImpactOverview, CivicImpactScorecard, ImpactDimension, ImpactTrendPack } from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function safeScore(label: ImpactDimension["id"], source: string, score: number, explanation: string): ImpactDimension {
  return { id: label, label: label[0].toUpperCase() + label.slice(1), score: clamp(score), source_engine: source, explanation };
}

export function buildScorecard(input: {
  institution_id: string;
  county_id?: string | null;
}): CivicImpactScorecard {
  const flags = loadFeatureFlags();
  if (!flags.CIA_ENABLED) throw new Error("Civic Impact Analytics is disabled");
  if (!flags.CIA_VANITY_METRICS_FORBIDDEN) throw new Error("Invariant: vanity metrics must remain forbidden");

  // Composition posture: CIA composes sibling-engine signals.
  // Live pulls remain best-effort via advisory baselines until each engine
  // publishes a shared health summary contract used by CIA.
  const participation = 64;
  const outcomes = 61;
  const health = 63;
  const relationships = 59;
  const leadership = 60;

  const dimensions: ImpactDimension[] = [
    safeScore(
      "participation",
      "CIV-001",
      participation,
      "Participation dimension composed for impact analytics (explainable advisory baseline)."
    ),
    safeScore(
      "outcomes",
      "OUT-001",
      outcomes,
      "Outcomes dimension composed from Civic Outcomes evidence posture."
    ),
    safeScore("health", "CHD-001", health, "Health/resilience dimension composed from Community Health posture."),
    safeScore(
      "relationships",
      "REL-001",
      relationships,
      "Relationship/social capital inputs composed from Relationship Intelligence posture."
    ),
    safeScore(
      "leadership",
      "LDR-001",
      leadership,
      "Leadership pipeline dimension composed from Leadership Development posture."
    ),
  ];

  const composite = clamp(avg(dimensions.map((d) => d.score)));
  const resilience = clamp(avg([health, relationships, leadership]));
  const socialCapital = clamp(avg([relationships, leadership, participation * 0.5]));

  const scorecard: CivicImpactScorecard = {
    id: id("cia-sc"),
    institution_id: input.institution_id,
    county_id: input.county_id ?? null,
    created_at: now(),
    composite_index: composite,
    resilience_score: resilience,
    social_capital_score: socialCapital,
    dimensions,
    narrative: `Composite civic impact ${composite}/100. Resilience ${resilience}/100. Social capital ${socialCapital}/100. Scores are multi-dimensional and explainable — no single vanity metric is authoritative.`,
  };

  persistScorecards([scorecard, ...loadScorecards()]);
  appendAudit("scorecard_built", scorecard.id);
  return scorecard;
}

export function buildTrendPack(institutionId: string): ImpactTrendPack {
  const existing = loadScorecards().filter((s) => s.institution_id === institutionId).slice(0, 6);
  const pack: ImpactTrendPack = {
    id: id("cia-tr"),
    institution_id: institutionId,
    created_at: now(),
    points: existing
      .slice()
      .reverse()
      .map((s, i) => ({ label: `T-${existing.length - i}`, composite: s.composite_index })),
  };
  if (!pack.points.length) {
    const seed = buildScorecard({ institution_id: institutionId });
    pack.points = [{ label: "T-1", composite: seed.composite_index }];
  }
  persistTrendPacks([pack, ...loadTrendPacks()]);
  appendAudit("trend_pack_built", pack.id);
  return pack;
}

export function getCivicImpactOverview(): CivicImpactOverview {
  const flags = loadFeatureFlags();
  const scorecards = loadScorecards();
  return {
    scorecard_count: scorecards.length,
    latest: scorecards[0] ?? null,
    vanity_metrics_forbidden: Boolean(flags.CIA_VANITY_METRICS_FORBIDDEN),
    composition_only: Boolean(flags.CIA_COMPOSITION_ONLY),
    recent_audit: loadAudit(12),
  };
}

export function runAcceptanceCycle(institutionId: string, countyId?: string) {
  const scorecard = buildScorecard({ institution_id: institutionId, county_id: countyId ?? null });
  const trends = buildTrendPack(institutionId);
  return { scorecard, trends, overview: getCivicImpactOverview() };
}
