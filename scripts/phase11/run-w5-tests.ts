import { runIniW5ApiTests, allW5TestsPassed } from "../../src/lib/civic-action/builds/11.1/w5-tests";

const results = runIniW5ApiTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
if (!allW5TestsPassed()) process.exit(1);
console.log("All W5 API tests passed");
