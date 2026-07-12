import { isWave5FoundationComplete } from "../wave5/engine";
import { loadWave6Flags } from "./data";

export function assertWave6OperationsEnabled(operation: string) {
  if (!isWave5FoundationComplete()) {
    throw new Error(`ITL-W6-001 blocked. ${operation} requires Wave 5 certification.`);
  }
  const flags = loadWave6Flags();
  if (!flags.IDENTITY_OPERATIONS_CENTER_ENABLED) {
    throw new Error(`ITL-W6-001 disabled. ${operation} requires identity operations to be enabled.`);
  }
}
