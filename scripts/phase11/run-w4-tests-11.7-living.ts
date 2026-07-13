/**
 * CAE-11.7-W4 — Run organizer certification tests
 */
import { runLixW4CertificationTests } from "../../src/lib/civic-action/builds/11.7/living/organizer/w4-tests";

const results = runLixW4CertificationTests();
let failed = 0;
for (const r of results) {
  const status = r.passed ? "PASS" : "FAIL";
  console.log(`${status}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  if (!r.passed) failed++;
}
const passed = results.filter((r) => r.passed).length;
console.log(`11.7 LIX W4 tests: ${passed} / ${results.length}`);
process.exit(failed > 0 ? 1 : 0);
