#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const snap = JSON.parse(fs.readFileSync(path.join(ROOT, "data/field-goals/county-field-goals.json"), "utf8"));

const errors = [];
if (!Array.isArray(snap.counties) || snap.counties.length !== 75) {
  errors.push(`Expected 75 counties, got ${snap.counties?.length}`);
}
const slugs = new Set();
const fips = new Set();
for (const c of snap.counties || []) {
  if (!c.county_slug) errors.push("missing county_slug");
  if (slugs.has(c.county_slug)) errors.push(`duplicate slug ${c.county_slug}`);
  slugs.add(c.county_slug);
  if (c.county_fips) {
    if (fips.has(c.county_fips)) errors.push(`duplicate fips ${c.county_fips}`);
    fips.add(c.county_fips);
  }
  if (typeof c.voter_registration_goal !== "number" || c.voter_registration_goal < 0) {
    errors.push(`bad registration goal for ${c.county_slug}`);
  }
  if (typeof c.vci !== "number" || c.vci < 0) errors.push(`bad vci for ${c.county_slug}`);
  const expected = Math.ceil(c.voter_registration_goal * 0.25);
  if (c.institution_sub_goal !== expected) {
    errors.push(`sub-goal mismatch ${c.county_slug}: ${c.institution_sub_goal} != ${expected}`);
  }
  if (!c.source_reference?.registration || !c.source_reference?.vci) {
    errors.push(`missing lineage ${c.county_slug}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("field-goals validation passed: 75 counties");
