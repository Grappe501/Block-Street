/**
 * CAE-11.1-W6 — Confidence scoring helpers
 */
import type { IntelligenceConfidence } from "./contracts";

export function scoreToConfidence(score: number): IntelligenceConfidence {
  if (score >= 0.9) return "very_high";
  if (score >= 0.75) return "high";
  if (score >= 0.55) return "medium";
  if (score >= 0.35) return "low";
  return "speculative";
}

export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2)
  );
}

export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function similarityLabel(score: number): string {
  const pct = Math.round(score * 100);
  return `${pct}% similar`;
}
