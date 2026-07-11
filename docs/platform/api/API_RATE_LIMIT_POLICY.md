# API Rate Limit Policy

**System ID:** API-001

Tiers: Public Anonymous (low) · Authenticated User (standard) · Organization Integration (contracted) · Internal Service (service-specific). Response code `429` with `RATE_LIMITED` error. Security-critical endpoints use separate quotas.
