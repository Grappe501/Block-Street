import { runKnwW8ProductionTests, allW8TestsPassed } from "../../src/lib/civic-action/builds/11.12/w8-tests";

const results = runKnwW8ProductionTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.12 W8 tests: ${passed} / ${results.length}`);
for (const r of results.filter((t) => !t.passed)) {
  console.error(`FAIL: ${r.name} ${r.detail ?? ""}`);
}
process.exit(allW8TestsPassed() ? 0 : 1);
