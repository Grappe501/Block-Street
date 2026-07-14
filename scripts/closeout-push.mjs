#!/usr/bin/env node
/**
 * Single-command Netlify closeout: stamp productionCommit (if dirty trackers
 * already committed) OR commit pending ship files is caller's job.
 *
 * This script: stamp HEAD short SHA into build-progress, commit stamp if needed, push.
 *
 * Usage (from repo root, via H-env):
 *   node scripts/run-with-h-env.mjs node scripts/closeout-push.mjs
 *   npm run closeout:push
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function shInherit(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const sha = sh("git rev-parse --short HEAD");
const progressPath = path.join(root, "data", "build-progress.json");
const data = JSON.parse(fs.readFileSync(progressPath, "utf8"));
const prev = data.project?.productionCommit;
data.project.productionCommit = sha;
data.project.lastUpdated = new Date().toISOString();
if (!data.project.activeProgram) {
  data.project.activeProgram = `Closeout @${sha}`;
}
fs.writeFileSync(progressPath, JSON.stringify(data, null, 2) + "\n");

const status = sh("git status --porcelain data/build-progress.json");
if (status) {
  shInherit("git add -- data/build-progress.json");
  try {
    shInherit(`git commit -m "chore(admin): stamp productionCommit ${sha}"`);
  } catch {
    /* nothing to commit */
  }
}

console.log(`pushing HEAD (stamped ${sha}, was ${prev ?? "none"})…`);
shInherit("git push origin HEAD");
console.log(`closeout complete → https://block-street.netlify.app/ @ ${sh("git rev-parse --short HEAD")}`);
