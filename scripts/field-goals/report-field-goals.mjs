#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const snap = JSON.parse(fs.readFileSync(path.join(ROOT, "data/field-goals/county-field-goals.json"), "utf8"));
const clark = snap.counties.find((c) => c.county_slug === "clark");
console.log(
  JSON.stringify(
    {
      counties: snap.counties.length,
      statewide: snap.statewide_registration_goal,
      clark,
      rule: snap.institution_sub_goal_rule,
    },
    null,
    2
  )
);
