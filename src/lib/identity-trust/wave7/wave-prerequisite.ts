import { isWave7FoundationComplete, runWave7Certification } from "./engine";
import { loadWave7Certification } from "./engine";
import { isWave6FoundationComplete } from "../wave6/engine";

export { isWave7FoundationComplete, runWave7Certification, loadWave7Certification };

export function assertWave7OperationsEnabled(operation: string) {
  if (!isWave6FoundationComplete()) {
    throw new Error(`ITL-W7-001 blocked. ${operation} requires Wave 6 certification.`);
  }
  if (!isWave7FoundationComplete()) {
    throw new Error(`ITL-W7-001 operations blocked. ${operation} requires Wave 7 certification.`);
  }
}
