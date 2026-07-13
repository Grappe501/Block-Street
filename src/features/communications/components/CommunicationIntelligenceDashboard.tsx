import type { CommunicationRecommendation, CommunicationPortfolioIntelligence } from "@/lib/civic-action/builds/11.7/intelligence";
import type { CommunicationHealthSnapshot } from "@/lib/civic-action/builds/11.7/intelligence";
import { ExecutiveCommunicationBrief } from "./ExecutiveCommunicationBrief";
import { KnowledgeRecommendationsPanel } from "./KnowledgeRecommendationsPanel";
import { ConversationHealthPanel } from "./ConversationHealthPanel";

export type IntelligenceDashboardProps = {
  recommendations: CommunicationRecommendation[];
  portfolio: CommunicationPortfolioIntelligence;
  health: CommunicationHealthSnapshot;
  brief: import("@/lib/civic-action/builds/11.7/intelligence").ExecutiveCommunicationBrief;
};

export function CommunicationIntelligenceDashboard({ recommendations, portfolio, health, brief }: IntelligenceDashboardProps) {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Communication Intelligence</h1>
        <p className="mt-1 text-sm text-slate-600">Advisory insights only — no automatic mutations.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card">
          <p className="text-xs font-semibold uppercase text-teal-700">Conversations</p>
          <p className="text-2xl font-bold">{portfolio.total_conversations}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase text-teal-700">Active</p>
          <p className="text-2xl font-bold">{portfolio.active_conversations}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase text-teal-700">Unresolved Threads</p>
          <p className="text-2xl font-bold">{portfolio.unresolved_threads}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase text-teal-700">Health</p>
          <p className="text-2xl font-bold capitalize">{health.overall_health_band}</p>
        </div>
      </div>

      <ExecutiveCommunicationBrief brief={brief} />

      <section aria-labelledby="intel-recs">
        <h2 id="intel-recs" className="text-lg font-bold text-slate-900">
          Recommendations
        </h2>
        <ul className="mt-3 space-y-2">
          {recommendations.length === 0 ? (
            <li className="card text-sm text-slate-600">No recommendations at current thresholds.</li>
          ) : (
            recommendations.map((r) => (
              <li key={r.recommendation_id} className="card">
                <p className="font-medium text-slate-900">{r.title}</p>
                <p className="mt-1 text-sm text-slate-600">{r.why}</p>
                <p className="mt-1 text-xs text-teal-700">Confidence: {r.confidence}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <ConversationHealthPanel health={health} />
      <KnowledgeRecommendationsPanel />
    </div>
  );
}
