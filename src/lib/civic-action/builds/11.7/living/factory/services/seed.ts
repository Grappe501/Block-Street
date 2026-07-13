/**
 * CAE-11.7-W13 — Seed factory defaults
 */
import { seedAutomationIfEmpty } from "../../automation/services/seed";
import { readStoreSlice } from "./repository";
import { FACTORY_STORE_KEYS } from "../data-model";
import { factoryRuntime } from "./factory-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedFactoryIfEmpty() {
  seedAutomationIfEmpty();
  if (readStoreSlice(FACTORY_STORE_KEYS.capabilities).length > 0) return false;

  const capability = factoryRuntime.registry.register({
    institution_id: INSTITUTION,
    name: "Volunteer Training Module",
    owner: HUMAN,
    category: "learning",
    purpose: "Extend learning runtime with volunteer-specific training paths",
    dependencies: ["learning-runtime"],
    interfaces: ["GET /learning/courses", "POST /learning/enroll"],
    risk_classification: "medium",
    lifecycle_stage: "proposal",
  });

  factoryRuntime.designer.design({
    capability_id: capability.capability.capability_id,
    institution_id: INSTITUTION,
    human_id: HUMAN,
    human_approved: true,
  });

  factoryRuntime.architecture.review({
    capability_id: capability.capability.capability_id,
    institution_id: INSTITUTION,
  });

  const build = factoryRuntime.build.build({
    capability_id: capability.capability.capability_id,
    institution_id: INSTITUTION,
    human_id: HUMAN,
  });

  factoryRuntime.certification.certify({
    capability_id: capability.capability.capability_id,
    build_id: build.build.build_id,
    institution_id: INSTITUTION,
  });

  factoryRuntime.deployment.start({
    capability_id: capability.capability.capability_id,
    build_id: build.build.build_id,
    institution_id: INSTITUTION,
    human_id: HUMAN,
    environment: "staging",
    approved_by_human: true,
  });

  factoryRuntime.observatory.measure({ institution_id: INSTITUTION });

  factoryRuntime.improvement.propose({
    institution_id: INSTITUTION,
    source: "observation",
    title: "Add mobile-friendly training enrollment flow",
  });

  return true;
}
