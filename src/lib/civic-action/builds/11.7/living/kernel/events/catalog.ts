/**
 * CAE-11.7-W15 — Kernel events
 */
export const KERNEL_EVENT_CATALOG = [
  { event: "kernel.started", domain: "kernel", description: "Constitutional kernel started for institution" },
  { event: "runtime.executed", domain: "runtime", description: "Request completed universal runtime path" },
  { event: "policy.applied", domain: "policy", description: "Executable policy applied to action" },
  { event: "permission.denied", domain: "permission", description: "Permission evaluation denied action" },
  { event: "permission.granted", domain: "permission", description: "Permission evaluation granted action" },
  { event: "state.changed", domain: "state", description: "Institutional state snapshot updated" },
  { event: "health.updated", domain: "health", description: "Kernel health metrics refreshed" },
  { event: "constitution.amended", domain: "constitution", description: "Governed constitutional amendment applied" },
] as const;
