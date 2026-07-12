# Federation API

**System ID:** FED-001

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/api/v1/federation/templates` | federation.view |
| POST | `/api/v1/federation/templates` | federation.publish |
| POST | `/api/v1/federation/replicate` | federation.replicate |
| GET/POST | `/api/v1/federation/membership` | federation.view / federation.manage |
| GET/POST | `/api/v1/federation/resources` | federation.view / federation.publish |
| GET/POST | `/api/v1/federation/benchmarks` | federation.view / federation.manage |
| GET/POST | `/api/v1/federation/knowledge` | federation.view / federation.publish |
| GET/POST | `/api/v1/federation/marketplace` | federation.view / federation.publish |
| GET/POST | `/api/v1/federation/analytics` | federation.view / federation.manage |
| GET | `/api/admin/federation/overview` | admin |
