# Certification Services

**Protocol:** CAE-11.12-W3

## Commands

- `CreateCertification`, `EvaluateCertificationEligibility`, `AwardCertification`, `RenewCertification`, `RevokeCertification`

## Requirements gate

`AwardCertification` blocked when certification has `competency_ids`, `course_ids`, or `requirement_ids` unless eligibility verified (`CERTIFICATION_REQUIREMENTS_UNMET`).

## Authority

Certifications require human issuing authority. AI cannot award certifications (`KNOWLEDGE_AI_CERTIFY_FORBIDDEN`).

## Services

`CertificationDefinitionService`, `CertificationEligibilityService`, `CertificationAwardService`, `CertificationRequirementService`
