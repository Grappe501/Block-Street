import { runObjW5ApiTests, allW5TestsPassed } from "../../src/lib/civic-action/builds/11.2/w5-tests";

const results = runObjW5ApiTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.2 W5 tests: ${passed} / ${results.length}`);
for (const r of results) {
  if (!r.passed) console.error(`  FAIL ${r.name}: ${r.detail ?? ""}`);
}
if (!allW5TestsPassed()) process.exit(1);
