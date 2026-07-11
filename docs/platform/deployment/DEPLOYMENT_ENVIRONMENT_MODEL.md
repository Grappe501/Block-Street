# Deployment Environment Model

**System ID:** DPL-001

| Environment | Purpose | Data | Communications |
|-------------|---------|------|----------------|
| local | Developer iteration | Local/mock | Mock |
| test | CI automation | Synthetic | None |
| preview | PR review | Synthetic | No-send |
| staging | Release rehearsal | Synthetic | Sandbox |
| production | Live operations | Real | Live providers |

Each environment exposes: `environment`, `release_version`, `commit_sha`, `build_id`, `deployed_at`
