import { runObjW2ModelTests } from "../../src/lib/civic-action/builds/11.2/w2-tests";

const results = runObjW2ModelTests();
const failed = results.filter((r) => !r.passed);
for (const f of failed) console.error("FAIL:", f.name, f.detail ?? "");
console.log("W2 tests:", results.filter((r) => r.passed).length, "/", results.length);
process.exit(failed.length ? 1 : 0);
