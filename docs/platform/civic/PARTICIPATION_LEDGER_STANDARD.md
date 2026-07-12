# Participation Ledger Standard

**System ID:** CIV-001

Every meaningful activity creates a canonical `ParticipationEvent` with:

- Identity: `user_id`, `institution_id`, `organization_id`, `community_id`, `county_id`
- Classification: `event_type`, `category`, `source_system`
- Measurement: `impact_weight`, `duration_minutes`, `verification_status`
- Governance: `privacy_level`, `evidence_reference`

Verification levels: self_reported → peer_verified → leader_verified → system_verified → automatically_recorded.

**API:** `POST /api/v1/civic/participation`
