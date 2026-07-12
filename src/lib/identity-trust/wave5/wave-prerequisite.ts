import { isWave4FoundationComplete } from "../wave4/engine";
import { loadWave5Flags } from "./data";

export function assertWave5OperationsEnabled(operation: string) {
  if (!isWave4FoundationComplete()) {
    throw new Error(`ITL-W5-001 blocked. ${operation} requires Wave 4 certification.`);
  }
  const flags = loadWave5Flags();
  if (!flags.IDENTITY_INTELLIGENCE_ENABLED) {
    throw new Error(`ITL-W5-001 disabled. ${operation} requires identity intelligence to be enabled.`);
  }
}
