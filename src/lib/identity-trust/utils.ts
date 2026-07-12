import { randomBytes } from "crypto";

export function itlId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function generateGlobalHumanId() {
  return `GHID-${randomBytes(6).toString("hex")}`;
}

export function nowIso() {
  return new Date().toISOString();
}
