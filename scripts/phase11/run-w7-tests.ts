import { allW7TestsPassed, runIniW7OptimizationTests } from "../../src/lib/civic-action/builds/11.1/w7-tests";

const results = runIniW7OptimizationTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"} ${r.name}${r.detail ? ` (${r.detail})` : ""}`);
}
if (!allW7TestsPassed()) process.exit(1);
console.log("All W7 optimization tests passed");
