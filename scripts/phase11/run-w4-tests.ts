import { runIniW4ExperienceTests, allW4TestsPassed } from "../../src/lib/civic-action/builds/11.1/w4-tests";

const results = runIniW4ExperienceTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
if (!allW4TestsPassed()) process.exit(1);
console.log("All W4 experience tests passed");
