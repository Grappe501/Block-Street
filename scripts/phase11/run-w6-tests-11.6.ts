import { allOpsW6TestsPassed, runOpsW6CalendarTests } from "../../src/lib/civic-action/builds/11.6/calendar/w6-tests";

const results = runOpsW6CalendarTests();
for (const r of results) {
  console.log(`${r.passed ? "PASS" : "FAIL"}: ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`11.6 W6 tests: ${results.filter((r) => r.passed).length} / ${results.length}`);
process.exit(allOpsW6TestsPassed() ? 0 : 1);
