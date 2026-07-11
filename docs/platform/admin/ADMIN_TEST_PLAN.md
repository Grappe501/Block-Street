# Administration Test Plan

## Boundary Tests

- Organization admin cannot access other organizations
- Workspace admin cannot change org policy
- Administrators cannot expand own authority
- Approval requester cannot self-approve
- Expired role assignments stop working
- Client-side route access does not bypass server permissions

## Acceptance Flow

Platform admin creates org → assigns org admin → workspace created → custom role with preview → approval-gated export → audit trail complete.
