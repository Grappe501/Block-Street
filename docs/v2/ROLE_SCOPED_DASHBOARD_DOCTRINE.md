# Role-Scoped Dashboard Doctrine

**Accepted:** V2-A.3

> What does this person need to know and do because of the position they hold?

## Rules

1. Compose navigation and widgets from `data/volunteer-command/dashboard-config-registry.json` + role registry.
2. Higher roles may see rollups from subordinate commands.
3. Lower roles never receive unrelated or statewide personnel chrome by default.
4. Architecture / Build Control / Engineer surfaces stay out of Volunteer Command nav.
5. Director inspection is labeled, read-only by default, and non-impersonating.

## Examples

| Role | Sees |
|------|------|
| General volunteer | Own assignments and campus/county opportunities |
| Campus / functional lead | Committee, goals, events for that assignment |
| College Leader | Goal-scope post-secondary colleges; HS/trade/tech/private as bonus |
| Volunteer Manager | County + education + functional people systems |
| Director | Complete platform (inspect) |
