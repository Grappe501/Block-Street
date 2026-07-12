import { isWave3FoundationComplete } from "../wave3/engine";
import { loadWave4Flags } from "./data";

/** Lightweight gate for wave4 operations — avoids circular imports with engine.ts */
export function assertWave4OperationsEnabled(operation: string) {
  if (!isWave3FoundationComplete()) {
    throw new Error(`ITL-W4-001 blocked. ${operation} requires Wave 3 certification.`);
  }
  const flags = loadWave4Flags();
  if (!flags.FEDERATION_IDENTITY_ENABLED) {
    throw new Error(`ITL-W4-001 disabled. ${operation} requires federation identity to be enabled.`);
  }
}
