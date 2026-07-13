# Autonomous Institutional Operations — CAE-11.7-W12 (LIX-012)

**Principle:** Authority is delegated intentionally. Automation is earned. Oversight never disappears.

## Services (12)

WorkflowRegistryService · WorkflowEngine · ApprovalService · AutomationPermissionService · PlaybookService · LongRunningWorkflowService · ExceptionRecoveryService · AutomationScheduler · IntegrationService · HumanInterventionService · AutomationAnalyticsService · OperationalGovernanceService

## APIs

| Method | Path |
|--------|------|
| GET | `/api/v1/localbrain/automation` |
| GET | `/api/v1/localbrain/automation/workflows` |
| GET | `/api/v1/localbrain/automation/approvals` |
| GET | `/api/v1/localbrain/automation/operations` |
| GET | `/api/v1/localbrain/automation/playbooks` |
| POST | `/api/v1/localbrain/automation/workflow/start` |
| POST | `/api/v1/localbrain/automation/workflow/pause` |
| POST | `/api/v1/localbrain/automation/workflow/resume` |
| POST | `/api/v1/localbrain/automation/workflow/cancel` |
| POST | `/api/v1/localbrain/automation/workflow/approve` |

```bash
npm run phase11:11.7:w12
npm run automation:validate
```
