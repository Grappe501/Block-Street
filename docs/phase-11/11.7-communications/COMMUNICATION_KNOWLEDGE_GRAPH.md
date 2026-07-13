# Communication Knowledge Graph

**Protocol ID:** CAE-11.7-W6 · **Subsystem:** COM-INT-001

## Purpose

Project conversation relationships (missions, decisions, documents) into an advisory knowledge graph.

## Rules

- Nodes: conversations, missions, decisions, documents, meetings, knowledge, initiatives, people (labels only).
- Edges: projected from W5 `knowledge-graph-projection.ts` events.
- **No people scoring** — people appear as relationship nodes only.
- Graph is null-safe for unknown anchors.
