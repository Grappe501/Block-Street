/**
 * Rotate bootstrap password hashes in data/auth/users.json.
 * Usage (never commit the password):
 *   AUTH_BOOTSTRAP_PASSWORD='...' npx tsx scripts/rotate-bootstrap-password.ts
 */
import fs from "node:fs";
import path from "node:path";
import { hashPassword } from "../src/lib/auth/crypto";

const password = process.env.AUTH_BOOTSTRAP_PASSWORD;
if (!password) {
  console.error("Set AUTH_BOOTSTRAP_PASSWORD in the environment before running this script.");
  process.exit(1);
}

const usersPath = path.join(process.cwd(), "data", "auth", "users.json");
const data = JSON.parse(fs.readFileSync(usersPath, "utf8")) as {
  users: Array<{ user_id: string; password_hash: string | null; primary_email: string }>;
};

const hash = hashPassword(password);
let updated = 0;
for (const user of data.users) {
  if (user.password_hash === hash) continue;
  user.password_hash = hash;
  updated += 1;
}

fs.writeFileSync(usersPath, JSON.stringify(data, null, 2) + "\n");
console.log(`rotated password hash for ${updated} user(s) in data/auth/users.json`);
