import { runIniW3ServiceTests } from "../../src/lib/civic-action/builds/11.1/w3-tests";

const results = runIniW3ServiceTests();
const failed = results.filter((r) => !r.passed);
for (const f of failed) console.error("FAIL:", f.name, f.detail ?? "");
console.log("W3 tests:", results.filter((r) => r.passed).length, "/", results.length);
process.exit(failed.length ? 1 : 0);
