/**
 * CAE-11.12-W8 — Release identity binding
 */
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { caeId, nowIso } from "../../../utils";
import { KNOWLEDGE_API_CONTRACT_VERSION } from "../api/contracts";
import { KNOWLEDGE_PRODUCTION_CONTRACT_VERSION } from "./contracts";
import type { ReleaseIdentity } from "./contracts";

const ROOT = process.cwd();

function safeGit(command: string, fallback: string): string {
  try {
    return execSync(command, { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
}

export function buildKnowledgeReleaseIdentity(environment = "production"): ReleaseIdentity {
  let application_version = "unknown";
  try {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    application_version = pkg.version ?? application_version;
  } catch {
    /* ignore */
  }

  return {
    release_id: caeId("rel"),
    application_version,
    git_commit_hash: safeGit("git rev-parse HEAD", "unknown"),
    branch: safeGit("git rev-parse --abbrev-ref HEAD", "unknown"),
    contract_versions: {
      knowledge_api: KNOWLEDGE_API_CONTRACT_VERSION,
      knowledge_production: KNOWLEDGE_PRODUCTION_CONTRACT_VERSION,
      workspace: "11.12-w4.1",
    },
    environment,
    deployment_target: process.env.DEPLOYMENT_TARGET ?? "netlify",
    certification_started_at: nowIso(),
  };
}
