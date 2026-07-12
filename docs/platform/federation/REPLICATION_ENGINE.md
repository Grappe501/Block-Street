# Replication Engine

**System ID:** FED-001

## Process

Select Template → Configure Institution → Review Differences → Provision → Customize → Activate → Operate

## Replication Rules

Replicated institutions receive new identity, organization IDs, workspaces, permissions, and audit history. They do **not** inherit private user accounts, historical audit logs, personal communications, or sensitive records.

**API:** `POST /api/v1/federation/replicate`
