"use client";

import { useCallback, useEffect, useState } from "react";
import sis from "../../../data/registry/statewide-intelligence-search.json";
import savedData from "../../../data/search/saved_searches.json";
import type { SearchResult } from "@/lib/search/types";

export function AdminStatewideIntelligenceSearch() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("standard");
  const [entityType, setEntityType] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [indexCount, setIndexCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async (q: string, m: string, et: string) => {
    setLoading(true);
    const params = new URLSearchParams({ q, mode: m, limit: "20" });
    if (et) params.set("entity_type", et);
    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setResults(data.results || []);
    setLatencyMs(data.latencyMs ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/search/status")
      .then((r) => r.json())
      .then((d) => setIndexCount(d.objectCount ?? null));
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(() => runSearch(query, mode, entityType), 200);
    return () => clearTimeout(t);
  }, [query, mode, entityType, runSearch]);

  return (
    <div className="space-y-6">
      <div className="card border-sky-400 bg-sky-100">
        <p className="text-xs font-semibold uppercase text-sky-900">BUILD 7.1 · Statewide Intelligence Search</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{sis.productName}</h2>
        <p className="mt-2 text-sm text-sky-900">{sis.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-sky-800">
          {sis.requirementId} · {sis.acceptanceCriteria} · {indexCount ?? "—"} indexed objects
        </p>
      </div>

      <div className="card border-sky-200 bg-white">
        <label className="text-xs font-semibold text-sky-800">Universal Search</label>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, counties, schools, missions, documents…"
          className="mt-2 w-full rounded-lg border border-sky-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none"
        />
        {suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full bg-sky-100 px-2 py-1 text-xs text-sky-800 hover:bg-sky-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded border border-sky-200 px-2 py-1"
          >
            <option value="standard">Standard</option>
            <option value="fuzzy">Fuzzy</option>
          </select>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="rounded border border-sky-200 px-2 py-1"
          >
            <option value="">All types</option>
            <option value="County">County</option>
            <option value="Institution">Institution</option>
            <option value="Person">Person</option>
            <option value="Mission">Mission</option>
            <option value="Document">Document</option>
          </select>
          {latencyMs !== null && (
            <span className="text-sky-600">
              {results.length} results · {latencyMs}ms
              {latencyMs < 300 ? " ✓" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {loading && <p className="text-xs text-sky-600">Searching…</p>}
        {!loading &&
          results.map((r) => (
            <div key={r.search_id} className="card border-sky-100 bg-sky-50/30">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-bold text-sky-950">{r.title}</p>
                  <p className="text-xs text-sky-800">{r.subtitle}</p>
                </div>
                <span className="shrink-0 rounded bg-sky-200 px-2 py-0.5 text-xs font-mono text-sky-900">
                  {r.entity_type}
                </span>
              </div>
              {r.summary && <p className="mt-1 text-xs text-sky-700">{r.summary}</p>}
              <p className="mt-2 text-xs text-sky-600">
                Score {r.score} · {r.matchMode} · importance {r.scoreBreakdown.importance}
              </p>
            </div>
          ))}
      </div>

      <div className="card border-sky-200 bg-white">
        <h2 className="text-sm font-bold text-sky-950">Saved Searches</h2>
        <ul className="mt-2 space-y-1 text-xs text-sky-800">
          {savedData.savedSearches.map((s) => (
            <li key={s.id}>
              <button type="button" className="text-left hover:underline" onClick={() => setQuery(s.query)}>
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
