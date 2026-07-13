import { runComW2Certification } from "../../src/lib/civic-action/builds/11.7/w2";

const cert = runComW2Certification();
for (const g of cert.gates) {
  console.log(`${g.passed ? "PASS" : "FAIL"} ${g.id} ${g.name}`);
}
if (!cert.all_passed) process.exit(1);
console.log("W2 certification passed");
