"use client";

import dab from "../../../data/registry/data-architecture-bible.json";
import ced from "../../../data/registry/canonical-entity-dictionary.json";
import mdd from "../../../data/registry/master-data-dictionary.json";
import dphil from "../../../data/registry/data-philosophy.json";
import rel from "../../../data/registry/relationship-data-model.json";
import sch from "../../../data/registry/database-schema-blueprint.json";
import kgs from "../../../data/registry/knowledge-graph-schema.json";
import evt from "../../../data/registry/event-data-model.json";
import tim from "../../../data/registry/time-calendar-data-model.json";

export function AdminDataArchitecture() {
  const doneSteps = dab.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-emerald-400 bg-emerald-100">
        <p className="text-xs font-semibold uppercase text-emerald-800">VOLUME 2 · Data Architecture Bible</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{dab.productName}</h2>
        <p className="mt-2 text-sm text-emerald-900">What is the data model that powers everything?</p>
        <p className="mt-2 text-xs font-semibold text-emerald-800">
          {doneSteps}/{dab.stepsTotal} steps · {dab.status.replace("_", " ")}
        </p>
      </div>

      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">VOLUME-002.1 · Data Philosophy</p>
        <h2 className="mt-1 text-lg font-bold text-teal-950">Canonical Model Principles</h2>
        <p className="mt-1 text-xs italic text-teal-900">&ldquo;{dphil.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs text-teal-700">
          {dphil.corePrinciples.length} core principles · SQL canonical · {dphil.derivedLayers.length} derived layers
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {dphil.corePrinciples.slice(0, 6).map((p) => (
            <span key={p} className="badge bg-teal-100 text-teal-800 capitalize">{p}</span>
          ))}
          <span className="badge bg-teal-200 text-teal-900">+{dphil.corePrinciples.length - 6}</span>
        </div>
        <p className="mt-2 text-xs text-teal-600">{dphil.acceptanceCriteria} · {dphil.status}</p>
      </div>

      <div className="card border-cyan-300 bg-cyan-50">
        <p className="text-xs font-semibold uppercase text-cyan-800">VOLUME-002.2 · Entity Dictionary</p>
        <h2 className="mt-1 text-lg font-bold text-cyan-950">Universal Entity Registry</h2>
        <p className="mt-1 text-xs italic text-cyan-900">&ldquo;{ced.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-cyan-800">
          {ced.entityCount} entities · {ced.domainCount} domains · {ced.derivedEntityCount} derived
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {ced.domains.slice(0, 7).map((d) => (
            <span key={d} className="badge bg-cyan-100 text-cyan-800">{d}</span>
          ))}
          <span className="badge bg-cyan-200 text-cyan-900">+{ced.domainCount - 7}</span>
        </div>
        <p className="mt-2 text-xs text-cyan-600">
          {ced.firstClassRelationshipEntities.length} first-class relationship entities · {ced.acceptanceCriteria}
        </p>
      </div>

      <div className="card border-violet-300 bg-violet-50">
        <p className="text-xs font-semibold uppercase text-violet-800">VOLUME-002.3 · Relationship Model</p>
        <h2 className="mt-1 text-lg font-bold text-violet-950">Relationship Ledger</h2>
        <p className="mt-1 text-xs italic text-violet-900">&ldquo;{rel.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-violet-800">
          {rel.categoryCount} categories · {rel.edgeTypeCount} edge types · {rel.signatureGraphs.length} signature graphs
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {rel.relationshipCategories.slice(0, 5).map((c) => (
            <span key={c.id} className="badge bg-violet-100 text-violet-800">{c.name}</span>
          ))}
          <span className="badge bg-violet-200 text-violet-900">+{rel.categoryCount - 5}</span>
        </div>
        <p className="mt-2 text-xs text-violet-600 font-mono">{rel.canonicalTable} · {rel.acceptanceCriteria}</p>
      </div>

      <div className="card border-sky-300 bg-sky-50">
        <p className="text-xs font-semibold uppercase text-sky-800">VOLUME-002.4 · Schema Blueprint</p>
        <h2 className="mt-1 text-lg font-bold text-sky-950">Canonical Schema Registry</h2>
        <p className="mt-1 text-xs italic text-sky-900">&ldquo;{sch.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-sky-800">
          {sch.schemaDomainCount} business domains · {sch.logicalTableCount} logical tables · technology-neutral
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {sch.schemaDomains.slice(0, 7).map((s) => (
            <span key={s} className="badge bg-sky-100 text-sky-800">{s}</span>
          ))}
          <span className="badge bg-sky-200 text-sky-900">+{sch.schemaDomainCount - 7}</span>
        </div>
        <p className="mt-2 text-xs text-sky-600">
          {sch.canonicalSchemaRegistry.catalogFields.length} registry catalog fields · {sch.acceptanceCriteria}
        </p>
      </div>

      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">VOLUME-002.5 · Knowledge Graph</p>
        <h2 className="mt-1 text-lg font-bold text-rose-950">Unified Graph Projection Engine</h2>
        <p className="mt-1 text-xs italic text-rose-900">&ldquo;{kgs.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-rose-800">
          {kgs.nodeCategoryCount} node classes · {kgs.signatureSubgraphCount} signature subgraphs · {kgs.signatureGraphs.length} signature graphs
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {kgs.nodeCategories.slice(0, 5).map((c) => (
            <span key={c.id} className="badge bg-rose-100 text-rose-800">{c.name.replace(" Nodes", "")}</span>
          ))}
          <span className="badge bg-rose-200 text-rose-900">+{kgs.nodeCategoryCount - 5}</span>
        </div>
        <p className="mt-2 text-xs text-rose-600">
          {kgs.unifiedGraphProjectionEngine.projections.length} projections · sync SLA {kgs.projectionPipeline.syncLagSlaSeconds}s · {kgs.acceptanceCriteria}
        </p>
      </div>

      <div className="card border-amber-300 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-800">VOLUME-002.6 · Event Model</p>
        <h2 className="mt-1 text-lg font-bold text-amber-950">Community Event Ledger</h2>
        <p className="mt-1 text-xs italic text-amber-900">&ldquo;{evt.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-amber-800">
          {evt.eventCategoryCount} event categories · {evt.eventStreamCount} streams · {evt.timelineCount} timelines
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {evt.eventCategories.slice(0, 6).map((c) => (
            <span key={c.id} className="badge bg-amber-100 text-amber-800">{c.name.replace(" Events", "")}</span>
          ))}
          <span className="badge bg-amber-200 text-amber-900">+{evt.eventCategoryCount - 6}</span>
        </div>
        <p className="mt-2 text-xs text-amber-600">
          {evt.replayCapabilities.length} replay targets · immutable · {evt.acceptanceCriteria}
        </p>
      </div>

      <div className="card border-lime-300 bg-lime-50">
        <p className="text-xs font-semibold uppercase text-lime-800">VOLUME-002.7 · Time & Calendar</p>
        <h2 className="mt-1 text-lg font-bold text-lime-950">Temporal Intelligence Engine</h2>
        <p className="mt-1 text-xs italic text-lime-900">&ldquo;{tim.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-lime-800">
          {tim.calendarTypeCount} calendar types · {tim.calendarHierarchyLevels} hierarchy levels · {tim.defaultTimezone}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {tim.calendarTypes.slice(0, 5).map((c) => (
            <span key={c.id} className="badge bg-lime-100 text-lime-800">{c.name.replace(" Calendar", "")}</span>
          ))}
          <span className="badge bg-lime-200 text-lime-900">+{tim.calendarTypeCount - 5}</span>
        </div>
        <p className="mt-2 text-xs text-lime-600">
          {tim.temporalIntelligenceEngine.evaluates.length} intelligence signals · {tim.acceptanceCriteria}
        </p>
      </div>

      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">VOLUME-002.14 · Master Data Dictionary</p>
        <h2 className="mt-1 text-lg font-bold text-indigo-950">Governance & Registry</h2>
        <p className="mt-2 text-xs text-indigo-800">
          {mdd.coreEnumCount} core enums · migration governance · stewardship rules
        </p>
        <p className="mt-1 text-xs text-indigo-700">Signature graphs: {dab.signatureGraphs.join(", ")}</p>
      </div>

      <div className="card border-slate-300 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-900">Volume 2 Step Sequence</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          {dab.steps.map((step) => (
            <li key={step.id} className="flex justify-between gap-2">
              <span>{step.id} {step.name}</span>
              <span className={step.status === "done" ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                {step.status === "done" ? "✓" : "pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
