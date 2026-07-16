#!/usr/bin/env node
import "../h-drive-env.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const srcDir = path.join(ROOT, "src");
const forbidden = [];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const apiAndLib = walk(path.join(srcDir, "lib/civic-resources")).concat(
  walk(path.join(srcDir, "app/api/civic-resources")),
);

const forbiddenStorage = [/store.*ssn/i, /capture.*form/i, /prefill/i, /iframe/i, /proxy.*jotform/i];

for (const file of apiAndLib) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of forbiddenStorage) {
    assert.ok(!pattern.test(text), `privacy violation pattern ${pattern} in ${file}`);
  }
}

const registry = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/registry/external-civic-resources.json"), "utf8"),
);
const form = registry.resources.find((r) => r.resourceKey === "get-loud-easy-application");
assert.equal(form.blockStreetReceivesData, false);
assert.equal(form.collectsSensitiveInformation, true);

console.log("test:get-loud-privacy-boundary — passed");
