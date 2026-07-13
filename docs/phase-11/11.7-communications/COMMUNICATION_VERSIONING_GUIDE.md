# Communication Versioning Guide

## API Contract

`COMMUNICATION_API_CONTRACT_VERSION = "11.7-w5.1"` returned in all API meta blocks.

## Event Schema Versions

Each catalog entry includes `version: 1`. Breaking payload changes require new version with dual-write migration period.

## Command Envelope

`expected_version_optional` supports optimistic concurrency on mutations.

## Catalog Version

`communication_event_catalog.json` carries `catalog_version: "11.7-w5.1"`.
