import { runKnwW5ApiTests } from "../../src/lib/civic-action/builds/11.12/w5-tests";

const results = runKnwW5ApiTests();
const failed = results.filter((r) => !r.passed);
for (const f of failed) console.error("FAIL:", f.name, f.detail ?? "");
console.log("11.12 W5 tests:", results.filter((r) => r.passed).length, "/", results.length);
process.exit(failed.length ? 1 : 0);
