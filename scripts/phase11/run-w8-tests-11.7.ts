import { runComW8ProductionTests, allW8TestsPassed } from "../../src/lib/civic-action/builds/11.7/w8-tests";

const results = runComW8ProductionTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"} ${r.name}${r.detail ? ` (${r.detail})` : ""}`);
}
if (!allW8TestsPassed()) process.exit(1);
console.log("All W8 production tests passed");
