/**
 * CAE-11.1-W3 — Initiative Application Service
 */
import type { InitiativeCommandEnvelope, InitiativeCommandResult } from "./commands";
import { initiativeDomainService } from "./domain-service";
import { validateCharter } from "./charter-validator";
import { evaluateDependencyReadiness } from "./dependency-graph";
import { ensureCanonicalInitiativeStore, loadInitiativeAggregate, listCanonicalInitiativeIds } from "./repository";

export class InitiativeApplicationService {
  executeCommand(envelope: InitiativeCommandEnvelope, permissions?: string[]): InitiativeCommandResult {
    ensureCanonicalInitiativeStore();
    return initiativeDomainService.execute(envelope, permissions);
  }

  getAggregate(initiativeId: string) {
    ensureCanonicalInitiativeStore();
    return loadInitiativeAggregate(initiativeId);
  }

  listInitiativeIds() {
    ensureCanonicalInitiativeStore();
    return listCanonicalInitiativeIds();
  }

  getActivationReadiness(initiativeId: string) {
    const agg = loadInitiativeAggregate(initiativeId);
    if (!agg) return null;
    const charter = validateCharter(agg, "activation");
    const deps = evaluateDependencyReadiness(initiativeId, agg.dependencies);
    return {
      initiative_id: initiativeId,
      ready: charter.is_valid && deps.ready,
      charter,
      dependencies: deps,
      status: agg.initiative.status,
      evaluated_at: new Date().toISOString(),
    };
  }
}

export const initiativeApplicationService = new InitiativeApplicationService();
