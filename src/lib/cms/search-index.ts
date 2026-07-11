import { appendFileSync } from "fs";
import { join } from "path";
import type { ContentItem } from "./types";

export function contentToSearchObject(item: ContentItem, version: { title: string; summary: string; body: string }) {
  const permissions =
    item.visibility === "public"
      ? ["public"]
      : item.visibility === "platform_internal"
        ? ["authenticated"]
        : item.visibility === "organization_internal"
          ? [`org:${item.scope_id}`]
          : ["restricted"];

  return {
    search_id: `cms-${item.id}`,
    entity_type: "Content",
    entity_id: item.id,
    title: version.title,
    subtitle: item.content_type,
    summary: version.summary,
    full_text: `${version.title} ${version.summary} ${version.body.replace(/<[^>]+>/g, " ")}`,
    keywords: [item.slug, item.content_type, ...(item.tag_ids ?? [])],
    tags: ["cms", item.content_type, item.authority_level],
    owner: item.owner_organization_id,
    organization: item.owner_organization_id,
    status: item.status,
    importance_score: item.authority_level === "official" ? 0.9 : 0.6,
    popularity_score: 0.5,
    permissions,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export function indexPublishedContent(item: ContentItem, version: { title: string; summary: string; body: string }) {
  const path = join(process.cwd(), "data", "search", "search_objects.jsonl");
  const obj = contentToSearchObject(item, version);
  appendFileSync(path, JSON.stringify(obj) + "\n");
}
