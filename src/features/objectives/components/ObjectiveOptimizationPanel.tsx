"use client";

import { useEffect, useState } from "react";
import type {
  OptimizationRecommendation,
  StructuredLesson,
  OrganizationHealthDimension,
  ObjectiveMaturityView,
  ExecutiveImprovementBrief,
} from "@/lib/civic-action/builds/11.2/optimization";
import { ObjectiveOptimizationCard } from "./ObjectiveOptimizationCard";

type OptimizationBundle = {
  lessons: StructuredLesson[];
  optimizations: OptimizationRecommendation[];
  patterns: { pattern_id: string; description: string; evidence: string }[];
  health: OrganizationHealthDimension[];
  maturity: ObjectiveMaturityView;
  executive_brief: ExecutiveImprovementBrief;
};

export function ObjectiveOptimizationPanel({
  initiativeId,
  objectiveId,
}: {
  initiativeId: string;
  objectiveId: string;
}) {
  const [data, setData] = useState<OptimizationBundle | null>(null);

  useEffect(() => {
    fetch(`/api/v1/objectives/${objectiveId}/optimization?initiative_id=${initiativeId}`)
      .then((r) => r.json())
      .then((json) => setData(json.data ?? json))
      .catch(() => setData(null));
  }, [initiativeId, objectiveId]);

  async function sendFeedback(id: string, action: "accepted" | "rejected" | "deferred") {
    await fetch("/api/v1/optimization/objectives/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optimization_id: id, action }),
    });
    if (action === "rejected") {
      setData((d) =>
        d ? { ...d, optimizations: d.optimizations.filter((o) => o.optimization_id !== id) } : d
      );
    }
  }

  if (!data) {
    return <p className="text-sm text-slate-500">Loading institutional learning…</p>;
  }

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">Organizational maturity</h2>
        <p className="mt-2 text-sm text-slate-600">
          {data.maturity.level} · Score {data.maturity.score} · {data.maturity.explanation}
        </p>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">Executive improvement brief</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {data.executive_brief.what_we_learned.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">Lessons library</h2>
        {data.lessons.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No lessons yet — complete Objectives with retrospectives.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.lessons.slice(0, 5).map((lesson) => (
              <li key={lesson.lesson_id} className="rounded border border-slate-100 p-3 text-sm">
                <p className="font-medium text-slate-900">{lesson.objective_name}</p>
                <p className="text-slate-600">{lesson.observation}</p>
                <p className="mt-1 text-xs text-slate-500">Root cause: {lesson.root_cause}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">Pattern explorer</h2>
        {data.patterns.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Patterns emerge as more Objectives complete.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {data.patterns.map((p) => (
              <li key={p.pattern_id}>
                {p.description} <span className="text-xs text-slate-400">({p.evidence})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-bold text-slate-900">Organization health</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.health.map((h) => (
            <li key={h.dimension} className="rounded border border-slate-100 p-2 text-sm">
              <span className="font-medium">{h.label}</span> — {h.state} ({h.score_band})
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Optimization recommendations</h2>
        {data.optimizations.length === 0 ? (
          <p className="text-sm text-slate-500">No urgent optimizations — execution learning is steady.</p>
        ) : (
          data.optimizations.map((o) => (
            <ObjectiveOptimizationCard key={o.optimization_id} optimization={o} onFeedback={sendFeedback} />
          ))
        )}
      </section>
    </div>
  );
}
