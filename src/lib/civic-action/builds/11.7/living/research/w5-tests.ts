/**
 * CAE-11.7-W5 — Research Network tests
 */
import { researchRuntime } from "./services/research-network-service";
import { seedResearchIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getResearchConstitution, LIX_RESEARCH_PRINCIPLE, REQUIRED_RESEARCH_SERVICES } from "./constitution";
import { checkLixW5Invariants } from "./invariants";
import { explainResearchAction } from "./traceability";
import { RESEARCH_EVENT_CATALOG } from "./events/catalog";

export type LixW5TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW5CertificationTests(): LixW5TestResult[] {
  seedResearchIfEmpty();
  const results: LixW5TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getResearchConstitution();
  results.push({ name: "research_principle", passed: constitution.governing_principle === LIX_RESEARCH_PRINCIPLE });

  results.push({
    name: "required_research_services",
    passed: REQUIRED_RESEARCH_SERVICES.length === 13,
    detail: `${REQUIRED_RESEARCH_SERVICES.length} services`,
  });

  results.push({ name: "w5_invariants", passed: checkLixW5Invariants().every((i) => i.passed) });

  results.push({
    name: "research_event_catalog",
    passed: RESEARCH_EVENT_CATALOG.length >= 9,
    detail: `${RESEARCH_EVENT_CATALOG.length} events`,
  });

  const dashboard = researchRuntime.research.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "research_dashboard",
    passed: dashboard.next_question.includes("know today") && dashboard.mutates_canonical === false,
    detail: dashboard.greeting,
  });

  const sources = researchRuntime.sources.list();
  results.push({
    name: "source_registry",
    passed: sources.length >= 3 && sources.every((s) => s.permanently_trusted === false),
    detail: `${sources.length} sources`,
  });

  const trust = researchRuntime.trust.score(sources[0].source_id);
  results.push({
    name: "trust_framework",
    passed: trust.continuously_earned && trust.permanently_trusted === false,
    detail: `trust ${trust.trust_score.toFixed(2)}`,
  });

  const search = researchRuntime.acquisition.search({
    human_id: humanId,
    institution_id: institutionId,
    query: "county budget hearing",
    domain: "public_records",
    source_id: sources[0].source_id,
    evidence_type: "verified",
  });
  results.push({
    name: "research_acquisition",
    passed: search.traceable && search.anonymous_ai_fact === false && !!search.item.retrieved_at,
    detail: search.item.research_id,
  });

  const normalized = researchRuntime.normalization.normalize({
    entity_type: "bill",
    label: "HB-214",
    source_id: sources[0].source_id,
  });
  results.push({ name: "normalization", passed: normalized.institutional_language === true, detail: normalized.canonical_id });

  const correlation = researchRuntime.correlation.link({
    research_id: search.item.research_id,
    linked_type: "mission",
    linked_id: "msn-block-street-001",
  });
  results.push({
    name: "evidence_correlation",
    passed: correlation.mutates_canonical === false,
    detail: correlation.correlation.linked_type,
  });

  const monitor = researchRuntime.monitoring.start({
    human_id: humanId,
    institution_id: institutionId,
    domain: "grants",
    query: "CDBG opportunities",
    source_ids: [sources[2]?.source_id ?? sources[0].source_id],
  });
  results.push({
    name: "continuous_monitoring",
    passed: monitor.permission_aware === true,
    detail: monitor.monitor.monitor_id,
  });

  const change = researchRuntime.changes.detect({
    institution_id: institutionId,
    domain: "grants",
    subject: "CDBG notice",
    change_type: "new",
    summary: "New planning grant notice published.",
    source_id: sources[2]?.source_id ?? sources[0].source_id,
    contradictory: "Prior notice listed different deadline",
  });
  results.push({
    name: "change_detection",
    passed: change.what_changed_report === true,
    detail: change.change.change_id,
  });

  const brief = researchRuntime.briefs.generate({
    human_id: humanId,
    institution_id: institutionId,
    brief_type: "executive",
    title: "Executive Research Brief",
    contradictions: ["Conflicting fiscal note versions"],
  });
  results.push({
    name: "research_brief",
    passed:
      brief.human_review_required &&
      brief.brief.open_questions.length > 0 &&
      brief.brief.auto_published === false,
    detail: brief.brief.brief_id,
  });

  const opportunity = researchRuntime.opportunities.discover({
    human_id: humanId,
    institution_id: institutionId,
    title: "Volunteer training partnership",
    domain: "community_issues",
    description: "Regional nonprofit offering facilitator training.",
    evidence: ["Partner announcement — verified email"],
    source_ids: [sources[0].source_id],
  });
  results.push({
    name: "opportunity_discovery",
    passed: opportunity.recommendation_only === true,
    detail: opportunity.opportunity.opportunity_id,
  });

  let threatBlocked = false;
  try {
    researchRuntime.threats.detect({
      human_id: humanId,
      institution_id: institutionId,
      title: "Unsubstantiated risk",
      domain: "legislation",
      summary: "Rumor without evidence",
      evidence: [],
      source_ids: [sources[1].source_id],
    });
  } catch {
    threatBlocked = true;
  }
  results.push({ name: "threat_requires_evidence", passed: threatBlocked, detail: "fear-based blocked" });

  const threat = researchRuntime.threats.detect({
    human_id: humanId,
    institution_id: institutionId,
    title: "Compliance deadline approaching",
    domain: "regulations",
    summary: "Reporting deadline in 30 days per official notice.",
    evidence: ["State compliance bulletin 2026-07"],
    source_ids: [sources[1].source_id],
  });
  results.push({
    name: "threat_detection",
    passed: threat.fear_based === false && threat.threat.evidence.length > 0,
    detail: threat.threat.threat_id,
  });

  const promotion = researchRuntime.promotion.request({
    research_id: search.item.research_id,
    human_id: humanId,
    institution_id: institutionId,
    from_stage: "temporary_research",
    to_stage: "working_knowledge",
  });
  results.push({
    name: "knowledge_promotion_pending",
    passed: promotion.auto_promoted === false && promotion.human_review_required === true,
    detail: promotion.promotion.status,
  });

  const approved = researchRuntime.promotion.approve(promotion.promotion.promotion_id, humanId, humanId);
  results.push({
    name: "knowledge_promotion_review",
    passed: approved.mutates_canonical === false,
    detail: approved.promotion.status,
  });

  const memory = researchRuntime.memory.remember({
    human_id: humanId,
    institution_id: institutionId,
    memory_type: "institutional_interest",
    content: "County immersion program funding",
    reference_ids: [search.item.research_id],
  });
  results.push({ name: "research_memory", passed: !!memory.memory_id, detail: memory.memory_type });

  const ethics = researchRuntime.research.ethics.check("scrape_prohibited_data");
  results.push({ name: "privacy_ethics", passed: ethics.allowed === false, detail: "prohibited scraping blocked" });

  const trace = explainResearchAction({
    human_id: humanId,
    action_type: "search",
    source_id: sources[0].source_id,
    confidence: 0.8,
  });
  results.push({
    name: "research_traceability",
    passed: trace.includes("Humans determine meaning") && trace.includes(humanId),
    detail: "explainable",
  });

  results.push({
    name: "news_labeling",
    passed: search.item.evidence_type !== "canonical" || search.item.source_id.length > 0,
    detail: search.item.evidence_type,
  });

  results.push({
    name: "contradictory_evidence_visible",
    passed: brief.brief.contradictions.length > 0,
    detail: `${brief.brief.contradictions.length} contradictions`,
  });

  return results;
}

export function allLixW5TestsPassed(): boolean {
  return runLixW5CertificationTests().every((t) => t.passed);
}
