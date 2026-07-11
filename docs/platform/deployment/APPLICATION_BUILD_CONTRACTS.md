# Application Build Contracts

**System ID:** DPL-001

## Block Street (block-street)

| Field | Value |
|-------|-------|
| application_id | `app-block-street` |
| repository | Grappe501/Block-Street |
| package_manager | npm |
| install_command | `npm ci` |
| build_command | `npm run build` |
| lint | `npm run lint` |
| typecheck | `npx tsc --noEmit` |
| output | `.next` (Netlify plugin) |
| runtime | Node 22 |
| health_check | `GET /api/v1/health` |
| rollback_strategy | Netlify deploy rollback + artifact promotion |

Required env: `SESSION_SECRET` (production) · Optional: `AUTH_SESSION_HOURS`
