import { runIniW6IntelligenceTests, allW6TestsPassed } from "../../src/lib/civic-action/builds/11.1/w6-tests";

const results = runIniW6IntelligenceTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
if (!allW6TestsPassed()) process.exit(1);
console.log("All W6 intelligence tests passed");
