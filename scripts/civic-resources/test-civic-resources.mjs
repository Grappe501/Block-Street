#!/usr/bin/env node
import "../h-drive-env.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const required = [
  "data/registry/external-civic-resources.json",
  "data/civic-education/get-loud-arkansas.json",
  "data/civic-education/get-loud-source-inventory.json",
  "data/civic-education/get-loud-language-support.json",
  "data/training/get-loud-training-bindings.json",
];

for (const f of required) {
  assert.ok(fs.existsSync(path.join(ROOT, f)), `missing ${f}`);
}

const registry = JSON.parse(fs.readFileSync(path.join(ROOT, required[0]), "utf8"));
assert.ok(registry.resources.length >= 4, "registry needs core resources");
assert.equal(registry.resources.find((r) => r.resourceKey === "get-loud-easy-application")?.blockStreetReceivesData, false);

console.log("test:civic-resources — passed");
