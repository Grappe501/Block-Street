export type ContentStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "scheduled"
  | "published"
  | "review_due"
  | "expired"
  | "archived"
  | "retired"
  | "rejected"
  | "withdrawn";

export type Visibility =
  | "public"
  | "platform_internal"
  | "organization_internal"
  | "workspace_internal"
  | "role_restricted"
  | "private_draft"
  | "restricted"
  | "embargoed"
  | "archived";

export interface ContentItem {
  id: string;
  public_id: string;
  content_type: string;
  title: string;
  slug: string;
  summary: string;
  status: ContentStatus | string;
  owner_user_id: string;
  owner_organization_id: string;
  workspace_id_optional: string | null;
  author_user_id: string;
  current_version_id: string;
  published_version_id: string | null;
  audience_type: string;
  visibility: Visibility | string;
  scope_type: string;
  scope_id: string;
  language: string;
  locale: string;
  authority_level: string;
  ai_retrieval_allowed: boolean;
  channels: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  scheduled_at: string | null;
  expires_at: string | null;
  review_due_at: string | null;
  archived_at: string | null;
  taxonomy_term_ids: string[];
  tag_ids: string[];
}

export interface ContentVersion {
  id: string;
  content_item_id: string;
  version_number: number;
  title: string;
  summary: string;
  body: string;
  structured_body: Record<string, unknown> | null;
  change_summary: string;
  author_user_id: string;
  created_at: string;
  review_status: string;
  approval_status: string;
  approved_by?: string | null;
  approved_at?: string | null;
  accessibility_status?: string;
  ai_assistance_metadata_optional?: Record<string, unknown> | null;
}

export interface ContentType {
  id: string;
  name: string;
  key: string;
  workflow_id: string;
  default_audience: string;
  default_scope: string;
  requires_review: boolean;
  requires_accessibility_review: boolean;
  requires_legal_review: boolean;
  status: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  original_filename: string;
  media_type: string;
  mime_type: string;
  size: number;
  storage_reference: string;
  title: string;
  description: string;
  alt_text: string;
  caption: string | null;
  owner_user_id: string;
  organization_id_optional: string | null;
  usage_rights: string;
  license: string;
  review_status: string;
  publication_status: string;
  created_at: string;
}

export interface PublicationManifest {
  id: string;
  content_item_id: string;
  content_version_id: string;
  channels: string[];
  audiences: string[];
  scope_type: string;
  scope_id: string;
  published_by: string;
  approved_by: string;
  published_at: string;
  result: string;
  rollback_reference: string | null;
}

export interface ContentDeliveryView {
  item: Omit<ContentItem, "owner_user_id"> & { owner_user_id?: string };
  version: Pick<ContentVersion, "id" | "title" | "summary" | "body" | "structured_body" | "version_number">;
}

export interface CmsOverview {
  published_count: number;
  draft_count: number;
  awaiting_review: number;
  scheduled: number;
  review_overdue: number;
  expired: number;
}

export interface ViewerContext {
  user_id: string | null;
  organization_ids: string[];
  is_authenticated: boolean;
}
