import { runObjW6IntelligenceTests, allW6TestsPassed } from "../../src/lib/civic-action/builds/11.2/w6-tests";

const results = runObjW6IntelligenceTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.2 W6 tests: ${passed} / ${results.length}`);
for (const r of results) {
  if (!r.passed) console.error(`  FAIL ${r.name}: ${r.detail ?? ""}`);
}
if (!allW6TestsPassed()) process.exit(1);
