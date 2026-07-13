/**
 * CAE-11.7-W10 — Run partnership certification tests
 */
import { runLixW10CertificationTests } from "../../src/lib/civic-action/builds/11.7/living/partnership/w10-tests";

const results = runLixW10CertificationTests();
let failed = 0;
for (const r of results) {
  const status = r.passed ? "PASS" : "FAIL";
  console.log(`${status}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
  if (!r.passed) failed++;
}
const passed = results.filter((r) => r.passed).length;
console.log(`11.7 LIX W10 tests: ${passed} / ${results.length}`);
process.exit(failed > 0 ? 1 : 0);
