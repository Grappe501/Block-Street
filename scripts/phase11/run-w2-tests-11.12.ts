import { runKnwW2Certification } from "../../src/lib/civic-action/builds/11.12/w2";
import { runKnwW2ModelTests } from "../../src/lib/civic-action/builds/11.12/w2-tests";

const cert = runKnwW2Certification();
for (const g of cert.gates) {
  console.log(`${g.passed ? "PASS" : "FAIL"} ${g.id} ${g.name}`);
}
if (!cert.all_passed) process.exit(1);

const results = runKnwW2ModelTests();
const failed = results.filter((r) => !r.passed);
for (const f of failed) console.error("FAIL:", f.name, f.detail ?? "");
console.log("W2 tests:", results.filter((r) => r.passed).length, "/", results.length);
if (failed.length) process.exit(1);
console.log("W2 certification and tests passed");
