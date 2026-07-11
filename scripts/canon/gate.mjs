#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const gates = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "..", "canon", "validators", "gates.json"), "utf8")
);

console.log("Canon Validation Gates");
for (const gate of gates.gates) {
  console.log(`  Gate ${gate.id}: ${gate.name} (${gate.rule})`);
}
