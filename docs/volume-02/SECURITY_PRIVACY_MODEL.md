# Build Volume 2.13 — Security & Privacy Data Model

### Data Architecture Bible

**Document ID:** VOLUME-002.13 · **DAB-014**  
**Artifact:** `SECURITY_PRIVACY_MODEL.md`  
**Status:** Canonical  
**Priority:** Critical

**Builds on:** [1.6 Authorization](../volume-01/AUTHORIZATION_ARCHITECTURE.md) [ENG-006 · PRE-001] · [TPS-001](../phase-01/TRUST_PRIVACY_SECURITY_SYSTEM.md)  
**Live spec:** `data/registry/security-privacy-model.json`

---

## DAB-SPM01 — Purpose

**[DAB-SPM01]** Defines identity, consent, audit, permissions, visibility, encryption, data retention, legal holds, and access history — supporting the **Privacy Constitution** [TPS-001].

---

## DAB-SPM02 — Identity Model

**[DAB-SPM02a]** `identity.participants.auth_user_id` → Supabase Auth (canonical identity provider).

**[DAB-SPM02b]** Table: `identity.identity_links (participant_id, provider, external_id, verified_at)`.

**[DAB-SPM02c]** No duplicate identity rows — one participant per auth user V1.

---

## DAB-SPM03 — Consent Records

**[DAB-SPM03a]** Table: `identity.consent_records`:

```text
consent_records (
  id, participant_id, consent_type,
  granted, granted_at, revoked_at,
  policy_version, ip_address, user_agent
)
```

**[DAB-SPM03b]** Types: `terms_of_service`, `privacy_policy`, `ai_assistance`, `analytics`, `marketing`, `mentorship_visibility`.

**[DAB-SPM03c]** Consent checks gate features at service layer [PRE-001].

---

## DAB-SPM04 — Data Classification

**[DAB-SPM04a]** Enum `data_class`: `public`, `community`, `restricted`, `personal` [KDG-001].

**[DAB-SPM04b]** Every entity/table declares default class; overrides per row allowed.

**[DAB-SPM04c]** Drives RLS, search indexing, and AI retrieval filters.

---

## DAB-SPM05 — Visibility Model

**[DAB-SPM05a]** Enum `visibility`: `public`, `network`, `community`, `team`, `private`.

**[DAB-SPM05b]** Visibility × data_class × PRE role = effective access.

**[DAB-SPM05c]** Participant profile fields may be field-level visibility (V1.1 jsonb mask).

---

## DAB-SPM06 — Audit & Access History

**[DAB-SPM06a]** `platform.audit_log` — material mutations [DAB-SCH05].

**[DAB-SPM06b]** Table: `platform.access_log` — sensitive reads (exports, bulk queries, admin views):

```text
access_log (id, actor_id, resource_type, resource_id, action, ip, created_at)
```

**[DAB-SPM06c]** Retention: audit 7 years; access log 1 year default.

---

## DAB-SPM07 — Encryption

**[DAB-SPM07a]** At rest: Supabase/Postgres provider encryption.

**[DAB-SPM07b]** In transit: TLS everywhere.

**[DAB-SPM07c]** Application-level encryption for highly sensitive fields (optional V1.1): `encrypted_json` column with KMS key id.

---

## DAB-SPM08 — Data Retention

**[DAB-SPM08a]** Table: `config.retention_policies (entity_type, retention_days, archive_action)`.

**[DAB-SPM08b]** Defaults:

| Data | Retention |
|------|-----------|
| Participant (active) | indefinite while active |
| Participant (deleted) | 30-day grace → anonymize |
| Domain events | 7 years |
| Audit log | 7 years |
| AI interactions | 2 years |
| Access log | 1 year |

**[DAB-SPM08c]** Anonymization replaces PII with irreversible tokens — preserves aggregate analytics.

---

## DAB-SPM09 — Legal Holds

**[DAB-SPM09a]** Table: `platform.legal_holds (id, scope_type, scope_id, reason, hold_until, created_by)`.

**[DAB-SPM09b]** Blocks deletion/anonymization for affected records until released.

---

## DAB-SPM10 — GDPR / Erasure

**[DAB-SPM10a]** Erasure request workflow: verify identity → legal hold check → anonymize participant → redact events (metadata flag) → purge derived indexes.

**[DAB-SPM10b]** Graph/search/AI projections rebuilt excluding erased participant.

---

## AC-119 — Acceptance Criteria

- [x] **[AC-119a]** Identity and consent models documented. `[DAB-SPM02, SPM03]`
- [x] **[AC-119b]** Data classification, visibility, and audit defined. `[DAB-SPM04–SPM06]`
- [x] **[AC-119c]** Encryption, retention, legal holds, and erasure specified. `[DAB-SPM07–SPM10]`

---

**Next step:** [2.14 — Master Data Dictionary & Governance](MASTER_DATA_DICTIONARY.md) [DAB-015]

**End of Volume 2.13.**
