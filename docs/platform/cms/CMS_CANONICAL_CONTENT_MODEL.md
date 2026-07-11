# Canonical Content Model

**System ID:** CMS-001

## Core Entities

| Entity | Store |
|--------|-------|
| ContentItem | `data/cms/content_items.json` |
| ContentVersion | `data/cms/content_versions.json` |
| ContentType | `data/cms/content_types.json` |
| MediaAsset | `data/cms/media_assets.json` |
| TaxonomyTerm | `data/cms/taxonomy_terms.json` |
| PublicationManifest | `data/cms/publication_manifests.json` |

## ContentItem Fields

`id`, `public_id`, `content_type`, `title`, `slug`, `summary`, `status`, `owner_user_id`, `owner_organization_id`, `workspace_id_optional`, `current_version_id`, `audience_type`, `visibility`, `language`, `published_at`, `scheduled_at`, `expires_at`, `review_due_at`

## ContentVersion Fields

`id`, `content_item_id`, `version_number`, `title`, `summary`, `body`, `structured_body`, `change_summary`, `review_status`, `approval_status`, `ai_assistance_metadata_optional`

## Lifecycle

`draft` → `in_review` → `changes_requested` → `approved` → `scheduled` → `published` → `review_due` → `archived` → `retired`
