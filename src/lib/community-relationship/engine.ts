import {
  loadEdges,
  loadEvents,
  loadFeatureFlags,
  loadHealthSummary,
  loadNodes,
  loadPrivacySettings,
  loadStrengthWeights,
  persistEdges,
  persistEvents,
  persistHealthSummary,
  persistNodes,
  persistPrivacySettings,
  persistRecommendations,
} from "./data";
import { listRelationshipAudit, recordRelationshipAudit } from "./audit";
import type {
  CommunityConnector,
  ExecutiveRelationshipDashboard,
  FederationRelationshipAnalytics,
  IsolationAlert,
  NetworkResilienceMetrics,
  RelationshipEdge,
  RelationshipEvent,
  RelationshipHealthSummary,
  RelationshipInsight,
  RelationshipLifecycleStage,
  RelationshipNode,
  RelationshipPrivacySettings,
  RelationshipRecommendation,
  RelationshipStatus,
  StrengthFactors,
  UserRelationshipDashboard,
  VerificationLevel,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.COMMUNITY_RELATIONSHIP_ENABLED) {
    throw new Error("Community Relationship Intelligence Engine is not enabled.");
  }
  return flags;
}

function computeStrength(factors: StrengthFactors): number {
  const { weights } = loadStrengthWeights();
  const score =
    factors.frequency * weights.frequency +
    factors.duration_months * weights.duration_months +
    factors.collaboration_count * weights.collaboration_count +
    factors.shared_projects * weights.shared_projects +
    factors.mentoring_sessions * weights.mentoring_sessions +
    factors.participation_score * weights.participation_score;
  return Math.min(100, Math.round(score));
}

function statusFromStrength(strength: number): RelationshipStatus {
  const { status_thresholds: t } = loadStrengthWeights();
  if (strength >= t.strong) return "strong";
  if (strength >= t.active) return "active";
  if (strength >= t.growing) return "growing";
  if (strength >= t.new) return "new";
  if (strength >= t.dormant) return "dormant";
  if (strength > 0) return "inactive";
  return "historical";
}

function lifecycleFromStrength(strength: number, hasMentorship: boolean): RelationshipLifecycleStage {
  if (hasMentorship && strength >= 60) return "mentorship";
  if (strength >= 80) return "leadership_partnership";
  if (strength >= 60) return "trusted_working_relationship";
  if (strength >= 40) return "regular_interaction";
  if (strength >= 20) return "first_collaboration";
  return "introduced";
}

function refreshHealthSummary(): RelationshipHealthSummary {
  const nodes = loadNodes();
  const edges = loadEdges();
  const active = edges.filter((e) => e.status === "active" || e.status === "strong" || e.status === "growing");
  const mentorship = edges.filter((e) => e.relationship_type === "mentor" || e.relationship_type === "mentee");
  const connected = new Set<string>();
  for (const e of edges) {
    connected.add(e.from_node);
    connected.add(e.to_node);
  }
  const isolated = nodes.filter((n) => !connected.has(n.id)).length;
  const connectors = identifyConnectors().length;

  const summary: RelationshipHealthSummary = {
    total_nodes: nodes.length,
    total_edges: edges.length,
    active_relationships: active.length,
    mentorship_pairs: mentorship.length,
    community_connectors: connectors,
    isolated_nodes: isolated,
    average_strength: edges.length
      ? Math.round(edges.reduce((s, e) => s + e.strength, 0) / edges.length)
      : 0,
    updated_at: now(),
  };
  persistHealthSummary(summary);
  return summary;
}

export function getRelationshipHealthSummary() {
  return loadHealthSummary();
}

export function listNodes(filters?: { institution_id?: string; node_type?: string; county?: string }) {
  let nodes = loadNodes();
  if (filters?.institution_id) nodes = nodes.filter((n) => n.institution_id === filters.institution_id);
  if (filters?.node_type) nodes = nodes.filter((n) => n.node_type === filters.node_type);
  if (filters?.county) nodes = nodes.filter((n) => n.county === filters.county);
  return nodes;
}

export function getNode(nodeId: string) {
  return loadNodes().find((n) => n.id === nodeId) ?? null;
}

export function createNode(input: {
  node_type: RelationshipNode["node_type"];
  reference_id: string;
  label: string;
  institution_id: string;
  county?: string;
  actor_id: string;
}): RelationshipNode {
  assertEnabled();
  const node: RelationshipNode = {
    id: id("rnode"),
    node_type: input.node_type,
    reference_id: input.reference_id,
    label: input.label,
    institution_id: input.institution_id,
    county: input.county,
    status: "active",
    created_at: now(),
  };
  const nodes = loadNodes();
  nodes.push(node);
  persistNodes(nodes);
  recordRelationshipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "node_created",
    target_type: "node",
    target_id: node.id,
    result: "success",
  });
  refreshHealthSummary();
  return node;
}

export function getOrCreateNode(input: {
  node_type: RelationshipNode["node_type"];
  reference_id: string;
  label: string;
  institution_id: string;
  county?: string;
  actor_id: string;
}): RelationshipNode {
  const existing = loadNodes().find(
    (n) => n.reference_id === input.reference_id && n.institution_id === input.institution_id
  );
  if (existing) return existing;
  return createNode(input);
}

export function listEdges(filters?: {
  institution_id?: string;
  relationship_type?: string;
  from_node?: string;
  to_node?: string;
}) {
  let edges = loadEdges();
  if (filters?.institution_id) edges = edges.filter((e) => e.institution_id === filters.institution_id);
  if (filters?.relationship_type)
    edges = edges.filter((e) => e.relationship_type === filters.relationship_type);
  if (filters?.from_node) edges = edges.filter((e) => e.from_node === filters.from_node);
  if (filters?.to_node) edges = edges.filter((e) => e.to_node === filters.to_node);
  return edges;
}

export function getEdge(edgeId: string) {
  return loadEdges().find((e) => e.id === edgeId) ?? null;
}

function findOrCreateEdge(input: {
  from_node: string;
  to_node: string;
  relationship_type: RelationshipEdge["relationship_type"];
  institution_id: string;
  verification_level?: VerificationLevel;
  privacy_level?: RelationshipEdge["privacy_level"];
  actor_id: string;
}): RelationshipEdge {
  const edges = loadEdges();
  let edge = edges.find(
    (e) =>
      e.from_node === input.from_node &&
      e.to_node === input.to_node &&
      e.relationship_type === input.relationship_type
  );
  if (edge) return edge;

  const factors: StrengthFactors = {
    frequency: 0,
    duration_months: 0,
    collaboration_count: 0,
    shared_projects: 0,
    mentoring_sessions: 0,
    participation_score: 0,
  };
  edge = {
    id: id("redge"),
    from_node: input.from_node,
    to_node: input.to_node,
    relationship_type: input.relationship_type,
    strength: 0,
    strength_factors: factors,
    status: "new",
    lifecycle_stage: "introduced",
    first_interaction: now(),
    last_interaction: now(),
    verification_level: input.verification_level ?? "self_declared",
    privacy_level: input.privacy_level ?? "institution",
    institution_id: input.institution_id,
    created_at: now(),
  };
  edges.push(edge);
  persistEdges(edges);
  recordRelationshipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "edge_created",
    target_type: "edge",
    target_id: edge.id,
    result: "success",
  });
  return edge;
}

function updateEdgeStrength(edgeId: string) {
  const edges = loadEdges();
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return null;

  const events = loadEvents().filter((ev) => ev.relationship_edge_id === edgeId);
  const months =
    events.length > 0
      ? Math.max(
          1,
          Math.round(
            (Date.now() - new Date(edge.first_interaction).getTime()) / (1000 * 60 * 60 * 24 * 30)
          )
        )
      : 0;

  edge.strength_factors = {
    frequency: Math.min(100, events.length * 8),
    duration_months: Math.min(100, months * 5),
    collaboration_count: Math.min(100, events.filter((e) => e.category === "project" || e.category === "mission").length * 15),
    shared_projects: Math.min(100, events.filter((e) => e.category === "project").length * 20),
    mentoring_sessions: Math.min(100, events.filter((e) => e.category === "mentorship").length * 25),
    participation_score: Math.min(100, events.filter((e) => e.category === "volunteer" || e.category === "meeting").length * 10),
  };
  edge.strength = computeStrength(edge.strength_factors);
  edge.status = statusFromStrength(edge.strength);
  edge.lifecycle_stage = lifecycleFromStrength(
    edge.strength,
    edge.relationship_type === "mentor" || edge.relationship_type === "mentee"
  );
  edge.last_interaction = events.length ? events[events.length - 1].date : edge.last_interaction;
  persistEdges(edges);
  return edge;
}

export function recordRelationshipEvent(input: {
  from_node: string;
  to_node: string;
  relationship_type: RelationshipEdge["relationship_type"];
  event_type: string;
  category: RelationshipEvent["category"];
  institution_id: string;
  source: string;
  verification?: VerificationLevel;
  duration_minutes?: number;
  notes?: string;
  actor_id: string;
}): { event: RelationshipEvent; edge: RelationshipEdge } {
  assertEnabled();
  const edge = findOrCreateEdge({
    from_node: input.from_node,
    to_node: input.to_node,
    relationship_type: input.relationship_type,
    institution_id: input.institution_id,
    verification_level: input.verification,
    actor_id: input.actor_id,
  });

  const event: RelationshipEvent = {
    id: id("revt"),
    relationship_edge_id: edge.id,
    event_type: input.event_type,
    category: input.category,
    date: now(),
    source: input.source,
    verification: input.verification ?? "institution_verified",
    duration_minutes: input.duration_minutes,
    notes: input.notes,
    institution_id: input.institution_id,
    created_at: now(),
  };
  const events = loadEvents();
  events.push(event);
  persistEvents(events);

  const updated = updateEdgeStrength(edge.id)!;
  recordRelationshipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "event_recorded",
    target_type: "event",
    target_id: event.id,
    result: "success",
    metadata: { edge_id: edge.id, event_type: input.event_type },
  });
  refreshHealthSummary();
  return { event, edge: updated };
}

export function listEvents(filters?: { institution_id?: string; edge_id?: string; limit?: number }) {
  let events = loadEvents();
  if (filters?.institution_id) events = events.filter((e) => e.institution_id === filters.institution_id);
  if (filters?.edge_id) events = events.filter((e) => e.relationship_edge_id === filters.edge_id);
  events = events.sort((a, b) => b.date.localeCompare(a.date));
  if (filters?.limit) events = events.slice(0, filters.limit);
  return events;
}

export function getGraph(filters?: { institution_id?: string; county?: string }) {
  const nodes = listNodes({ institution_id: filters?.institution_id, county: filters?.county });
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = listEdges({ institution_id: filters?.institution_id }).filter(
    (e) => nodeIds.has(e.from_node) && nodeIds.has(e.to_node)
  );
  return { nodes, edges };
}

export function getMentorshipGraph(institutionId?: string) {
  const edges = listEdges({ institution_id: institutionId }).filter(
    (e) => e.relationship_type === "mentor" || e.relationship_type === "mentee"
  );
  const nodeIds = new Set<string>();
  for (const e of edges) {
    nodeIds.add(e.from_node);
    nodeIds.add(e.to_node);
  }
  const nodes = loadNodes().filter((n) => nodeIds.has(n.id));
  const mentorLoad: Record<string, number> = {};
  for (const e of edges.filter((e) => e.relationship_type === "mentor")) {
    mentorLoad[e.from_node] = (mentorLoad[e.from_node] || 0) + 1;
  }
  return { nodes, edges, mentor_load: mentorLoad };
}

export function identifyConnectors(institutionId?: string): CommunityConnector[] {
  const edges = listEdges({ institution_id: institutionId });
  const nodes = loadNodes();
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const orgConnections: Record<string, Set<string>> = {};
  const communityBridges: Record<string, Set<string>> = {};

  for (const e of edges) {
    const from = nodeMap.get(e.from_node);
    const to = nodeMap.get(e.to_node);
    if (!from || !to) continue;
    if (from.node_type === "person") {
      for (const partner of [to]) {
        if (partner.node_type === "organization" || partner.node_type === "community") {
          orgConnections[from.id] = orgConnections[from.id] ?? new Set();
          orgConnections[from.id].add(partner.id);
          communityBridges[from.id] = communityBridges[from.id] ?? new Set();
          if (partner.county) communityBridges[from.id].add(partner.county);
          if (from.county && partner.county && from.county !== partner.county) {
            communityBridges[from.id].add(`${from.county}-${partner.county}`);
          }
        }
      }
    }
  }

  return Object.entries(orgConnections)
    .filter(([, orgs]) => orgs.size >= 2)
    .map(([nodeId, orgs]) => {
      const node = nodeMap.get(nodeId)!;
      const relatedEdges = edges.filter((e) => e.from_node === nodeId || e.to_node === nodeId);
      const hasMentor = relatedEdges.some((e) => e.relationship_type === "mentor");
      const hasCoalition = relatedEdges.some((e) => e.relationship_type === "coalition_partner");
      return {
        node_id: nodeId,
        label: node.label,
        connector_type: hasCoalition
          ? ("coalition_builder" as const)
          : hasMentor
            ? ("mentor" as const)
            : orgs.size >= 3
              ? ("multi_org_volunteer" as const)
              : ("organizer" as const),
        organizations_connected: orgs.size,
        communities_bridged: [...(communityBridges[nodeId] ?? [])],
        collaboration_score: Math.min(100, relatedEdges.reduce((s, e) => s + e.strength, 0) / Math.max(1, relatedEdges.length)),
      };
    })
    .sort((a, b) => b.organizations_connected - a.organizations_connected);
}

export function detectIsolation(institutionId?: string): IsolationAlert[] {
  const { nodes, edges } = getGraph({ institution_id: institutionId });
  const alerts: IsolationAlert[] = [];
  const edgeCounts: Record<string, number> = {};
  for (const e of edges) {
    edgeCounts[e.from_node] = (edgeCounts[e.from_node] || 0) + 1;
    edgeCounts[e.to_node] = (edgeCounts[e.to_node] || 0) + 1;
  }

  for (const node of nodes) {
    const count = edgeCounts[node.id] || 0;
    if (node.node_type === "person" && count === 0) {
      alerts.push({
        id: id("iso"),
        severity: "warning",
        target_type: "person",
        target_id: node.id,
        label: node.label,
        reason: "New volunteer without established collaborations",
        suggested_action: "Assign mentor or invite to team project",
      });
    }
    if (node.node_type === "organization" && count <= 1) {
      alerts.push({
        id: id("iso"),
        severity: "critical",
        target_type: "organization",
        target_id: node.id,
        label: node.label,
        reason: "Organization disconnected from partnership network",
        suggested_action: "Explore coalition or cross-organization project",
      });
    }
    if (node.node_type === "team" && count <= 1) {
      alerts.push({
        id: id("iso"),
        severity: "warning",
        target_type: "team",
        target_id: node.id,
        label: node.label,
        reason: "Team with limited cross-team interaction",
        suggested_action: "Connect with adjacent teams or county coalition",
      });
    }
  }
  return alerts;
}

export function computeNetworkResilience(institutionId?: string): NetworkResilienceMetrics {
  const edges = listEdges({ institution_id: institutionId });
  const connectors = identifyConnectors(institutionId);
  const nodes = listNodes({ institution_id: institutionId });
  const personNodes = nodes.filter((n) => n.node_type === "person");

  const edgeCounts: Record<string, number> = {};
  for (const e of edges) {
    edgeCounts[e.from_node] = (edgeCounts[e.from_node] || 0) + 1;
    edgeCounts[e.to_node] = (edgeCounts[e.to_node] || 0) + 1;
  }
  const singlePoints = personNodes
    .filter((n) => (edgeCounts[n.id] || 0) >= 5 && connectors.some((c) => c.node_id === n.id))
    .map((n) => n.label);

  const activeEdges = edges.filter((e) => e.status === "active" || e.status === "strong");
  const continuity = edges.length ? Math.round((activeEdges.length / edges.length) * 100) : 100;
  const redundancy = personNodes.length
    ? Math.min(100, Math.round((connectors.length / personNodes.length) * 100) + continuity / 2)
    : 50;
  const concentration = connectors.length
    ? Math.min(100, Math.round((connectors[0]?.organizations_connected ?? 0) * 15))
    : 0;

  return {
    redundancy_score: redundancy,
    connector_concentration_percent: concentration,
    single_point_dependencies: singlePoints,
    leadership_overlap_count: connectors.filter((c) => c.connector_type === "mentor" || c.connector_type === "organizer").length,
    collaboration_continuity_percent: continuity,
    trend: continuity >= 70 ? "improving" : continuity >= 40 ? "stable" : "declining",
  };
}

export function getCollaborationAnalytics(institutionId?: string) {
  const edges = listEdges({ institution_id: institutionId });
  const events = listEvents({ institution_id: institutionId });
  const crossOrg = edges.filter((e) => e.relationship_type === "partner_organization" || e.relationship_type === "coalition_partner");
  return {
    shared_missions: events.filter((e) => e.category === "mission").length,
    cross_team_work: events.filter((e) => e.category === "project").length,
    cross_organization_projects: crossOrg.length,
    volunteer_collaboration: events.filter((e) => e.category === "volunteer").length,
    mentor_activity: events.filter((e) => e.category === "mentorship").length,
    committee_participation: events.filter((e) => e.category === "committee").length,
    relationship_diversity: {
      cross_community: edges.filter((e) => e.relationship_type === "community_contact").length,
      cross_county: listNodes({ institution_id: institutionId }).filter((n) => n.county).length,
      mentor_diversity: edges.filter((e) => e.relationship_type === "mentor").length,
    },
  };
}

export function generateRecommendations(institutionId: string): RelationshipRecommendation[] {
  assertEnabled();
  const isolation = detectIsolation(institutionId);
  const connectors = identifyConnectors(institutionId);
  const edges = listEdges({ institution_id: institutionId });
  const recs: RelationshipRecommendation[] = [];

  for (const alert of isolation.filter((a) => a.target_type === "person").slice(0, 2)) {
    const mentor = connectors.find((c) => c.connector_type === "mentor");
    if (mentor) {
      recs.push({
        id: id("rrec"),
        recommendation_type: "mentorship",
        title: `Potential mentor for ${alert.label}`,
        reason: "New volunteer without mentor; experienced connector available",
        evidence: [alert.reason, `${mentor.label} mentors across ${mentor.organizations_connected} organizations`],
        confidence_percent: 78,
        advisory_only: true,
        target_node_ids: [alert.target_id, mentor.node_id],
        generated_at: now(),
      });
    }
  }

  const orgIsolated = isolation.filter((a) => a.target_type === "organization");
  if (orgIsolated.length >= 2) {
    recs.push({
      id: id("rrec"),
      recommendation_type: "partnership",
      title: `Partnership opportunity: ${orgIsolated[0].label} × ${orgIsolated[1].label}`,
      reason: "Both organizations show limited partnership connections",
      evidence: [orgIsolated[0].reason, orgIsolated[1].reason],
      confidence_percent: 65,
      advisory_only: true,
      target_node_ids: [orgIsolated[0].target_id, orgIsolated[1].target_id],
      generated_at: now(),
    });
  }

  const weakCollab = edges.filter((e) => e.strength < 30 && e.strength > 0);
  if (weakCollab.length) {
    recs.push({
      id: id("rrec"),
      recommendation_type: "collaboration",
      title: "Strengthen emerging collaboration",
      reason: "Existing relationship with low interaction history",
      evidence: [`${weakCollab.length} relationships in growing stage`],
      confidence_percent: 55,
      advisory_only: true,
      target_node_ids: [weakCollab[0].from_node, weakCollab[0].to_node],
      generated_at: now(),
    });
  }

  persistRecommendations(recs);
  return recs;
}

export function getPrivacySettings(userId: string, institutionId: string): RelationshipPrivacySettings {
  const settings = loadPrivacySettings();
  let s = settings.find((p) => p.user_id === userId && p.institution_id === institutionId);
  if (!s) {
    s = {
      user_id: userId,
      institution_id: institutionId,
      public_connections: true,
      mentorship_visibility: true,
      collaboration_history_visible: true,
      partnership_visibility: true,
      updated_at: now(),
    };
    settings.push(s);
    persistPrivacySettings(settings);
  }
  return s;
}

export function updatePrivacySettings(
  input: Partial<RelationshipPrivacySettings> & { user_id: string; institution_id: string; actor_id: string }
) {
  assertEnabled();
  const settings = loadPrivacySettings();
  const idx = settings.findIndex((p) => p.user_id === input.user_id && p.institution_id === input.institution_id);
  const updated: RelationshipPrivacySettings = {
    ...(idx >= 0 ? settings[idx] : getPrivacySettings(input.user_id, input.institution_id)),
    ...input,
    updated_at: now(),
  };
  if (idx >= 0) settings[idx] = updated;
  else settings.push(updated);
  persistPrivacySettings(settings);
  recordRelationshipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "privacy_updated",
    target_type: "privacy",
    target_id: input.user_id,
    result: "success",
    metadata: { mentorship_visibility: updated.mentorship_visibility },
  });
  return updated;
}

export function applyPrivacyToGraph(
  graph: { nodes: RelationshipNode[]; edges: RelationshipEdge[] },
  userId?: string,
  institutionId?: string
) {
  if (!userId || !institutionId) return graph;
  const privacy = getPrivacySettings(userId, institutionId);
  let edges = graph.edges;
  if (!privacy.mentorship_visibility) {
    edges = edges.filter((e) => e.relationship_type !== "mentor" && e.relationship_type !== "mentee");
  }
  if (!privacy.collaboration_history_visible) {
    edges = edges.map((e) => ({ ...e, strength_factors: { ...e.strength_factors, frequency: 0 } }));
  }
  return { nodes: graph.nodes, edges };
}

export function getUserDashboard(userId: string, institutionId: string): UserRelationshipDashboard {
  const nodes = loadNodes();
  const personNode = nodes.find((n) => n.reference_id === userId && n.institution_id === institutionId);
  if (!personNode) {
    return {
      user_id: userId,
      active_collaborators: 0,
      mentors: 0,
      mentees: 0,
      organizations_connected: 0,
      community_projects: 0,
      relationship_trend: "stable",
    };
  }
  const edges = listEdges({ institution_id: institutionId }).filter(
    (e) => e.from_node === personNode.id || e.to_node === personNode.id
  );
  const events = listEvents({ institution_id: institutionId });
  const collaborators = new Set<string>();
  for (const e of edges.filter((e) => e.relationship_type === "project_collaborator" || e.relationship_type === "team_member")) {
    collaborators.add(e.from_node === personNode.id ? e.to_node : e.from_node);
  }
  const orgs = new Set(
    edges
      .map((e) => (e.from_node === personNode.id ? e.to_node : e.from_node))
      .filter((nid) => nodes.find((n) => n.id === nid)?.node_type === "organization")
  );
  const growing = edges.filter((e) => e.status === "growing" || e.status === "active").length;
  const declining = edges.filter((e) => e.status === "dormant" || e.status === "inactive").length;

  return {
    user_id: userId,
    active_collaborators: collaborators.size,
    mentors: edges.filter((e) => e.relationship_type === "mentor" && e.to_node === personNode.id).length,
    mentees: edges.filter((e) => e.relationship_type === "mentor" && e.from_node === personNode.id).length,
    organizations_connected: orgs.size,
    community_projects: events.filter((e) => e.category === "project" || e.category === "mission").length,
    relationship_trend: growing > declining ? "growing" : declining > growing ? "declining" : "stable",
  };
}

export function getExecutiveDashboard(institutionId: string): ExecutiveRelationshipDashboard {
  const analytics = getCollaborationAnalytics(institutionId);
  const isolation = detectIsolation(institutionId);
  const resilience = computeNetworkResilience(institutionId);
  const connectors = identifyConnectors(institutionId);
  const mentorship = getMentorshipGraph(institutionId);
  const health = getRelationshipHealthSummary();

  const partnershipGrowth = Math.min(100, analytics.cross_organization_projects * 12 + health.active_relationships);
  const density = health.total_nodes ? Math.round((health.total_edges / health.total_nodes) * 10) / 10 : 0;

  return {
    institution_id: institutionId,
    collaboration_health:
      isolation.filter((a) => a.severity === "critical").length > 2
        ? "at_risk"
        : isolation.length > 3
          ? "monitor"
          : "healthy",
    partnership_growth_percent: partnershipGrowth,
    relationship_density: density,
    community_bridges: connectors.length,
    isolated_groups: isolation.length,
    mentorship_health:
      mentorship.edges.filter((e) => e.status === "active" || e.status === "strong").length >= 1
        ? "healthy"
        : mentorship.edges.length
          ? "monitor"
          : "at_risk",
    network_resilience: resilience,
  };
}

export function getFederationAnalytics(): FederationRelationshipAnalytics {
  const allEdges = loadEdges();
  const active = allEdges.filter((e) => e.status === "active" || e.status === "strong");
  const crossInst = new Set(allEdges.map((e) => e.institution_id)).size;
  return {
    cross_institution_collaboration_trend: active.length > allEdges.length * 0.5 ? "rising" : "stable",
    shared_playbook_adoptions: Math.min(12, crossInst * 2),
    leadership_exchange_events: allEdges.filter((e) => e.relationship_type === "advisor").length,
    curriculum_sharing_count: allEdges.filter((e) => e.relationship_type === "trainer").length,
    aggregated_collaboration_index: allEdges.length
      ? Math.round(active.reduce((s, e) => s + e.strength, 0) / allEdges.length)
      : 0,
    privacy_note: "Federation receives aggregated collaboration trends only — no private operational relationships exposed.",
  };
}

export function getRelationshipInsights(institutionId: string): RelationshipInsight[] {
  const isolation = detectIsolation(institutionId);
  const connectors = identifyConnectors(institutionId);
  const insights: RelationshipInsight[] = [];

  if (isolation.length) {
    insights.push({
      insight_type: "isolation",
      title: `${isolation.length} isolated groups detected`,
      message: "Early intervention can strengthen community connections before relationships go dormant.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (connectors.length) {
    insights.push({
      insight_type: "bridge",
      title: `${connectors[0]?.label ?? "Community connector"} bridges multiple organizations`,
      message: "Recognize connector roles for succession planning and outreach.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  const mentorship = getMentorshipGraph(institutionId);
  if (!mentorship.edges.length) {
    insights.push({
      insight_type: "mentorship",
      title: "Mentorship gap identified",
      message: "Consider pairing experienced organizers with new volunteers.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  return insights;
}

export function acceptMentorship(input: {
  mentor_node_id: string;
  mentee_node_id: string;
  institution_id: string;
  actor_id: string;
}) {
  return recordRelationshipEvent({
    from_node: input.mentor_node_id,
    to_node: input.mentee_node_id,
    relationship_type: "mentor",
    event_type: "mentorship_accepted",
    category: "mentorship",
    institution_id: input.institution_id,
    source: "mentorship_program",
    verification: "mutually_confirmed",
    actor_id: input.actor_id,
  });
}

export { listRelationshipAudit };
