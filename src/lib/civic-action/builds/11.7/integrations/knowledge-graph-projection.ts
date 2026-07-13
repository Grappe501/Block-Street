/**
 * CAE-11.7-W5 — Knowledge graph projection (relationships from conversations)
 */
import { communicationApplicationService } from "../application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { CommunicationEventOutboxRecord } from "../services/events";
import { nowIso } from "../../../utils";

export type KnowledgeGraphEdge = {
  edge_id: string;
  source_id: string;
  source_type: string;
  target_id: string;
  target_type: string;
  relationship: string;
  institution_id: string;
  initiative_id: string;
  created_at: string;
  source_event_id: string;
};

const GRAPH_KEY = "communication_knowledge_graph";

export function projectKnowledgeGraphRelationships(record: CommunicationEventOutboxRecord) {
  const edges: KnowledgeGraphEdge[] = [];
  const institutionId = (record.payload.institution_id as string) ?? "";
  const initiativeId = (record.payload.initiative_id as string) ?? "";

  if (record.event_type === "communication.conversation_created") {
    edges.push({
      edge_id: `kg-${record.event_id}-1`,
      source_id: record.entity_id,
      source_type: "conversation",
      target_id: (record.payload.related_object_id as string) ?? initiativeId,
      target_type: (record.payload.related_object_type as string) ?? "initiative",
      relationship: "context_of",
      institution_id: institutionId,
      initiative_id: initiativeId,
      created_at: nowIso(),
      source_event_id: record.event_id,
    });
    const missionId = record.payload.mission_id_optional as string | null;
    if (missionId) {
      edges.push({
        edge_id: `kg-${record.event_id}-2`,
        source_id: record.entity_id,
        source_type: "conversation",
        target_id: missionId,
        target_type: "mission",
        relationship: "bound_to",
        institution_id: institutionId,
        initiative_id: initiativeId,
        created_at: nowIso(),
        source_event_id: record.event_id,
      });
    }
  }

  if (record.event_type === "communication.decision_recorded") {
    const conversationId = (record.payload.conversation_id as string) ?? "";
    edges.push({
      edge_id: `kg-${record.event_id}-1`,
      source_id: record.entity_id,
      source_type: "decision",
      target_id: conversationId,
      target_type: "conversation",
      relationship: "recorded_in",
      institution_id: institutionId,
      initiative_id: initiativeId,
      created_at: nowIso(),
      source_event_id: record.event_id,
    });
  }

  if (record.event_type === "communication.document_created") {
    const conversationId = record.payload.conversation_id_optional as string | null;
    if (conversationId) {
      edges.push({
        edge_id: `kg-${record.event_id}-1`,
        source_id: record.entity_id,
        source_type: "document",
        target_id: conversationId,
        target_type: "conversation",
        relationship: "collaborates_in",
        institution_id: institutionId,
        initiative_id: initiativeId,
        created_at: nowIso(),
        source_event_id: record.event_id,
      });
    }
  }

  if (edges.length === 0 && record.entity_type === "conversation") {
    const bundle = communicationApplicationService.getConversationBundle(record.entity_id);
    if (bundle) {
      edges.push({
        edge_id: `kg-${record.event_id}-fallback`,
        source_id: record.entity_id,
        source_type: "conversation",
        target_id: bundle.conversation.initiative_id,
        target_type: "initiative",
        relationship: "belongs_to",
        institution_id: bundle.conversation.institution_id,
        initiative_id: bundle.conversation.initiative_id,
        created_at: nowIso(),
        source_event_id: record.event_id,
      });
    }
  }

  if (edges.length > 0) {
    const graph = readStoreSlice<KnowledgeGraphEdge>(GRAPH_KEY);
    graph.push(...edges);
    writeStoreSlice(GRAPH_KEY, graph);
  }
  return edges;
}

export function listKnowledgeGraphEdges(institutionId?: string, initiativeId?: string) {
  let edges = readStoreSlice<KnowledgeGraphEdge>(GRAPH_KEY);
  if (institutionId) edges = edges.filter((e) => e.institution_id === institutionId);
  if (initiativeId) edges = edges.filter((e) => e.initiative_id === initiativeId);
  return edges;
}

/** CAE-11.7-W6 — Derive unique node IDs from projected edges */
export function listKnowledgeGraphNodeIds(institutionId?: string, initiativeId?: string): string[] {
  const edges = listKnowledgeGraphEdges(institutionId, initiativeId);
  const ids = new Set<string>();
  for (const e of edges) {
    ids.add(e.source_id);
    ids.add(e.target_id);
  }
  return [...ids];
}

/** CAE-11.7-W6 — Null-safe graph lookup for intelligence layer */
export function getKnowledgeGraphEdgeCount(institutionId: string, anchorId?: string): number {
  const edges = listKnowledgeGraphEdges(institutionId);
  if (!anchorId) return edges.length;
  return edges.filter((e) => e.source_id === anchorId || e.target_id === anchorId).length;
}
