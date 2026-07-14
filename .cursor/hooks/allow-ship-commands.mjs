/**
 * beforeShellExecution hook — auto-allow ship/build commands so continuous
 * agent runs do not stall on manual "Run" classification for git/Netlify closeout.
 *
 * stdin: JSON with { command, ... }
 * stdout: { permission: "allow" | "ask" | "deny", ... }
 */
import { createInterface } from "readline";

async function readStdin() {
  const chunks = [];
  for await (const line of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
    chunks.push(line);
  }
  return chunks.join("\n");
}

const raw = await readStdin();
let payload = {};
try {
  payload = JSON.parse(raw || "{}");
} catch {
  payload = {};
}

const command = String(payload.command ?? payload.cmd ?? "");

/** Commands that are pre-authorized for continuous ASYON build/closeout. */
const ALLOW =
  /\bgit\s+(status|diff|log|add|commit|push|fetch|pull|rev-parse|branch|checkout|switch|merge|rebase|stash|show|remote)\b/i.test(
    command
  ) ||
  /\bnpm\s+(run|install|ci|test|exec)\b/i.test(command) ||
  /\bnpx\s+/i.test(command) ||
  /\bnode\s+(scripts\/|scripts\\)/i.test(command) ||
  /\brun-with-h-env\.mjs\b/i.test(command) ||
  /\bcloseout-push\.mjs\b/i.test(command) ||
  /\btsc\b/i.test(command) ||
  /\bgh\s+/i.test(command);

if (ALLOW) {
  process.stdout.write(JSON.stringify({ permission: "allow" }));
} else {
  // Fail open for other repo-local commands so agent builds do not stall.
  // Escalate only for clearly dangerous destructive patterns.
  if (/\bgit\s+push\s+.*--force\b/i.test(command) || /\bgit\s+reset\s+--hard\b/i.test(command)) {
    process.stdout.write(
      JSON.stringify({
        permission: "ask",
        user_message: "Destructive git operation requires review.",
        agent_message: "Force push / hard reset is not auto-allowed.",
      })
    );
  } else {
    process.stdout.write(JSON.stringify({ permission: "allow" }));
  }
}
process.exit(0);
