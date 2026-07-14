# Kelly Grappe Field Strategy Manual — Site

**Route:** `/field-strategy`  
**Version:** 1.0 static presentation  
**Doctrine twin:** `docs/v2/ARKANSAS_VICTORY_FIELD_FRAMEWORK.md`

## Modes

- **Explore:** top nav across 12 sections with drill-down tabs.
- **Presentation:** `/field-strategy/presentation` — 14 screens, keyboard arrows, progress bar.

## Boundaries

Static content only. No accounts, live assignments, mailers, voter files, or APIs.

## Field Platform (standalone)

Statewide production architecture lives in the separate repo
[`Grappe501/regnat-populus-field`](https://github.com/Grappe501/regnat-populus-field)
(Netlify target: `https://regnat-populus-field.netlify.app`).

Block-Street **Field Platform** nav tabs open that site in a second window.
Override with `NEXT_PUBLIC_FIELD_PLATFORM_URL` after the Netlify domain is confirmed.
In-app `/field-strategy` remains available as a local explore/presentation shell.

## Future

Each major page maps to a later operating module (Event Engine → workflow, County Command → live dashboard, etc.).

