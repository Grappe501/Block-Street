import { runObjW3ServiceTests } from "../../src/lib/civic-action/builds/11.2/w3-tests";

const results = runObjW3ServiceTests();
const failed = results.filter((r) => !r.passed);
for (const f of failed) console.error("FAIL:", f.name, f.detail ?? "");
console.log("11.2 W3 tests:", results.filter((r) => r.passed).length, "/", results.length);
process.exit(failed.length ? 1 : 0);
