"use client";

import { useEffect, useState } from "react";
import rlie from "../../../data/registry/relationship-intelligence-engine.json";
import type {
  Connector,
  GraphEdge,
  GraphNode,
  IntroductionSuggestion,
  RelationshipAlert,
  RelationshipDashboard,
  RelationshipProfile,
} from "@/lib/relationships/types";

export function AdminRelationshipIntelligenceEngine() {
  const [dashboard, setDashboard] = useState<RelationshipDashboard | null>(null);
  const [relationships, setRelationships] = useState<RelationshipProfile[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [alerts, setAlerts] = useState<RelationshipAlert[]>([]);
  const [introductions, setIntroductions] = useState<IntroductionSuggestion[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/relationships").then((r) => r.json()),
      fetch("/api/relationships/graph").then((r) => r.json()),
      fetch("/api/relationships/connectors").then((r) => r.json()),
      fetch("/api/relationships/health").then((r) => r.json()),
      fetch("/api/relationships/recommendations").then((r) => r.json()),
    ]).then(([relData, graphData, connData, healthData, recData]) => {
      setDashboard(relData.dashboard);
      setRelationships(relData.relationships || []);
      setNodes(graphData.nodes || []);
      setEdges(graphData.edges || []);
      setConnectors(connData.connectors || []);
      setAlerts(healthData.alerts || []);
      setIntroductions(recData.introductions || []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="card border-teal-400 bg-teal-100">
        <p className="text-xs font-semibold uppercase text-teal-900">BUILD 7.5 · Relationship Intelligence Engine</p>
        <h2 className="mt-1 text-xl font-bold text-teal-950">{rlie.productName}</h2>
        <p className="mt-2 text-sm text-teal-900">{rlie.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-teal-800">
          {rlie.requirementId} · {rlie.acceptanceCriteria} · Social nervous system
        </p>
      </div>

      {dashboard && (
        <div className="card border-teal-200 bg-teal-50/50">
          <h2 className="text-lg font-bold text-teal-950">Relationship Dashboard</h2>
          <p className="mt-2 text-3xl font-bold text-teal-700">{dashboard.relationshipHealthPercent}%</p>
          <p className="text-xs text-teal-800">Relationship Health</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs md:grid-cols-6">
            <div><span className="font-bold text-teal-950">{dashboard.strongRelationships}</span><p className="text-teal-700">Strong</p></div>
            <div><span className="font-bold text-teal-950">{dashboard.growing}</span><p className="text-teal-700">Growing</p></div>
            <div><span className="font-bold text-teal-950">{dashboard.dormant}</span><p className="text-teal-700">Dormant</p></div>
            <div><span className="font-bold text-teal-950">{dashboard.introductionsSuggested}</span><p className="text-teal-700">Introductions</p></div>
            <div><span className="font-bold text-teal-950">{dashboard.bridgeBuilders}</span><p className="text-teal-700">Bridge Builders</p></div>
            <div><span className="font-bold text-teal-950">{dashboard.highInfluenceLeaders}</span><p className="text-teal-700">High Influence</p></div>
          </div>
        </div>
      )}

      <div className="card border-teal-200 bg-white">
        <h2 className="text-sm font-bold text-teal-950">Relationship Graph ({nodes.length} nodes · {edges.length} edges)</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {relationships.map((r) => (
            <div key={r.id} className="rounded-lg border border-teal-100 p-2 text-xs text-teal-900">
              <p className="font-bold text-teal-950">{r.participants.join(" ↔ ") || r.organizations.join(" ↔ ")}</p>
              <p>Strength {r.strengthPercent}% · Trust {r.trustPercent}% · Influence {r.influencePercent}%</p>
              <p>Health: <strong>{r.health}</strong> · {r.county} · {r.type}</p>
              <p className="text-teal-600">Last interaction: {r.daysSinceInteraction === 0 ? "today" : `${r.daysSinceInteraction} days ago`}</p>
              {r.connectorRole && <p className="text-teal-700">Connector: {r.connectorRole}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="card border-teal-200 bg-teal-50/50">
        <h2 className="text-sm font-bold text-teal-950">Community Connectors</h2>
        <ul className="mt-2 space-y-1 text-xs text-teal-900">
          {connectors.map((c) => (
            <li key={c.id} className="rounded bg-white px-2 py-1">
              <span className="font-bold">{c.label}</span> — {c.connectorRole} · {c.influencePercent}% influence · {c.county}
              {c.connectedCommunities.length > 0 && (
                <span className="text-teal-600"> · {c.connectedCommunities.join(", ")}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-teal-200 bg-white">
        <h2 className="text-sm font-bold text-teal-950">Alerts → RIE / Mission Board</h2>
        <ul className="mt-2 space-y-1 text-xs text-teal-900">
          {alerts.map((a) => (
            <li key={a.id} className={`rounded px-2 py-1 ${a.severity === "warning" ? "bg-amber-100" : "bg-slate-100"}`}>
              <span className="font-bold">{a.title}</span> — {a.message}
              {a.feedsRecommendation && <span className="ml-1 text-teal-600">→ RIE</span>}
              {a.feedsMissionBoard && <span className="ml-1 text-teal-600">→ Mission Board</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-teal-200 bg-teal-50/50">
        <h2 className="text-sm font-bold text-teal-950">Introduction Intelligence</h2>
        <div className="mt-2 space-y-2">
          {introductions.map((i) => (
            <div key={i.id} className="rounded border border-teal-100 bg-white p-2 text-xs">
              <p className="font-bold text-teal-950">{i.fromLabel} → {i.toLabel}</p>
              <p className="text-teal-800">{i.reason}</p>
              <p className="text-teal-600">Confidence {i.confidencePercent}% · {i.mutualConnections} mutual connections</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
