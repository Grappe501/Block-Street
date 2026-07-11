import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  Connector,
  GraphEdge,
  GraphNode,
  IntroductionSuggestion,
  NetworkAnalysis,
  RelationshipAlert,
  RelationshipDashboard,
  RelationshipProfile,
  StrengthSignals,
} from "./types";

const DATA = join(process.cwd(), "data", "relationships");

let profileCache: RelationshipProfile[] | null = null;

function loadWeights() {
  return JSON.parse(readFileSync(join(DATA, "scoring_weights.json"), "utf8"));
}

function computeStrength(signals: StrengthSignals): number {
  const w = loadWeights().weights;
  const score =
    signals.meetingFrequency * w.meetingFrequency +
    signals.sharedEvents * w.sharedEvents +
    signals.missionCollaboration * w.missionCollaboration +
    signals.volunteerWork * w.volunteerWork +
    signals.communication * w.communication +
    signals.introductions * w.introductions +
    signals.jointOrganizations * w.jointOrganizations +
    signals.relationshipLength * w.relationshipLength +
    signals.recentActivity * w.recentActivity +
    signals.consistency * w.consistency;
  return Math.round(score * 100);
}

function loadProfiles(): RelationshipProfile[] {
  if (profileCache) return profileCache;
  const raw = JSON.parse(readFileSync(join(DATA, "profiles.json"), "utf8"));
  profileCache = (raw.profiles as RelationshipProfile[]).map((p) => ({
    ...p,
    strengthPercent: computeStrength(p.strengthSignals),
  }));
  return profileCache;
}

function loadGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  return JSON.parse(readFileSync(join(DATA, "graph.json"), "utf8"));
}

function loadAlerts(): RelationshipAlert[] {
  const raw = JSON.parse(readFileSync(join(DATA, "alerts.json"), "utf8"));
  return raw.alerts;
}

function loadIntroductions(): IntroductionSuggestion[] {
  const raw = JSON.parse(readFileSync(join(DATA, "introductions.json"), "utf8"));
  return raw.introductions;
}

export function listRelationships(filters?: {
  health?: string;
  county?: string;
  type?: string;
  limit?: number;
}): RelationshipProfile[] {
  let results = loadProfiles();
  if (filters?.health) results = results.filter((r) => r.health === filters.health);
  if (filters?.county) results = results.filter((r) => r.county === filters.county);
  if (filters?.type) results = results.filter((r) => r.type === filters.type);
  results = results.sort((a, b) => b.strengthPercent - a.strengthPercent);
  if (filters?.limit) results = results.slice(0, filters.limit);
  return results;
}

export function getRelationship(id: string): RelationshipProfile | null {
  return loadProfiles().find((r) => r.id === id) ?? null;
}

export function getGraph() {
  return loadGraph();
}

export function getNetworkAnalysis(): NetworkAnalysis {
  const graph = loadGraph();
  const edgeCounts: Record<string, number> = {};
  for (const e of graph.edges) {
    edgeCounts[e.source] = (edgeCounts[e.source] || 0) + 1;
    edgeCounts[e.target] = (edgeCounts[e.target] || 0) + 1;
  }
  const sorted = Object.entries(edgeCounts).sort((a, b) => b[1] - a[1]);
  const centralConnectors = sorted.slice(0, 3).map(([id]) => {
    const node = graph.nodes.find((n) => n.id === id);
    return node?.label ?? id;
  });
  const connected = new Set(Object.keys(edgeCounts));
  const isolatedNodes = graph.nodes
    .filter((n) => !connected.has(n.id) || (edgeCounts[n.id] || 0) <= 1)
    .map((n) => n.label);
  const bridgeOrgs = graph.nodes
    .filter((n) => n.type === "organization" && (edgeCounts[n.id] || 0) >= 2)
    .map((n) => n.label);
  const countyCounts: Record<string, number> = {};
  for (const e of graph.edges) {
    const src = graph.nodes.find((n) => n.id === e.source);
    const tgt = graph.nodes.find((n) => n.id === e.target);
    if (src && tgt && src.county !== tgt.county) {
      countyCounts[`${src.county}-${tgt.county}`] = (countyCounts[`${src.county}-${tgt.county}`] || 0) + 1;
    }
  }
  return {
    centralConnectors,
    isolatedNodes,
    bridgeOrganizations: bridgeOrgs,
    coalitionOverlap: ["Food Security × Education", "Faith × Nonprofit", "Business × Coalition"],
    regionalCollaboration: Object.entries(countyCounts).map(([pair, count]) => {
      const [county] = pair.split("-");
      return { county, connectionCount: count };
    }),
  };
}

export function getConnectors(): Connector[] {
  return loadProfiles()
    .filter((p) => p.connectorRole || p.influencePercent >= 80)
    .map((p) => ({
      id: p.id,
      label: p.participants[0] ?? p.organizations[0] ?? p.id,
      role: p.tags.join(", "),
      influencePercent: p.influencePercent,
      connectorRole: p.connectorRole ?? "HighInfluenceLeader",
      connectedCommunities: p.connectedCommunities ?? [],
      county: p.county,
    }));
}

export function getOrganizationRelationships(): RelationshipProfile[] {
  return loadProfiles().filter(
    (p) => p.type === "organization" || p.type === "coalition" || p.organizations.length > 0
  );
}

export function getRelationshipHistory(id: string) {
  const profile = getRelationship(id);
  if (!profile) return null;
  return { relationshipId: id, timeline: profile.timeline, participants: profile.participants };
}

export function getHealthDashboard(): RelationshipDashboard {
  const profiles = loadProfiles();
  const strong = profiles.filter((p) => p.strengthPercent >= 80);
  const growing = profiles.filter((p) => p.health === "growing");
  const dormant = profiles.filter((p) => p.health === "dormant" || p.health === "inactive");
  const connectors = getConnectors();
  const highInfluence = profiles.filter((p) => p.influencePercent >= 80);
  const avgHealth = Math.round(profiles.reduce((s, p) => s + p.strengthPercent, 0) / profiles.length);
  const intros = loadIntroductions();
  return {
    relationshipHealthPercent: avgHealth,
    strongRelationships: strong.length,
    growing: growing.length,
    dormant: dormant.length,
    introductionsSuggested: intros.length,
    bridgeBuilders: connectors.filter((c) => c.connectorRole === "BridgeBuilder").length,
    highInfluenceLeaders: highInfluence.length,
  };
}

export function getAlerts(): RelationshipAlert[] {
  return loadAlerts();
}

export function getRecommendations() {
  const alerts = loadAlerts().filter((a) => a.feedsRecommendation);
  const intros = loadIntroductions();
  const dormant = loadProfiles().filter((p) => p.feedsRecommendation);
  return { alerts, introductions: intros, priorityRelationships: dormant };
}

export function suggestIntroduction(partial: {
  fromLabel: string;
  toLabel: string;
  reason: string;
  evidence?: string[];
}): IntroductionSuggestion {
  const intros = loadIntroductions();
  const intro: IntroductionSuggestion = {
    id: `intro-${Date.now()}`,
    fromLabel: partial.fromLabel,
    toLabel: partial.toLabel,
    reason: partial.reason,
    evidence: partial.evidence ?? [],
    confidencePercent: 75,
    mutualConnections: 0,
    status: "pending",
  };
  intros.push(intro);
  writeFileSync(join(DATA, "introductions.json"), JSON.stringify({ introductions: intros }, null, 2));
  return intro;
}
