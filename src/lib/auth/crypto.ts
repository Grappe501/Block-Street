import { createHash } from "crypto";

export function hashSecret(value: string): string {
  return createHash("sha256").update(`cos-v1:${value}`).digest("hex");
}

export function hashPassword(password: string): string {
  return hashSecret(password);
}
