import { runKnwW4ExperienceTests, allW4TestsPassed } from "../../src/lib/civic-action/builds/11.12/w4-tests";

const results = runKnwW4ExperienceTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.12 W4 tests: ${passed} / ${results.length}`);
for (const r of results.filter((t) => !t.passed)) {
  console.error(`FAIL: ${r.name} ${r.detail ?? ""}`);
}
process.exit(allW4TestsPassed() ? 0 : 1);
