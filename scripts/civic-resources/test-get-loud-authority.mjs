#!/usr/bin/env node
import "../h-drive-env.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const registryText = fs.readFileSync(path.join(ROOT, "data/registry/external-civic-resources.json"), "utf8");
assert.doesNotMatch(registryText, /"url"\s*:\s*"http:\/\/form\.jotform/);

const card = fs.readFileSync(
  path.join(ROOT, "src/components/civic-resources/GetLoudRegistrationResourceCard.tsx"),
  "utf8",
);
assert.doesNotMatch(card, /edit.*resource/i);
assert.match(card, /unavailable/i);

console.log("test:get-loud-authority — passed");
