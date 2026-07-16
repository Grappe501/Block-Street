#!/usr/bin/env node
import "../h-drive-env.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const registry = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/registry/external-civic-resources.json"), "utf8"),
);
const form = registry.resources.find((r) => r.resourceKey === "get-loud-easy-application");

const url = new URL(form.url);
assert.equal(url.hostname, "form.jotform.com");
assert.equal(url.search, "");
assert.equal(url.hash, "");

const qrRoute = fs.readFileSync(path.join(ROOT, "src/app/api/civic-resources/qr/route.ts"), "utf8");
assert.match(qrRoute, /assertSafeQrUrl/);
assert.doesNotMatch(qrRoute, /searchParams\.get\("(?!resource)/);

console.log("test:get-loud-qr — passed");
