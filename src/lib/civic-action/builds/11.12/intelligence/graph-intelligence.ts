/**
 * CAE-11.12-W6 — Knowledge graph intelligence (explainable, advisory)
 */
import { caeId } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { GraphImpactAnalysis } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { filterArtifactsByPermission } from "./semantic-retrieval";

export type GraphNode = {
  node_id: string;
  node_type: string;
  label: string;
  institution_id: string;
  lifecycle_state?: string;
};

export type GraphEdge = {
  edge_id: string;
  source_id: string;
  target_id: string;
  relationship: string;
  authoritative: boolean;
  review_required: boolean;
};

export type KnowledgeGraphView = {
  graph_id: string;
  anchor_id: string;
  anchor_type: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  suggested_edges: GraphEdge[];
  advisory_only: true;
};

export function buildKnowledgeGraph(
  anchorId: string,
  anchorType: string,
  ctx: KnowledgeIntelligenceContext
): KnowledgeGraphView | null {
  const artifact = anchorType.includes("artifact") ? knowledgeApplicationService.getArtifact(anchorId) : null;
  const course = anchorType.includes("course") ? knowledgeApplicationService.getCourse(anchorId) : null;
  if (!artifact && !course) return null;
  if (artifact && artifact.institution_id !== ctx.institution_id) return null;
  if (course && course.institution_id !== ctx.institution_id) return null;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  if (artifact) {
    nodes.push({
      node_id: artifact.canonical_id,
      node_type: "KnowledgeArtifact",
      label: artifact.display_name,
      institution_id: artifact.institution_id,
      lifecycle_state: artifact.lifecycle_state,
    });
    const relatedCourses = knowledgeApplicationService
      .listCourses(ctx.institution_id)
      .filter((c) => c.domain_id === artifact.domain_id)
      .slice(0, 3);
    for (const c of relatedCourses) {
      nodes.push({
        node_id: c.canonical_id,
        node_type: "Course",
        label: c.display_name,
        institution_id: c.institution_id,
        lifecycle_state: c.lifecycle_state,
      });
      edges.push({
        edge_id: caeId("kge"),
        source_id: artifact.canonical_id,
        target_id: c.canonical_id,
        relationship: "TEACHES",
        authoritative: false,
        review_required: true,
      });
    }
  }

  if (course) {
    nodes.push({
      node_id: course.canonical_id,
      node_type: "Course",
      label: course.display_name,
      institution_id: course.institution_id,
      lifecycle_state: course.lifecycle_state,
    });
    const assessments = knowledgeApplicationService.listAssessments(ctx.institution_id).filter(
      (a) => a.course_id === course.canonical_id
    );
    for (const a of assessments.slice(0, 3)) {
      nodes.push({
        node_id: a.canonical_id,
        node_type: "Assessment",
        label: a.display_name,
        institution_id: a.institution_id,
      });
      edges.push({
        edge_id: caeId("kge"),
        source_id: course.canonical_id,
        target_id: a.canonical_id,
        relationship: "ASSESSES",
        authoritative: true,
        review_required: false,
      });
    }
  }

  return {
    graph_id: caeId("kgr"),
    anchor_id: anchorId,
    anchor_type: anchorType,
    nodes,
    edges,
    suggested_edges: edges.filter((e) => e.review_required),
    advisory_only: true,
  };
}

export function analyzeKnowledgeImpact(
  entityId: string,
  entityType: string,
  ctx: KnowledgeIntelligenceContext
): GraphImpactAnalysis {
  const graph = buildKnowledgeGraph(entityId, entityType, ctx);
  const courses = graph?.nodes.filter((n) => n.node_type === "Course").map((n) => n.node_id) ?? [];
  const assessments = graph?.nodes.filter((n) => n.node_type === "Assessment").map((n) => n.node_id) ?? [];
  const certs = knowledgeApplicationService
    .listCertifications(ctx.institution_id)
    .slice(0, 2)
    .map((c) => c.canonical_id);

  return {
    analysis_id: caeId("kia"),
    anchor_entity_id: entityId,
    anchor_entity_type: entityType,
    affected_courses: courses,
    affected_assessments: assessments,
    affected_certifications: certs,
    affected_translations: [],
    review_recommendations: [
      "Review dependent courses and assessments before source withdrawal.",
      "Create steward review queue item — no automatic unpublish.",
    ],
    advisory_only: true,
  };
}

export function discoverSuggestedRelationships(ctx: KnowledgeIntelligenceContext) {
  const artifacts = filterArtifactsByPermission(ctx);
  const suggestions: { source_id: string; target_id: string; reason: string; confidence: string }[] = [];
  for (let i = 0; i < artifacts.length - 1; i++) {
    const a = artifacts[i];
    const b = artifacts[i + 1];
    if (a.lifecycle_state === b.lifecycle_state) {
      suggestions.push({
        source_id: a.id,
        target_id: b.id,
        reason: "Shared knowledge domain — suggested RELATED_TO",
        confidence: "low",
      });
    }
  }
  return suggestions.slice(0, 5).map((s) => ({ ...s, human_review_required: true, authoritative: false }));
}
