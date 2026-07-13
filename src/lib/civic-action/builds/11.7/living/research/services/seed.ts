/**
 * CAE-11.7-W5 — Seed research defaults
 */
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { readStoreSlice } from "./repository";
import { RESEARCH_STORE_KEYS } from "../data-model";
import { researchRuntime } from "./research-network-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedResearchIfEmpty() {
  seedOrganizerIfEmpty();
  if (readStoreSlice(RESEARCH_STORE_KEYS.sources).length > 0) return false;

  const county = researchRuntime.sources.register({
    name: "County Public Records Portal",
    owner: "County Clerk",
    jurisdiction: "local-county",
    domain: "public_records",
    collection_method: "authorized_api",
    reliability: 0.92,
    update_frequency: "daily",
    authentication: "api_key",
    terms_of_use: "public_records_license",
  });

  const legislature = researchRuntime.sources.register({
    name: "State Legislature Bill Tracker",
    owner: "State Legislature",
    jurisdiction: "state",
    domain: "legislation",
    collection_method: "official_feed",
    reliability: 0.95,
    update_frequency: "hourly",
    authentication: "none",
    terms_of_use: "open_government",
  });

  const grants = researchRuntime.sources.register({
    name: "Federal Grants Database",
    owner: "Grants.gov",
    jurisdiction: "federal",
    domain: "grants",
    collection_method: "authorized_api",
    reliability: 0.88,
    update_frequency: "daily",
    authentication: "oauth",
    terms_of_use: "grants_gov_terms",
  });

  researchRuntime.acquisition.search({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    query: "community development block grant",
    domain: "grants",
    source_id: grants.source.source_id,
    evidence_type: "verified",
  });

  researchRuntime.acquisition.search({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    query: "HB-214 education funding",
    domain: "legislation",
    source_id: legislature.source.source_id,
    evidence_type: "canonical",
  });

  researchRuntime.monitoring.start({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    domain: "legislation",
    query: "education funding bills",
    source_ids: [legislature.source.source_id],
    schedule: "daily",
  });

  researchRuntime.changes.detect({
    institution_id: INSTITUTION,
    domain: "legislation",
    subject: "HB-214",
    change_type: "updated",
    summary: "Committee substitute filed with revised appropriation schedule.",
    source_id: legislature.source.source_id,
  });

  researchRuntime.briefs.generate({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    brief_type: "legislative",
    title: "Legislative Watch — Education Funding",
    evidence: ["HB-214 committee substitute — State Legislature"],
    contradictions: ["Prior summary cited outdated fiscal note"],
  });

  researchRuntime.opportunities.discover({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    title: "CDBG planning grant window",
    domain: "grants",
    description: "Planning grant for community development projects opens next quarter.",
    evidence: ["Grants.gov notice 2026-CDBG-PLAN"],
    source_ids: [grants.source.source_id],
    time_window: "Q3 2026",
  });

  researchRuntime.threats.detect({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    title: "Potential funding reduction in HB-214 substitute",
    domain: "legislation",
    summary: "Substitute bill reduces line item relevant to volunteer programs.",
    evidence: ["HB-214 substitute fiscal note section 4"],
    source_ids: [legislature.source.source_id],
    likelihood: "moderate",
    impact: "high",
  });

  researchRuntime.memory.remember({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    memory_type: "open_question",
    content: "What is the confirmed county match requirement for CDBG planning?",
    reference_ids: [county.source.source_id],
  });

  researchRuntime.memory.remember({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    memory_type: "favorite_source",
    content: "County Public Records Portal",
    reference_ids: [county.source.source_id],
  });

  return true;
}
