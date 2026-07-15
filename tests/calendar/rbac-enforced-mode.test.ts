/** CAL-P1.2 — enforced mode readiness (must remain blocked while Gate A OPEN) */
export const suite = "rbac-enforced-mode";
export const covers = [
  "should_block remains false while Gate A OPEN even if CALENDAR_RBAC_MODE=enforced",
  "Gate A CLOSED required for enforcement",
];
