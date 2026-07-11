"use client";

import ios from "../../../data/intelligence/intelligence-operating-system.json";
import sis from "../../../data/registry/statewide-intelligence-search.json";
import rie from "../../../data/registry/recommendation-intelligence-engine.json";
import caip from "../../../data/registry/campaign-analytics-intelligence-platform.json";
import lmb from "../../../data/registry/live-mission-board.json";
import rlie from "../../../data/registry/relationship-intelligence-engine.json";
import ias from "../../../data/registry/future-ai-assistance.json";
import { AdminStatewideIntelligenceSearch } from "@/components/admin/AdminStatewideIntelligenceSearch";
import { AdminRecommendationIntelligenceEngine } from "@/components/admin/AdminRecommendationIntelligenceEngine";
import { AdminCampaignAnalyticsIntelligence } from "@/components/admin/AdminCampaignAnalyticsIntelligence";
import { AdminLiveMissionBoard } from "@/components/admin/AdminLiveMissionBoard";
import { AdminRelationshipIntelligenceEngine } from "@/components/admin/AdminRelationshipIntelligenceEngine";

const STEPS = [
  { step: sis, label: "7.1 Statewide Intelligence Search", accent: "border-sky-300 bg-sky-50" },
  { step: rie, label: "7.2 Recommendation Intelligence Engine", accent: "border-violet-300 bg-violet-50" },
  { step: caip, label: "7.3 Campaign Analytics Platform", accent: "border-amber-300 bg-amber-50" },
  { step: lmb, label: "7.4 Live Mission Board", accent: "border-rose-300 bg-rose-50" },
  { step: rlie, label: "7.5 Relationship Intelligence", accent: "border-teal-300 bg-teal-50", featured: true },
  { step: ias, label: "7.6 Future AI Assistance", accent: "border-indigo-300 bg-indigo-50" },
];

export function AdminIntelligenceLayer() {
  return (
    <div className="space-y-6">
      <div className="card border-purple-400 bg-purple-100">
        <p className="text-xs font-semibold uppercase text-purple-900">PHASE-007 COMPLETE · Intelligence Layer</p>
        <h2 className="mt-1 text-xl font-bold text-purple-950">{ios.productName}</h2>
        <p className="mt-2 text-sm text-purple-900">{ios.mission}</p>
        <p className="mt-2 text-xs font-semibold text-purple-800">
          {ios.requirementId} · {ios.stepsComplete}/{ios.stepsTotal} steps · {ios.acceptanceCriteria}
        </p>
      </div>

      <div className="card border-purple-200 bg-purple-50/50">
        <h2 className="text-sm font-bold text-purple-950">Guiding Principle</h2>
        <p className="mt-1 text-sm italic text-purple-900">{ios.guidingPrinciple}</p>
        <p className="mt-2 text-xs text-purple-800">
          {ios.intelligencePrinciples.join(" · ")}
        </p>
      </div>

      <div className="card border-purple-200 bg-white">
        <h2 className="text-sm font-bold text-purple-950">Intelligence Architecture</h2>
        <p className="mt-2 text-xs text-purple-900">{ios.intelligenceArchitecture.layers.join(" → ")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {STEPS.map(({ step, label, accent, featured }) => (
          <div
            key={step.requirementId}
            className={`card border-l-4 ${accent} ${featured ? "ring-2 ring-purple-300" : ""}`}
          >
            <p className="text-xs font-semibold text-purple-800">{label}</p>
            <h3 className="mt-1 font-bold text-purple-950">{step.productName}</h3>
            <p className="mt-1 text-xs text-purple-900">{step.guidingPrinciple}</p>
            <p className="mt-2 font-mono text-xs text-purple-700">
              {step.requirementId} · {step.acceptanceCriteria}
            </p>
          </div>
        ))}
      </div>

      <div className="card border-purple-200 bg-purple-50/50">
        <h2 className="text-sm font-bold text-purple-950">Governed By</h2>
        <p className="mt-1 text-xs text-purple-900">{ios.governedBy.join(" · ")}</p>
        <p className="mt-2 font-mono text-xs text-purple-700">{ios.docPath}</p>
      </div>

      <AdminStatewideIntelligenceSearch />
      <AdminRecommendationIntelligenceEngine />
      <AdminCampaignAnalyticsIntelligence />
      <AdminLiveMissionBoard />
      <AdminRelationshipIntelligenceEngine />
    </div>
  );
}
