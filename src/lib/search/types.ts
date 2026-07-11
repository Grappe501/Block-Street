export type SearchObject = {
  search_id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  full_text?: string;
  keywords?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  county?: string;
  organization?: string;
  owner?: string;
  permissions: string[];
  status?: string;
  latitude?: number;
  longitude?: number;
  importance_score?: number;
  popularity_score?: number;
  relationship_score?: number;
  embedding_reference?: string | null;
};

export type SearchFilters = {
  entity_type?: string;
  county?: string;
  status?: string;
  tags?: string;
};

export type ScoreBreakdown = {
  keyword: number;
  fuzzy: number;
  freshness: number;
  importance: number;
  popularity: number;
  relationship: number;
  total: number;
};

export type SearchResult = SearchObject & {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  matchMode: "keyword" | "fuzzy" | "filter";
};

export type SearchResponse = {
  query: string;
  mode: string;
  count: number;
  latencyMs: number;
  results: SearchResult[];
};
