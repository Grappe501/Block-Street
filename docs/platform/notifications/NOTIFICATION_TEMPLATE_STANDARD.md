# Notification Template Standard

**System ID:** NTF-001

Templates governed via CMS (Build 8.3). Variables use allowlist: `{{user.preferred_name}}` · `{{mission.title}}` · `{{organization.name}}` · `{{action_url}}`

Every delivery records `template_id` and `template_version`. No raw script injection; URLs validated against approved domains.
