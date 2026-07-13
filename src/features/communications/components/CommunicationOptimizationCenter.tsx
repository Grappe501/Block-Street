import type { CommunicationOptimization, CommunicationMaturityView } from "@/lib/civic-action/builds/11.7/optimization";
import type { CommunicationHealthDimension } from "@/lib/civic-action/builds/11.7/optimization";
import type { ExecutiveImprovementBrief } from "@/lib/civic-action/builds/11.7/optimization";
import { ExecutiveImprovementBriefPanel } from "./ExecutiveImprovementBriefPanel";
import { CommunicationMaturityDashboard } from "./CommunicationMaturityDashboard";
import { KnowledgeHealthDashboard } from "./KnowledgeHealthDashboard";

export type OptimizationCenterProps = {
  optimizations: CommunicationOptimization[];
  maturity: CommunicationMaturityView;
  health: CommunicationHealthDimension[];
  brief: ExecutiveImprovementBrief;
};

export function CommunicationOptimizationCenter({ optimizations, maturity, health, brief }: OptimizationCenterProps) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Communication Optimization</h1>
        <p className="mt-1 text-sm text-slate-600">Continuous improvement — advisory only, humans accept every change.</p>
      </header>

      <ExecutiveImprovementBriefPanel brief={brief} />
      <CommunicationMaturityDashboard maturity={maturity} />
      <KnowledgeHealthDashboard health={health} />

      <section aria-labelledby="opt-recs">
        <h2 id="opt-recs" className="text-lg font-bold text-slate-900">
          Recommended Optimizations
        </h2>
        <ul className="mt-3 space-y-2">
          {optimizations.length === 0 ? (
            <li className="card text-sm text-slate-600">No optimizations at current thresholds.</li>
          ) : (
            optimizations.map((o) => (
              <li key={o.optimization_id} className="card">
                <p className="font-medium text-slate-900">{o.title}</p>
                <p className="mt-1 text-sm text-slate-600">{o.why}</p>
                <p className="mt-1 text-xs text-teal-700">
                  {o.what_changed} · Confidence: {o.confidence}
                </p>
                <p className="mt-1 text-xs text-slate-500">Review: {o.who_should_review}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
