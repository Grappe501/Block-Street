#!/usr/bin/env node
import "../h-drive-env.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");

const education = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/civic-education/get-loud-arkansas.json"), "utf8"),
);
const registry = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/registry/external-civic-resources.json"), "utf8"),
);

const form = registry.resources.find((r) => r.resourceKey === "get-loud-easy-application");
assert.equal(form.url, "https://form.jotform.com/222275227390050");
assert.equal(education.registrationTool.isOnlineRegistrationPortal, false);
assert.equal(education.registrationTool.blockStreetReceivesData, false);
assert.ok(education.auditFlags.some((f) => f.id === "application-delivery-inconsistency"));
assert.ok(education.auditFlags.some((f) => f.id === "spanish-content-staleness"));

const lang = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/civic-education/get-loud-language-support.json"), "utf8"),
);
const langText = JSON.stringify(lang.blockStreetCopy);
assert.doesNotMatch(langText, /2022/);

console.log("test:get-loud-resource — passed");
