# API Versioning Guide

## Current Version

`/api/v1/objectives` — contract `11.2-w5.1`

## Rules

- Breaking changes require a new major version (`/v2/`).
- Existing contracts remain stable within a major version.
- Response `meta.contract_version` identifies the handler contract.

## Deprecation

Legacy `/api/v1/civic-action/objectives/commands` shim delegates to W5; new clients should use `/api/v1/objectives/commands`.
