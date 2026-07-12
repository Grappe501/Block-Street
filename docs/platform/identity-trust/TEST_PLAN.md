# Identity Trust Test Plan

**System ID:** ITF-001 · **Acceptance:** AC-ITF-001

## Acceptance Flow

1. ITL enabled; invitation-only mode active
2. Trusted member creates invitation with sponsor agreement
3. Invitee registers via `POST /api/v1/identity-trust/register` with invitation token
4. Human identity created at Sponsored level (level 1)
5. Independent verification recorded by non-sponsor
6. Public badge shows "Sponsored Member" or "Verified Human" — never verifier details
7. Invite tree traces ancestry from sponsor
8. Identity review opened for suspected fake — outcomes tested
9. Sponsor accountability detects multiple flagged invites
10. Audit lineage records full invitation → identity → verification chain

## Admin Demo

Run **AC-ITF-001 acceptance demo** in Admin → Platform Phase 8 → Identity Trust Layer.

## Negative Cases

- Registration without invitation → rejected
- Sponsor agreement not accepted → invitation rejected
- Anonymous public name (e.g. Patriot1776) → rejected unless known alias approved
- Self-verification → rejected
- Invite quota exceeded → rejected
