# Phase 4 — Signup + Personal Network Board

**Status:** Complete · 2026-07-14  
**Goal:** Each participant gets a profile, share link, QR code, and basic "my network" dashboard.

## Steps

| # | Step | Status | Notes |
|---|------|--------|-------|
| 4.1 | Signup form (name, email, campus/county, interests) | Done | V1 = invitation accept + choose-place (open signup stays gated) |
| 4.2 | Generate unique user slug | Done | `src/lib/network` allocateUniqueSlug |
| 4.3 | Generate share link | Done | `/s/{slug}` |
| 4.4 | Generate QR code | Done | `/api/network/qr` downloadable PNG |
| 4.5 | Referral attribution (referred_by) | Done | Cookie `bs_referred_by` on share visit → stored on accept |
| 4.6 | Personal network board `/network` | Done | Default post-home participant surface |
| 4.7 | Show people invited | Done | Sponsor + referral members on board |
| 4.8 | Network growth stats | Done | Board + admin participants growth strip |
| 4.9 | Copy link + download QR actions | Done | Network board UI |
| 4.10 | Admin dashboard: signup metrics | Done | `/api/admin/users` growth payload |

## Deliverables

- [x] Working signup flow end-to-end (invite-primary)
- [x] Personal share links and QR codes
- [x] Network board with invited members
- [x] Referral attribution on Blobs (not Postgres)

## Exit Criteria

Steve can accept/create invites, open `/s/steve-grappe`, share QR, and see friends who joined through his link.
