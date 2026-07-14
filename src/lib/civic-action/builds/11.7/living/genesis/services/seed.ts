/**
 * CAE-11.7-W16 — Seed genesis defaults
 */
import { seedKernelIfEmpty } from "../../kernel/services/seed";
import { readStoreSlice } from "./repository";
import { GENESIS_STORE_KEYS } from "../data-model";
import { genesisRuntime } from "./genesis-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedGenesisIfEmpty() {
  seedKernelIfEmpty();
  if (readStoreSlice(GENESIS_STORE_KEYS.packages).length > 0) return false;

  genesisRuntime.dna.capture({ institution_id: INSTITUTION });

  const pkg = genesisRuntime.packages.export({
    institution_id: INSTITUTION,
    owner: HUMAN,
  });

  genesisRuntime.archives.archive({
    institution_id: INSTITUTION,
    category: "governance",
    title: "Founding Constitution Archive",
    human_id: HUMAN,
  });

  genesisRuntime.timeline.record({
    institution_id: INSTITUTION,
    event_type: "founding",
    title: "Block Street Living Institution founded",
  });

  genesisRuntime.vault.store({
    institution_id: INSTITUTION,
    category: "constitution",
    title: "Constitutional Kernel Principles",
    human_id: HUMAN,
  });

  const continuity = genesisRuntime.continuity.plan({
    institution_id: INSTITUTION,
    scenario: "leadership_transition",
    human_id: HUMAN,
  });

  genesisRuntime.continuity.test({
    continuity_id: continuity.continuity.continuity_id,
    institution_id: INSTITUTION,
    human_id: HUMAN,
  });

  genesisRuntime.observatory.measure({ institution_id: INSTITUTION });

  genesisRuntime.stewardship.record({
    institution_id: INSTITUTION,
    change_type: "approval",
    description: "Genesis layer activated for institutional continuity",
    human_steward: HUMAN,
  });

  void pkg;
  return true;
}
