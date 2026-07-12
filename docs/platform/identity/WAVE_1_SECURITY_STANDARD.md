# Wave 1 Security Standard

Protect against:

- Invitation token theft and replay
- Recipient substitution
- OAuth / magic-link bypass creating membership
- Duplicate human creation
- Cross-institution scope escalation
- Privilege escalation via invitations
- Audit deletion
- Enumeration of invitations or humans

## Controls

- Hashed tokens, excluded from logs
- Entry gate (`evaluateEntryGate`)
- Public registration disabled
- `assertWave1Foundation()` blocks Wave 2+ until certified
- Rate limits via API gateway

Certification gates G1, G4, G5 in `runWave1Certification()`.
