# Get Loud Content Freshness Runbook

1. Run `npm run civic-resources:check` monthly (form: every 30 days per registry).
2. Review `data/civic-education/get-loud-source-inventory.json` conflicts.
3. Never import election dates from Get Loud Spanish pages.
4. If form unavailable: set resource `status: temporarily_hidden` — QR hides automatically.
5. URL changes require audit record and admin update to registry only.

Status labels: Current · Review due · Source changed · Potential conflict · Temporarily hidden
