"use client";

import { useEffect, useState } from "react";
import cms from "../../../data/registry/content-services.json";
import type { CmsOverview } from "@/lib/cms/types";

type Tab = "overview" | "content" | "media" | "taxonomy" | "audit";

type ContentRow = {
  id: string;
  title: string;
  content_type: string;
  status: string;
  visibility: string;
  slug: string;
};

export function AdminContentServices() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<CmsOverview | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [items, setItems] = useState<ContentRow[]>([]);
  const [media, setMedia] = useState<Record<string, unknown>[]>([]);
  const [taxonomy, setTaxonomy] = useState<{ terms: Record<string, unknown>[]; tags: { id: string; name: string }[] } | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetch("/api/cms/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          setOverview(d.overview ?? null);
          setPermissions(d.permissions ?? []);
        }
      });
  }, []);

  useEffect(() => {
    if (tab === "content") fetch("/api/cms/content").then((r) => r.json()).then((d) => setItems(d.items ?? []));
    if (tab === "media") fetch("/api/cms/media").then((r) => r.json()).then((d) => setMedia(d.assets ?? []));
    if (tab === "taxonomy") fetch("/api/cms/taxonomies").then((r) => r.json()).then((d) => setTaxonomy(d));
    if (tab === "audit") fetch("/api/cms/audit").then((r) => r.json()).then((d) => setAudit(d.events ?? []));
  }, [tab]);

  async function workflowAction(id: string, action: "submit-review" | "approve" | "publish" | "archive") {
    setActionMsg("");
    const res = await fetch(`/api/cms/content/${id}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const data = await res.json();
    if (data.error) setActionMsg(data.error);
    else {
      setActionMsg(`${action} succeeded for ${id}`);
      fetch("/api/cms/content").then((r) => r.json()).then((d) => setItems(d.items ?? []));
      fetch("/api/cms/overview").then((r) => r.json()).then((d) => setOverview(d.overview ?? null));
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "content", label: "Content" },
    { id: "media", label: "Media" },
    { id: "taxonomy", label: "Taxonomy" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-emerald-500 bg-emerald-100">
        <p className="text-xs font-semibold uppercase text-emerald-950">BUILD 8.3 · CMS & Content Services</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{cms.productName}</h2>
        <p className="mt-2 text-sm text-emerald-950">{cms.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-emerald-900">{cms.requirementId} · {cms.acceptanceCriteria}</p>
        {permissions.length > 0 && (
          <p className="mt-2 rounded bg-white/80 p-2 text-xs text-emerald-950">
            <strong>Editorial permissions:</strong> {permissions.join(", ")}
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-800" role="alert">{error}</p>}
        {actionMsg && <p className="mt-2 text-sm text-emerald-900">{actionMsg}</p>}
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-emerald-800 text-white" : "bg-emerald-50 text-emerald-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Published", overview.published_count],
            ["Drafts", overview.draft_count],
            ["Awaiting review", overview.awaiting_review],
            ["Scheduled", overview.scheduled],
            ["Review overdue", overview.review_overdue],
            ["Expired", overview.expired],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-emerald-200 bg-white p-3 text-xs">
              <p className="text-emerald-700">{label}</p>
              <p className="text-lg font-bold text-emerald-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "content" && (
        <div className="card border-emerald-200 bg-white p-4">
          <h3 className="text-sm font-bold text-emerald-950">Content Items</h3>
          <ul className="mt-2 space-y-2 text-xs text-emerald-900">
            {items.map((item) => (
              <li key={item.id} className="rounded border border-emerald-100 bg-emerald-50 px-3 py-2">
                <p className="font-semibold">{item.title}</p>
                <p className="text-emerald-700">{item.id} · {item.content_type} · {item.status} · {item.visibility}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.status === "draft" && permissions.includes("content.submit_review") && (
                    <button type="button" className="rounded bg-emerald-700 px-2 py-0.5 text-white" onClick={() => workflowAction(item.id, "submit-review")}>Submit review</button>
                  )}
                  {item.status === "in_review" && permissions.includes("content.approve") && (
                    <button type="button" className="rounded bg-emerald-700 px-2 py-0.5 text-white" onClick={() => workflowAction(item.id, "approve")}>Approve</button>
                  )}
                  {(item.status === "approved" || item.status === "scheduled") && permissions.includes("content.publish") && (
                    <button type="button" className="rounded bg-emerald-700 px-2 py-0.5 text-white" onClick={() => workflowAction(item.id, "publish")}>Publish</button>
                  )}
                  {item.status === "published" && permissions.includes("content.archive") && (
                    <button type="button" className="rounded bg-slate-600 px-2 py-0.5 text-white" onClick={() => workflowAction(item.id, "archive")}>Archive</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "media" && (
        <div className="card border-emerald-200 bg-white p-4">
          <h3 className="text-sm font-bold text-emerald-950">Media Library</h3>
          <ul className="mt-2 space-y-1 text-xs text-emerald-900">
            {media.map((a) => (
              <li key={String(a.id)} className="rounded bg-emerald-50 px-2 py-1">
                {String(a.title)} — {String(a.media_type)} · alt: {String(a.alt_text || "missing")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "taxonomy" && taxonomy && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card border-emerald-200 bg-white p-4">
            <h3 className="text-sm font-bold text-emerald-950">Taxonomy Terms</h3>
            <ul className="mt-2 space-y-1 text-xs text-emerald-900">
              {taxonomy.terms.map((t) => (
                <li key={String(t.id)} className="rounded bg-emerald-50 px-2 py-1">{String(t.name)} ({String(t.taxonomy_type)})</li>
              ))}
            </ul>
          </div>
          <div className="card border-emerald-200 bg-white p-4">
            <h3 className="text-sm font-bold text-emerald-950">Tags</h3>
            <ul className="mt-2 flex flex-wrap gap-1 text-xs">
              {taxonomy.tags.map((t) => (
                <li key={t.id} className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-900">{t.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="card border-emerald-200 bg-white p-4">
          <h3 className="text-sm font-bold text-emerald-950">Content Audit Trail</h3>
          <ul className="mt-2 space-y-1 text-xs text-emerald-900">
            {audit.map((e, i) => (
              <li key={i} className="rounded bg-emerald-50 px-2 py-1 font-mono">
                {String(e.timestamp)} · {String(e.action)} · {String(e.content_item_id)} · {String(e.result)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
