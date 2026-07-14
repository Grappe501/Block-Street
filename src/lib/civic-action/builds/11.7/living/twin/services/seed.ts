/**
 * CAE-11.7-W14 — Seed digital twin defaults
 */
import { seedFactoryIfEmpty } from "../../factory/services/seed";
import { readStoreSlice } from "./repository";
import { TWIN_STORE_KEYS } from "../data-model";
import { twinRuntime } from "./twin-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedTwinIfEmpty() {
  seedFactoryIfEmpty();
  if (readStoreSlice(TWIN_STORE_KEYS.twins).length > 0) return false;

  const twin = twinRuntime.digitalTwin.create({
    institution_id: INSTITUTION,
    owner: HUMAN,
    name: "Block Street Digital Twin",
  });

  twinRuntime.model.model({
    twin_id: twin.twin.twin_id,
    institution_id: INSTITUTION,
  });

  twinRuntime.sync.synchronize({
    twin_id: twin.twin.twin_id,
    institution_id: INSTITUTION,
    human_id: HUMAN,
  });

  twinRuntime.simulation.run({
    twin_id: twin.twin.twin_id,
    institution_id: INSTITUTION,
    human_id: HUMAN,
    simulation_type: "operational",
    hypothesis: "Volunteer growth doubles without staffing increase",
  });

  twinRuntime.experiments.create({
    twin_id: twin.twin.twin_id,
    institution_id: INSTITUTION,
    owner: HUMAN,
    purpose: "Baseline capacity simulation",
    hypothesis: "County immersion load remains sustainable at current density",
  });

  twinRuntime.observatory.measure({
    institution_id: INSTITUTION,
    twin_id: twin.twin.twin_id,
  });

  return true;
}
