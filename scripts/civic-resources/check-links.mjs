#!/usr/bin/env node
import "../h-drive-env.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const REGISTRY = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/registry/external-civic-resources.json"), "utf8"),
);

const CHECK_KEYS = [
  "get-loud-arkansas-homepage",
  "get-loud-easy-application",
  "arkansas-sos-voter-registration",
  "arkansas-voterview",
];

const results = [];

for (const key of CHECK_KEYS) {
  const resource = REGISTRY.resources.find((r) => r.resourceKey === key);
  if (!resource) {
    results.push({ resourceKey: key, status: "missing", httpStatus: null });
    continue;
  }
  try {
    const headers = { "User-Agent": "Block-Street-CivicResourceChecker/1.0" };
    let res = await fetch(resource.url, { method: "GET", redirect: "follow", headers });
    const expectedHost = new URL(resource.url).hostname;
    const finalHost = res.url ? new URL(res.url).hostname : expectedHost;
    results.push({
      resourceKey: key,
      url: resource.url,
      lastCheckedAt: new Date().toISOString(),
      httpStatus: res.status,
      redirectDestination: res.url !== resource.url ? res.url : null,
      expectedDomain: expectedHost,
      finalDomain: finalHost,
      status: res.ok ? "ok" : "error",
    });
  } catch (error) {
    results.push({
      resourceKey: key,
      url: resource.url,
      lastCheckedAt: new Date().toISOString(),
      httpStatus: null,
      status: key === "arkansas-voterview" ? "needs_review" : "error",
      error: error.message,
    });
  }
}

const outPath = path.join(ROOT, "data/civic-education/get-loud-link-health.json");
fs.writeFileSync(outPath, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));

console.log("civic-resources:check");
for (const row of results) {
  console.log(`  ${row.status.padEnd(6)} ${row.resourceKey} ${row.httpStatus ?? "ERR"}`);
}
const failed = results.filter((r) => r.status === "error");
process.exit(failed.length ? 1 : 0);
