export type ImpactDimension = {
  id: "participation" | "outcomes" | "health" | "relationships" | "leadership";
  label: string;
  score: number;
  source_engine: string;
  explanation: string;
};

export type CivicImpactScorecard = {
  id: string;
  institution_id: string;
  county_id: string | null;
  created_at: string;
  composite_index: number;
  resilience_score: number;
  social_capital_score: number;
  dimensions: ImpactDimension[];
  narrative: string;
};

export type ImpactTrendPack = {
  id: string;
  institution_id: string;
  created_at: string;
  points: { label: string; composite: number }[];
};

export type CivicImpactOverview = {
  scorecard_count: number;
  latest: CivicImpactScorecard | null;
  vanity_metrics_forbidden: boolean;
  composition_only: boolean;
  recent_audit: { at: string; action: string; detail: string }[];
};
