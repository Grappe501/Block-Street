/**
 * CAE-11.1-W5 — Initiative search projection (visibility-scoped fields only)
 */
import { initiativeApplicationService } from "../services/application-service";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type InitiativeSearchDocument = {
  initiative_id: string;
  institution_id: string;
  name: string;
  public_name: string | null;
  slug: string;
  type: string;
  status: string;
  portfolio_category: string | null;
  public_description: string | null;
  purpose_summary: string;
  visibility: string;
  updated_at: string;
};

const INDEX_KEY = "initiative_search_index";

export function projectInitiativeSearchDocument(initiativeId: string): InitiativeSearchDocument | null {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return null;
  const ini = agg.initiative;
  const purpose = agg.charter?.purpose || agg.charter?.problem_statement || "";
  return {
    initiative_id: ini.initiative_id,
    institution_id: ini.institution_id,
    name: ini.initiative_name,
    public_name: ini.visibility === "member_public" ? ini.initiative_name : null,
    slug: ini.initiative_id,
    type: ini.initiative_type,
    status: ini.status,
    portfolio_category: ini.portfolio_category ?? null,
    public_description: ini.visibility === "member_public" ? purpose.slice(0, 500) : null,
    purpose_summary: purpose.slice(0, 280),
    visibility: ini.visibility,
    updated_at: ini.updated_at,
  };
}

export function upsertInitiativeSearchIndex(doc: InitiativeSearchDocument) {
  const index = readStoreSlice<InitiativeSearchDocument>(INDEX_KEY);
  const next = index.filter((d) => d.initiative_id !== doc.initiative_id);
  next.push(doc);
  writeStoreSlice(INDEX_KEY, next);
}

export function searchInitiatives(input: {
  institution_id: string;
  query?: string;
  include_archived?: boolean;
  visibility_scope: "public" | "member";
}) {
  let docs = readStoreSlice<InitiativeSearchDocument>(INDEX_KEY).filter((d) => {
    if (input.visibility_scope === "public") return d.visibility === "member_public";
    return d.institution_id === input.institution_id;
  });

  if (!input.include_archived) {
    docs = docs.filter((d) => d.status !== "archived");
  }

  if (input.query) {
    const q = input.query.toLowerCase();
    docs = docs.filter(
      (d) => d.name.toLowerCase().includes(q) || d.purpose_summary.toLowerCase().includes(q)
    );
  }

  return docs.map((d) => ({
    initiative_id: d.initiative_id,
    name: d.name,
    public_name: d.public_name,
    type: d.type,
    status: d.status,
    institution_id: d.institution_id,
    purpose_snippet: d.purpose_summary.slice(0, 160),
    visibility: d.visibility,
    updated_at: d.updated_at,
    matched_fields: input.query ? ["name", "purpose_summary"] : [],
  }));
}
