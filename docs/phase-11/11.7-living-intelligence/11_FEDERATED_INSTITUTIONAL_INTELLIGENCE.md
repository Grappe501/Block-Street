# Federated Institutional Intelligence — CAE-11.7-W11 (LIX-011)

**Principle:** Federation without centralization. Collaboration without loss of sovereignty.

## Services (12)

FederationService · InstitutionRegistryService · SovereigntyService · TrustFrameworkService · CoalitionService · SharedMissionService · KnowledgeExchangeService · SharedResourceService · FederatedSearchService · CrossInstitutionIdentityService · FederationGovernanceService · FederationAuditService

## APIs

| Method | Path |
|--------|------|
| GET | `/api/v1/localbrain/federation` |
| GET | `/api/v1/localbrain/federation/institutions` |
| GET | `/api/v1/localbrain/federation/coalitions` |
| GET | `/api/v1/localbrain/federation/shared-missions` |
| GET | `/api/v1/localbrain/federation/shared-knowledge` |
| GET | `/api/v1/localbrain/federation/partners` |
| POST | `/api/v1/localbrain/federation/institution/join` |
| POST | `/api/v1/localbrain/federation/institution/share` |
| POST | `/api/v1/localbrain/federation/coalition/create` |
| POST | `/api/v1/localbrain/federation/trust/update` |
| POST | `/api/v1/localbrain/federation/knowledge/publish` |

```bash
npm run phase11:11.7:w11
npm run federation:validate
```
