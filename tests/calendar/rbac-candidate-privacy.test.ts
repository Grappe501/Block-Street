/** CAL-P1.2 — candidate privacy tests */
export const suite = "rbac-candidate-privacy";
export const covers = [
  "public cannot view private",
  "college leader cannot view travel",
  "CM without grant denied",
  "candidate scheduler allowed",
  "public projection strips private fields",
];
