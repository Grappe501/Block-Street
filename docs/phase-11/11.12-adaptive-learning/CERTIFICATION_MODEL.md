# Certification Model

**Protocol:** CAE-11.12-W2

## Certification

Declares requirements (`requirement_ids`), linked competencies and courses, expiration policy, and `issuing_authority_human_id`.

Lifecycle: `draft → review → active → suspended → expired → archived`

## CertificationAward

Granted to human when `requirements_met` is true and `awarded_by_human_id` is recorded.

**Rules:**
- AI cannot award certifications (W1 doctrine)
- Award in `awarded` state requires `requirements_met: true`
- Expiration tracked via `expires_at`

Validation codes: `KNW-V-040` through `KNW-V-045`.
