import { randomBytes } from "crypto";
import { resolveMemberships } from "@/lib/auth/engine";
import {
  appendCmsAudit,
  loadCmsFeatureFlags,
  loadContentItems,
  loadContentTypes,
  loadContentVersions,
  loadMediaAssets,
  loadPublicationManifests,
  persistContentItems,
  persistContentVersions,
  persistPublicationManifests,
  readCmsAudit,
} from "./data";
import { hasContentPermission } from "./permissions";
import { sanitizeHtml } from "./sanitize";
import { indexPublishedContent } from "./search-index";
import type { CmsOverview, ContentDeliveryView, ContentItem, ContentVersion, ViewerContext } from "./types";

export class CmsError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function audit(actorId: string, action: string, itemId: string, result: string, extra?: Record<string, unknown>) {
  appendCmsAudit({
    actor_id: actorId,
    content_item_id: itemId,
    action,
    result,
    ...extra,
  });
}

export function getVersionById(versionId: string): ContentVersion | null {
  return loadContentVersions().find((v) => v.id === versionId) ?? null;
}

export function getContentItem(id: string): ContentItem | null {
  return loadContentItems().find((i) => i.id === id) ?? null;
}

export function getContentBySlug(slug: string): ContentItem | null {
  return loadContentItems().find((i) => i.slug === slug) ?? null;
}

export function canViewContent(item: ContentItem, viewer: ViewerContext): boolean {
  if (item.status !== "published" && !viewer.is_authenticated) return false;
  if (item.visibility === "public" && item.status === "published") return true;
  if (!viewer.is_authenticated) return false;
  if (item.visibility === "platform_internal") return viewer.is_authenticated;
  if (item.visibility === "organization_internal") {
    return viewer.organization_ids.includes(item.scope_id) || viewer.organization_ids.includes(item.owner_organization_id);
  }
  if (item.visibility === "private_draft") {
    return viewer.user_id === item.author_user_id || viewer.user_id === item.owner_user_id;
  }
  return false;
}

export function toDeliveryView(item: ContentItem, versionId?: string): ContentDeliveryView | null {
  const vid = versionId ?? item.published_version_id ?? item.current_version_id;
  const version = getVersionById(vid);
  if (!version) return null;
  const { owner_user_id, ...safeItem } = item;
  return {
    item: item.visibility === "public" ? safeItem : { ...safeItem, owner_user_id },
    version: {
      id: version.id,
      title: version.title,
      summary: version.summary,
      body: version.body,
      structured_body: version.structured_body,
      version_number: version.version_number,
    },
  };
}

export function listPublishedContent(viewer: ViewerContext, filters?: { content_type?: string; organization_id?: string }) {
  return loadContentItems()
    .filter((item) => {
      if (item.status !== "published") return false;
      if (item.expires_at && new Date(item.expires_at).getTime() < Date.now()) return false;
      if (filters?.content_type && item.content_type !== filters.content_type) return false;
      if (filters?.organization_id && item.owner_organization_id !== filters.organization_id) return false;
      return canViewContent(item, viewer);
    })
    .map((item) => toDeliveryView(item))
    .filter(Boolean) as ContentDeliveryView[];
}

export function getCmsOverview(): CmsOverview {
  const items = loadContentItems();
  const now = Date.now();
  return {
    published_count: items.filter((i) => i.status === "published").length,
    draft_count: items.filter((i) => i.status === "draft").length,
    awaiting_review: items.filter((i) => i.status === "in_review").length,
    scheduled: items.filter((i) => i.status === "scheduled").length,
    review_overdue: items.filter((i) => i.review_due_at && new Date(i.review_due_at).getTime() < now && i.status === "published").length,
    expired: items.filter((i) => i.expires_at && new Date(i.expires_at).getTime() < now).length,
  };
}

export function assertContentPermission(userId: string, permission: string) {
  const flags = loadCmsFeatureFlags();
  if (!flags.CMS_ENABLED) throw new CmsError("CMS is not enabled", 503);
  if (!hasContentPermission(userId, permission)) {
    throw new CmsError(`You do not have permission: ${permission}`, 403);
  }
}

export function createContent(
  userId: string,
  input: {
    content_type: string;
    title: string;
    slug: string;
    summary: string;
    body: string;
    audience_type?: string;
    visibility?: string;
    scope_type?: string;
    scope_id?: string;
    owner_organization_id: string;
  }
): { item: ContentItem; version: ContentVersion } {
  assertContentPermission(userId, "content.create");
  const type = loadContentTypes().find((t) => t.key === input.content_type);
  if (!type) throw new CmsError("Unknown content type", 400);

  const itemId = `cnt-${randomBytes(6).toString("hex")}`;
  const versionId = `ver-${randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  const version: ContentVersion = {
    id: versionId,
    content_item_id: itemId,
    version_number: 1,
    title: input.title,
    summary: input.summary,
    body: sanitizeHtml(input.body),
    structured_body: { blocks: [{ type: "rich_text", content: sanitizeHtml(input.body) }] },
    change_summary: "Initial version",
    author_user_id: userId,
    created_at: now,
    review_status: "pending",
    approval_status: "pending",
    accessibility_status: "not_reviewed",
  };

  const item: ContentItem = {
    id: itemId,
    public_id: `pub-${itemId}`,
    content_type: input.content_type,
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    status: "draft",
    owner_user_id: userId,
    owner_organization_id: input.owner_organization_id,
    workspace_id_optional: null,
    author_user_id: userId,
    current_version_id: versionId,
    published_version_id: null,
    audience_type: input.audience_type ?? type.default_audience,
    visibility: input.visibility ?? "private_draft",
    scope_type: input.scope_type ?? type.default_scope,
    scope_id: input.scope_id ?? input.owner_organization_id,
    language: "en",
    locale: "en-US",
    authority_level: "draft",
    ai_retrieval_allowed: false,
    channels: [],
    created_at: now,
    updated_at: now,
    published_at: null,
    scheduled_at: null,
    expires_at: null,
    review_due_at: null,
    archived_at: null,
    taxonomy_term_ids: [],
    tag_ids: [],
  };

  const items = loadContentItems();
  if (items.some((i) => i.slug === input.slug && i.owner_organization_id === input.owner_organization_id)) {
    throw new CmsError("Slug already exists in this organization", 409);
  }
  items.push(item);
  persistContentItems(items);
  const versions = loadContentVersions();
  versions.push(version);
  persistContentVersions(versions);
  audit(userId, "content_created", itemId, "success");
  return { item, version };
}

export function createNewVersion(userId: string, itemId: string, patch: { title?: string; summary?: string; body?: string; change_summary?: string }) {
  assertContentPermission(userId, "content.edit_own");
  const items = loadContentItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) throw new CmsError("Content not found", 404);
  if (items[idx].author_user_id !== userId && !hasContentPermission(userId, "content.edit_all")) {
    throw new CmsError("You can only edit your own content", 403);
  }

  const versions = loadContentVersions().filter((v) => v.content_item_id === itemId);
  const nextNum = versions.length ? Math.max(...versions.map((v) => v.version_number)) + 1 : 1;
  const now = new Date().toISOString();
  const current = getVersionById(items[idx].current_version_id)!;

  const version: ContentVersion = {
    id: `ver-${randomBytes(6).toString("hex")}`,
    content_item_id: itemId,
    version_number: nextNum,
    title: patch.title ?? current.title,
    summary: patch.summary ?? current.summary,
    body: sanitizeHtml(patch.body ?? current.body),
    structured_body: current.structured_body,
    change_summary: patch.change_summary ?? "Revision",
    author_user_id: userId,
    created_at: now,
    review_status: "pending",
    approval_status: "pending",
    accessibility_status: current.accessibility_status,
  };

  const allVersions = loadContentVersions();
  allVersions.push(version);
  persistContentVersions(allVersions);
  items[idx] = { ...items[idx], current_version_id: version.id, updated_at: now, status: "draft" };
  persistContentItems(items);
  audit(userId, "version_created", itemId, "success", { version_id: version.id });
  return version;
}

function transitionStatus(userId: string, itemId: string, status: ContentItem["status"], action: string) {
  const items = loadContentItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) throw new CmsError("Content not found", 404);
  items[idx] = { ...items[idx], status, updated_at: new Date().toISOString() };
  persistContentItems(items);
  audit(userId, action, itemId, "success");
  return items[idx];
}

export function submitForReview(userId: string, itemId: string) {
  assertContentPermission(userId, "content.submit_review");
  return transitionStatus(userId, itemId, "in_review", "submitted_for_review");
}

export function approveContent(userId: string, itemId: string) {
  assertContentPermission(userId, "content.approve");
  const items = loadContentItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) throw new CmsError("Content not found", 404);
  const versions = loadContentVersions();
  const vidx = versions.findIndex((v) => v.id === items[idx].current_version_id);
  if (vidx >= 0) {
    versions[vidx] = {
      ...versions[vidx],
      review_status: "approved",
      approval_status: "approved",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    };
    persistContentVersions(versions);
  }
  items[idx] = { ...items[idx], status: "approved", updated_at: new Date().toISOString() };
  persistContentItems(items);
  audit(userId, "content_approved", itemId, "success");
  return items[idx];
}

export function publishContent(userId: string, itemId: string, channels?: string[]) {
  assertContentPermission(userId, "content.publish");
  const items = loadContentItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) throw new CmsError("Content not found", 404);
  const version = getVersionById(items[idx].current_version_id);
  if (!version || version.approval_status !== "approved") {
    if (loadContentTypes().find((t) => t.key === items[idx].content_type)?.workflow_id !== "simple") {
      throw new CmsError("Content must be approved before publishing", 400);
    }
  }

  const now = new Date().toISOString();
  items[idx] = {
    ...items[idx],
    status: "published",
    published_version_id: items[idx].current_version_id,
    published_at: now,
    updated_at: now,
    visibility: items[idx].visibility === "private_draft" ? "public" : items[idx].visibility,
    authority_level: items[idx].authority_level === "draft" ? "verified" : items[idx].authority_level,
    ai_retrieval_allowed: items[idx].ai_retrieval_allowed || items[idx].visibility === "public",
    channels: channels ?? items[idx].channels,
  };
  persistContentItems(items);

  const manifest = {
    id: `pubman-${randomBytes(4).toString("hex")}`,
    content_item_id: itemId,
    content_version_id: items[idx].current_version_id,
    channels: items[idx].channels,
    audiences: [items[idx].audience_type],
    scope_type: items[idx].scope_type,
    scope_id: items[idx].scope_id,
    published_by: userId,
    approved_by: version?.approved_by ?? userId,
    published_at: now,
    result: "success",
    rollback_reference: items[idx].published_version_id,
  };
  const manifests = loadPublicationManifests();
  manifests.push(manifest);
  persistPublicationManifests(manifests);

  if (version && items[idx].ai_retrieval_allowed) {
    indexPublishedContent(items[idx], version);
  }
  audit(userId, "content_published", itemId, "success");
  return items[idx];
}

export function scheduleContent(userId: string, itemId: string, scheduledAt: string) {
  assertContentPermission(userId, "content.schedule");
  const items = loadContentItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) throw new CmsError("Content not found", 404);
  items[idx] = { ...items[idx], status: "scheduled", scheduled_at: scheduledAt, updated_at: new Date().toISOString() };
  persistContentItems(items);
  audit(userId, "content_scheduled", itemId, "success", { scheduled_at: scheduledAt });
  return items[idx];
}

export function archiveContent(userId: string, itemId: string) {
  assertContentPermission(userId, "content.archive");
  const items = loadContentItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx < 0) throw new CmsError("Content not found", 404);
  items[idx] = { ...items[idx], status: "archived", archived_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  persistContentItems(items);
  audit(userId, "content_archived", itemId, "success");
  return items[idx];
}

export function buildViewerContext(userId: string | null): ViewerContext {
  if (!userId) return { user_id: null, organization_ids: [], is_authenticated: false };
  const memberships = resolveMemberships(userId);
  return {
    user_id: userId,
    organization_ids: [...new Set(memberships.map((m) => m.organization_id))],
    is_authenticated: true,
  };
}

export { readCmsAudit, loadContentTypes, loadMediaAssets, loadContentItems, loadContentVersions };
