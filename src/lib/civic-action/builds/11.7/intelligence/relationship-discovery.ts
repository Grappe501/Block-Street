/**
 * CAE-11.7-W6 — Relationship discovery (knowledge graph nodes/edges)
 * People appear as nodes only — no people scoring.
 */
import { communicationApplicationService } from "../application-service";
import { listKnowledgeGraphEdges } from "../integrations/knowledge-graph-projection";
import type { KnowledgeGraphEdge, KnowledgeGraphNode, KnowledgeGraphView } from "./contracts";
import { humanLabel } from "../ux/experience-context";

export function buildKnowledgeGraph(
  anchorId: string,
  anchorType: string,
  institutionId: string
): KnowledgeGraphView | null {
  const edges = listKnowledgeGraphEdges(institutionId);
  const related = edges.filter((e) => e.source_id === anchorId || e.target_id === anchorId);
  if (related.length === 0) {
    const conv = communicationApplicationService.getConversation(anchorId);
    if (!conv && anchorType === "conversation") return null;
    if (conv) {
      return {
        graph_id: `kg-${anchorId}`,
        anchor_id: anchorId,
        anchor_type: anchorType,
        nodes: [
          nodeFromConversation(conv.canonical_id, conv.display_name, conv.institution_id, conv.initiative_id),
        ],
        edges: [],
        node_count: 1,
        edge_count: 0,
        advisory_only: true,
      };
    }
    return null;
  }

  const nodeIds = new Set<string>();
  for (const e of related) {
    nodeIds.add(e.source_id);
    nodeIds.add(e.target_id);
  }

  const nodes: KnowledgeGraphNode[] = [];
  for (const id of nodeIds) {
    const node = resolveNode(id, institutionId);
    if (node) nodes.push(node);
  }

  return {
    graph_id: `kg-${anchorId}`,
    anchor_id: anchorId,
    anchor_type: anchorType,
    nodes,
    edges: related.map(toContractEdge),
    node_count: nodes.length,
    edge_count: related.length,
    advisory_only: true,
  };
}

function toContractEdge(e: {
  edge_id: string;
  source_id: string;
  source_type: string;
  target_id: string;
  target_type: string;
  relationship: string;
  institution_id: string;
  initiative_id: string;
}): KnowledgeGraphEdge {
  return {
    edge_id: e.edge_id,
    source_id: e.source_id,
    source_type: e.source_type,
    target_id: e.target_id,
    target_type: e.target_type,
    relationship: e.relationship,
    institution_id: e.institution_id,
    initiative_id: e.initiative_id,
  };
}

function nodeFromConversation(
  id: string,
  label: string,
  institutionId: string,
  initiativeId: string
): KnowledgeGraphNode {
  return { node_id: id, node_type: "conversation", label, institution_id: institutionId, initiative_id: initiativeId };
}

function resolveNode(id: string, institutionId: string): KnowledgeGraphNode | null {
  const conv = communicationApplicationService.getConversation(id);
  if (conv) return nodeFromConversation(conv.canonical_id, conv.display_name, conv.institution_id, conv.initiative_id);

  const decision = communicationApplicationService.getDecision(id);
  if (decision) {
    return {
      node_id: id,
      node_type: "decision",
      label: decision.display_name,
      institution_id: decision.institution_id,
      initiative_id: decision.initiative_id,
    };
  }

  const meeting = communicationApplicationService.getMeeting(id);
  if (meeting) {
    return {
      node_id: id,
      node_type: "meeting",
      label: meeting.display_name,
      institution_id: meeting.institution_id,
      initiative_id: meeting.initiative_id,
    };
  }

  const doc = communicationApplicationService.getDocument(id);
  if (doc) {
    return {
      node_id: id,
      node_type: "document",
      label: doc.display_name,
      institution_id: doc.institution_id,
      initiative_id: doc.initiative_id,
    };
  }

  if (id.startsWith("msn-")) {
    return {
      node_id: id,
      node_type: "mission",
      label: `Mission ${id}`,
      institution_id: institutionId,
      initiative_id: "",
    };
  }

  if (id.startsWith("usr-")) {
    return {
      node_id: id,
      node_type: "person",
      label: humanLabel(id),
      institution_id: institutionId,
      initiative_id: "",
    };
  }

  if (id.startsWith("ini-")) {
    return { node_id: id, node_type: "initiative", label: id, institution_id: institutionId, initiative_id: id };
  }

  return null;
}

export function discoverRelationships(institutionId: string, initiativeId?: string) {
  let edges = listKnowledgeGraphEdges(institutionId);
  if (initiativeId) edges = edges.filter((e) => e.initiative_id === initiativeId);
  const nodeMap = new Map<string, KnowledgeGraphNode>();
  for (const e of edges) {
    const src = resolveNode(e.source_id, institutionId);
    const tgt = resolveNode(e.target_id, institutionId);
    if (src) nodeMap.set(src.node_id, src);
    if (tgt) nodeMap.set(tgt.node_id, tgt);
  }
  return {
    nodes: [...nodeMap.values()],
    edges: edges.map(toContractEdge),
    advisory_only: true as const,
  };
}
