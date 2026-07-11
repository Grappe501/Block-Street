# Notification Event Registry

**System ID:** NTF-001

| Event Key | Category | Default Priority | Channels |
|-----------|----------|------------------|----------|
| `auth.suspicious_login` | Security | Critical | in_app, email |
| `auth.password_changed` | Security | Urgent | in_app, email |
| `auth.mfa_disabled` | Security | Critical | in_app, email |
| `mission.deadline_approaching` | Mission | Important | in_app, digest |
| `mission.comment` | Mission | Normal | in_app |
| `content.submitted_for_review` | Content | Normal | in_app |
| `content.approved` | Content | Normal | in_app |
| `admin.approval_required` | Administration | Important | in_app, email |
| `campaign.organization_announcement` | Organization | Normal | in_app, email (approval required) |

Emitted events: `notification.requested` · `notification.suppressed` · `notification.sent` · `notification.failed` · `notification.preference_changed`
