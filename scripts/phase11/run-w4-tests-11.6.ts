import { runOpsW4OrganizationTests, allOpsW4TestsPassed } from "../../src/lib/civic-action/builds/11.6/organization/w4-tests";

const results = runOpsW4OrganizationTests();
const passed = results.filter((r) => r.passed).length;
console.log(`11.6 W4 tests: ${passed} / ${results.length}`);
for (const r of results) {
  if (!r.passed) console.error(`FAIL ${r.name}${r.detail ? `: ${r.detail}` : ""}`);
}
process.exit(allOpsW4TestsPassed() ? 0 : 1);
