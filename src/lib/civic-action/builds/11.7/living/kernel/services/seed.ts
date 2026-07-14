/**
 * CAE-11.7-W15 — Seed kernel defaults
 */
import { seedTwinIfEmpty } from "../../twin/services/seed";
import { readStoreSlice } from "./repository";
import { KERNEL_STORE_KEYS } from "../data-model";
import { kernelRuntime } from "./kernel-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedKernelIfEmpty() {
  seedTwinIfEmpty();
  if (readStoreSlice(KERNEL_STORE_KEYS.kernels).length > 0) return false;

  kernelRuntime.os.start({
    institution_id: INSTITUTION,
    human_id: HUMAN,
  });

  kernelRuntime.identity.register({
    institution_id: INSTITUTION,
    entity_id: HUMAN,
    entity_type: "human",
    role: "executive",
    authority: ["kernel.view", "kernel.execute", "runtime.execute", "*"],
  });

  kernelRuntime.policy.register({
    institution_id: INSTITUTION,
    name: "Universal Runtime Governance",
    domain: "security",
  });

  for (const layer of ["human", "institutional", "operational", "learning"] as const) {
    kernelRuntime.memory.integrate({
      institution_id: INSTITUTION,
      layer,
      authoritative: layer === "institutional",
    });
  }

  kernelRuntime.events.connectMesh({
    institution_id: INSTITUTION,
    from_service: "automation",
    to_service: "kernel",
  });

  kernelRuntime.runtime.execute({
    institution_id: INSTITUTION,
    human_id: HUMAN,
    action: "kernel.bootstrap",
    source_subsystem: "kernel",
    permission: "runtime.execute",
  });

  kernelRuntime.health.measure({ institution_id: INSTITUTION });

  return true;
}
