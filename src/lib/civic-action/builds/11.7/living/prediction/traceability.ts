/**
 * CAE-11.7-W8 — Prediction traceability
 */
import { LIX_PREDICTION_PRINCIPLE } from "./constitution";

export function explainPredictionAction(input: {
  human_id: string;
  action_type: string;
  forecast_id?: string;
  confidence?: number;
}) {
  return [
    `Prediction action: ${input.action_type}`,
    `Human: ${input.human_id}`,
    input.forecast_id ? `Forecast: ${input.forecast_id}` : null,
    input.confidence !== undefined ? `Confidence: ${input.confidence} (advisory)` : null,
    `Principle: ${LIX_PREDICTION_PRINCIPLE}`,
    "Authority: Decisions remain Human.",
  ]
    .filter(Boolean)
    .join(" · ");
}
