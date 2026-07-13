/**
 * CAE-11.12-W7 — Institutional wisdom consolidation
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { InstitutionalWisdomArtifact } from "./contracts";

const KEY = "institutional_wisdom_artifacts";

export function createWisdomArtifact(input: {
  institution_id: string;
  title: string;
  guiding_principle: string;
  context: string;
  evidence: string[];
  limitations?: string[];
  tradeoffs?: string[];
}): InstitutionalWisdomArtifact {
  const artifact: InstitutionalWisdomArtifact = {
    institutional_wisdom_id: caeId("wis"),
    institution_id: input.institution_id,
    title: input.title,
    guiding_principle: input.guiding_principle,
    context: input.context,
    evidence: input.evidence,
    limitations: input.limitations ?? ["Context-specific — not universal policy"],
    tradeoffs: input.tradeoffs ?? [],
    approval_status: "draft",
    current_version: 1,
    advisory_only: true,
  };
  const rows = readStoreSlice<InstitutionalWisdomArtifact>(KEY);
  rows.push(artifact);
  writeStoreSlice(KEY, rows);
  return artifact;
}

export function listWisdomArtifacts(institutionId: string) {
  return readStoreSlice<InstitutionalWisdomArtifact>(KEY).filter((w) => w.institution_id === institutionId);
}

export function seedDefaultWisdom(institutionId: string) {
  const existing = listWisdomArtifacts(institutionId);
  if (existing.length > 0) return existing;
  return [
    createWisdomArtifact({
      institution_id: institutionId,
      title: "Completion is not competency",
      guiding_principle: "Course completion does not automatically demonstrate capability.",
      context: "Learning operations and certification governance",
      evidence: ["Wave 3 domain separation", "Competency requires explicit verification"],
      limitations: ["Does not replace role-specific competency definitions"],
    }),
    createWisdomArtifact({
      institution_id: institutionId,
      title: "Safety instruction uses practical scenarios",
      guiding_principle: "Safety training benefits from Human-reviewed practical scenarios and localization.",
      context: "Volunteer safety and field operations",
      evidence: ["Pilot outcomes", "Mission safety patterns"],
      tradeoffs: ["Additional training time may be required"],
    }),
  ];
}
