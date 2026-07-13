# AI Multi-Agent Runtime — CAE-11.7-W9 (LIX-009)

**Principle:** Many specialized agents. One coordinated answer. One Human decision-maker.

## Services (12)

AgentRegistryService · AgentOrchestrator · CapabilityService · AgentCommunicationService · EvidenceBusService · ConflictResolutionService · ConsensusService · HumanReviewService · AgentMemoryService · MarketplaceService · IntegrationService · AgentGovernanceService

## APIs

| Method | Path |
|--------|------|
| GET | `/api/v1/localbrain/agents` |
| GET | `/api/v1/localbrain/agents/registry` |
| GET | `/api/v1/localbrain/agents/tasks` |
| GET | `/api/v1/localbrain/agents/evidence` |
| GET | `/api/v1/localbrain/agents/conflicts` |
| POST | `/api/v1/localbrain/agents/run` |
| POST | `/api/v1/localbrain/agents/install` |
| POST | `/api/v1/localbrain/agents/retire` |
| POST | `/api/v1/localbrain/agents/consensus` |

```bash
npm run phase11:11.7:w9
npm run agents:validate
```
