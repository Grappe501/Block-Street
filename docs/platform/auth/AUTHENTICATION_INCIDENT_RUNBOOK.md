# Authentication Incident Runbook

**System ID:** AUTH-001

## Alert Triggers

- Authentication provider outage
- Sudden login failure spike
- Repeated attacks on administrator accounts
- MFA service failure
- Session storage failure
- Unusual account recovery activity
- Callback configuration errors
- Honor-system route still accessible
- Excessive invitation abuse

## Response Procedures

### Login Failure Spike

1. Check provider status (Google/Microsoft)
2. Review `audit_events.jsonl` for patterns
3. Enable rate limiting / block suspicious IPs at edge
4. Notify security alert recipients

### Compromised Account

1. Suspend account via admin console
2. Revoke all sessions (`logout-all`)
3. Require password reset and MFA re-enrollment
4. Review audit trail for unauthorized actions
5. Notify user

### Session Storage Failure

1. Verify `data/auth/sessions.json` writable
2. Fail closed — deny protected access
3. Restore from backup if corrupted

### Provider Misconfiguration

1. Verify `AUTH_*` env vars and callback URLs
2. Check feature flags in `feature_flags.json`
3. Test OAuth callback manually

## Evidence Preservation

Preserve `audit_events.jsonl` and session records before remediation. Never log passwords, tokens, or recovery codes.

## Contacts

Configure `SECURITY_ALERT_RECIPIENTS` in deployment environment.

## Health Dashboard Metrics

Login success rate · Active sessions · Failed logins · Suspicious attempts · MFA enrollment · Pending/expired invitations · Recovery requests
