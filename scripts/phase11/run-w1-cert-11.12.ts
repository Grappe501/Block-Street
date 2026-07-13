import { runKnwW1Certification } from "../../src/lib/civic-action/builds/11.12/w1";

const cert = runKnwW1Certification();
for (const g of cert.gates) {
  console.log(`${g.passed ? "PASS" : "FAIL"} ${g.id} ${g.name}`);
}
if (!cert.all_passed) process.exit(1);
console.log("W1 certification passed");
