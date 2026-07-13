import { runKnwW6IntelligenceTests, allW6TestsPassed } from "../../src/lib/civic-action/builds/11.12/w6-tests";

const results = runKnwW6IntelligenceTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.12 W6 tests: ${passed} / ${results.length}`);
for (const r of results.filter((t) => !t.passed)) {
  console.error(`FAIL: ${r.name} ${r.detail ?? ""}`);
}
process.exit(allW6TestsPassed() ? 0 : 1);
