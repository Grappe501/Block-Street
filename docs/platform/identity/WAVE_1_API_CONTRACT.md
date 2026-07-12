# Wave 1 API Contract

**ITL-W1-001**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/humans` | Wave 1 overview or human by `human_id` |
| GET | `/api/v1/humans?timeline=true` | Identity timeline |
| PATCH | `/api/v1/humans` | Update public identity |
| GET/POST | `/api/v1/invitations/wave1` | Wave 1 invitation lifecycle |
| GET/POST | `/api/v1/sponsors/me` | Sponsor privilege and education |
| GET/POST | `/api/v1/identity/aliases` | Alias requests |
| GET | `/api/v1/identity-trust/wave1/certification` | Wave 1 certification gates |
| GET | `/api/admin/identity/overview` | Institution identity dashboard |

Legacy ITL routes remain at `/api/v1/identity-trust/*`.
