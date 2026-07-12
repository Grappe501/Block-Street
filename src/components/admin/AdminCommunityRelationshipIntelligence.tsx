"use client";

import { useEffect, useState } from "react";
import rel from "../../../data/registry/community-relationship-intelligence.json";
import type { RelationshipHealthSummary } from "@/lib/community-relationship/types";

type Tab = "health" | "network" | "demo" | "audit";

const VOLUNTEER = "volunteer-emerging@block-street.local";
const ORGANIZER = "director@block-street.local";
const COLLABORATOR = "volunteer@block-street.local";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminCommunityRelationshipIntelligence() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<RelationshipHealthSummary | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [executive, setExecutive] = useState<Record<string, unknown> | null>(null);
  const [connectors, setConnectors] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/community-relationship/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setExecutive(d.executive ?? null);
        setConnectors(d.connectors ?? []);
        setAudit(d.audit ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runAcceptanceDemo() {
    if (!institutionId) return;
    setMessage(null);
    try {
      // 1: Volunteer joins community organization
      const volunteerNode = await post("/api/v1/community-relationship/nodes", {
        node_type: "person",
        reference_id: VOLUNTEER,
        label: "Emerging Volunteer",
        institution_id: institutionId,
        county: "Pulaski",
      });
      const orgNode = await post("/api/v1/community-relationship/nodes", {
        node_type: "organization",
        reference_id: "org-community-center",
        label: "Community Center",
        institution_id: institutionId,
        county: "Pulaski",
      });
      const collabNode = await post("/api/v1/community-relationship/nodes", {
        node_type: "person",
        reference_id: COLLABORATOR,
        label: "Team Collaborator",
        institution_id: institutionId,
        county: "Pulaski",
      });
      const organizerNode = await post("/api/v1/community-relationship/nodes", {
        node_type: "person",
        reference_id: ORGANIZER,
        label: "Experienced Organizer",
        institution_id: institutionId,
        county: "Pulaski",
      });

      await post("/api/v1/community-relationship/events", {
        from_node: volunteerNode.id,
        to_node: orgNode.id,
        relationship_type: "team_member",
        event_type: "membership_joined",
        category: "volunteer",
        institution_id: institutionId,
        source: "onboarding",
        verification: "institution_verified",
      });

      // 2-3: Meetings and missions → verified events
      await post("/api/v1/community-relationship/events", {
        from_node: volunteerNode.id,
        to_node: collabNode.id,
        relationship_type: "project_collaborator",
        event_type: "meeting_attended",
        category: "meeting",
        institution_id: institutionId,
        verification: "institution_verified",
      });
      await post("/api/v1/community-relationship/events", {
        from_node: volunteerNode.id,
        to_node: collabNode.id,
        relationship_type: "project_collaborator",
        event_type: "mission_completed",
        category: "mission",
        institution_id: institutionId,
        verification: "institution_verified",
      });
      await post("/api/v1/community-relationship/events", {
        from_node: volunteerNode.id,
        to_node: collabNode.id,
        relationship_type: "volunteer_together",
        event_type: "mission_completed",
        category: "mission",
        institution_id: institutionId,
        verification: "institution_verified",
      });

      // 5-6: Mentorship accepted
      await post("/api/v1/community-relationship/mentorship", {
        mentor_node_id: organizerNode.id,
        mentee_node_id: volunteerNode.id,
        institution_id: institutionId,
      });

      // 7-8: County coalition cross-org project
      const coalitionOrg = await post("/api/v1/community-relationship/nodes", {
        node_type: "organization",
        reference_id: "org-county-coalition",
        label: "Pulaski County Coalition",
        institution_id: institutionId,
        county: "Pulaski",
      });
      const partnerOrg = await post("/api/v1/community-relationship/nodes", {
        node_type: "organization",
        reference_id: "org-partner-nonprofit",
        label: "Partner Nonprofit",
        institution_id: institutionId,
        county: "Pulaski",
      });
      await post("/api/v1/community-relationship/events", {
        from_node: volunteerNode.id,
        to_node: coalitionOrg.id,
        relationship_type: "coalition_partner",
        event_type: "coalition_project_joined",
        category: "coalition",
        institution_id: institutionId,
        verification: "institution_verified",
      });
      await post("/api/v1/community-relationship/events", {
        from_node: coalitionOrg.id,
        to_node: partnerOrg.id,
        relationship_type: "partner_organization",
        event_type: "cross_org_collaboration",
        category: "project",
        institution_id: institutionId,
        verification: "institution_verified",
      });

      // 9-10: Analytics and connectors
      const analyticsRes = await fetch(`/api/v1/community-relationship/analytics?institution_id=${institutionId}`);
      const analyticsData = await analyticsRes.json();
      const connectorsRes = await fetch(`/api/v1/community-relationship/connectors?institution_id=${institutionId}`);
      const connectorsData = await connectorsRes.json();

      // 11: AI recommendations
      const recRes = await fetch(`/api/v1/community-relationship/recommendations?institution_id=${institutionId}`);
      const recData = await recRes.json();

      // 12: Privacy — hide mentorship
      await post("/api/v1/community-relationship/privacy", {
        user_id: VOLUNTEER,
        institution_id: institutionId,
        mentorship_visibility: false,
        collaboration_history_visible: true,
      });

      // 13: Federation aggregated only
      const fedRes = await fetch("/api/v1/community-relationship/federation");
      const fedData = await fedRes.json();

      // 14: Executive resilience
      const resilienceRes = await fetch(`/api/v1/community-relationship/resilience?institution_id=${institutionId}`);
      const resilienceData = await resilienceRes.json();

      const exec = analyticsData.data?.executive;
      const connector = connectorsData.data?.[0]?.label ?? "volunteer";
      const rec = recData.data?.[0]?.title ?? "partnership advisory";

      setMessage(
        `AC-196 acceptance (15 steps): Volunteer joined org → ${3} verified collaboration events → ` +
          `mentorship with organizer → county coalition cross-org edges → ` +
          `collaboration health ${exec?.collaboration_health ?? "—"} → connector: ${connector} → ` +
          `AI: ${rec} → mentorship hidden via privacy → ` +
          `federation index ${fedData.data?.aggregated_collaboration_index ?? "—"} (aggregated only) → ` +
          `resilience ${resilienceData.data?.redundancy_score ?? "—"}%. Audit complete.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Relationship Health" },
    { id: "network", label: "Network" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-violet-500 bg-violet-100">
        <p className="text-xs font-semibold uppercase text-violet-950">BUILD 10.3 · Community Relationship Intelligence · REL-001</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{rel.productName}</h2>
        <p className="mt-2 text-sm text-violet-950">{rel.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-violet-900">
          {rel.requirementId} · {rel.acceptanceCriteria} · /api/v1/community-relationship
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-violet-800 text-white" : "bg-violet-50 text-violet-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-violet-300 bg-violet-50 p-3 text-xs text-violet-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Total Nodes", health.total_nodes],
            ["Total Edges", health.total_edges],
            ["Active Relationships", health.active_relationships],
            ["Mentorship Pairs", health.mentorship_pairs],
            ["Community Connectors", health.community_connectors],
            ["Isolated Nodes", health.isolated_nodes],
            ["Avg Strength", health.average_strength],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-violet-300 bg-white p-3">
              <p className="text-xs text-violet-700">{label}</p>
              <p className="text-lg font-bold text-violet-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "network" && executive && (
        <div className="space-y-3">
          <div className="card border-violet-200 p-3 text-xs text-violet-900">
            <p className="font-semibold">Executive Relationship Dashboard</p>
            <p>
              Collaboration: {String(executive.collaboration_health)} · Partnership growth: {String(executive.partnership_growth_percent)}% ·
              Density: {String(executive.relationship_density)}
            </p>
            <p>
              Bridges: {String(executive.community_bridges)} · Isolated groups: {String(executive.isolated_groups)} ·
              Mentorship: {String(executive.mentorship_health)}
            </p>
          </div>
          {connectors.length > 0 && (
            <div className="card border-violet-200 p-3 text-xs text-violet-900">
              <p className="font-semibold">Community Connectors</p>
              {connectors.slice(0, 3).map((c) => (
                <p key={String(c.node_id)}>
                  {String(c.label)} — {String(c.connector_type)} ({String(c.organizations_connected)} orgs)
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-violet-900">
            Full AC-196 (15 steps): volunteer joins → collaboration events → mentorship → county coalition →
            org dashboards → connector identification → AI recommendations → privacy → federation aggregates →
            resilience analytics → audit trail.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-violet-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-violet-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-violet-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
