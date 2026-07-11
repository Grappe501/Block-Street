"use client";

import { useEffect, useState } from "react";
import ntf from "../../../data/registry/notification-services.json";
import type { NotificationOverview } from "@/lib/notifications/types";

type Tab = "overview" | "queue" | "failures" | "templates" | "campaigns";

export function AdminNotificationServices() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<NotificationOverview | null>(null);
  const [queue, setQueue] = useState<Record<string, unknown> | null>(null);
  const [failures, setFailures] = useState<Record<string, unknown>[]>([]);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [campaigns, setCampaigns] = useState<Record<string, unknown>[]>([]);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/notifications/overview").then((r) => r.json()).then((d) => setOverview(d.overview ?? null));
  }, []);

  useEffect(() => {
    if (tab === "queue") fetch("/api/admin/notifications/queue").then((r) => r.json()).then(setQueue);
    if (tab === "failures") fetch("/api/admin/notifications/failures").then((r) => r.json()).then((d) => setFailures(d.failures ?? []));
    if (tab === "templates") fetch("/api/admin/notifications/templates").then((r) => r.json()).then((d) => setTemplates(d.templates ?? []));
    if (tab === "campaigns") fetch("/api/notifications/campaigns/camp-001").then((r) => r.json()).then((d) => setCampaigns(d.campaign ? [d.campaign] : []));
  }, [tab]);

  async function campaignAction(id: string, action: "submit-approval" | "approve" | "send") {
    setActionMsg("");
    const res = await fetch(`/api/notifications/campaigns/${id}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const data = await res.json();
    if (data.error) setActionMsg(data.error);
    else {
      setActionMsg(`${action} succeeded`);
      fetch("/api/notifications/campaigns/camp-001").then((r) => r.json()).then((d) => setCampaigns(d.campaign ? [d.campaign] : []));
      fetch("/api/admin/notifications/overview").then((r) => r.json()).then((d) => setOverview(d.overview ?? null));
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "queue", label: "Queue" },
    { id: "failures", label: "Failures" },
    { id: "templates", label: "Templates" },
    { id: "campaigns", label: "Campaigns" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-violet-500 bg-violet-100">
        <p className="text-xs font-semibold uppercase text-violet-950">BUILD 8.4 · Notification Services</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{ntf.productName}</h2>
        <p className="mt-2 text-sm text-violet-950">{ntf.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-violet-900">{ntf.requirementId} · {ntf.acceptanceCriteria}</p>
        {actionMsg && <p className="mt-2 text-sm text-violet-900">{actionMsg}</p>}
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-violet-800 text-white" : "bg-violet-50 text-violet-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Queued", overview.queued],
            ["Sent today", overview.sent_today],
            ["Delivery rate", `${overview.delivery_rate}%`],
            ["Failed", overview.failed],
            ["Bounced", overview.bounced],
            ["Suppressed", overview.suppressed],
            ["Pending approvals", overview.pending_approvals],
            ["Dead letter", overview.dead_letter],
            ["Provider health", overview.provider_health],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-violet-200 bg-white p-3 text-xs">
              <p className="text-violet-700">{label}</p>
              <p className="text-lg font-bold text-violet-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "queue" && queue && (
        <div className="card border-violet-200 bg-white p-4 text-xs text-violet-900">
          <p>Paused: {String(queue.paused)}</p>
          <ul className="mt-2 space-y-1">
            {(queue.queue as Record<string, unknown>[]).map((q) => (
              <li key={String(q.id)} className="rounded bg-violet-50 px-2 py-1">{String(q.id)} · {String(q.channel)} · {String(q.reason)}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "failures" && (
        <ul className="space-y-2 text-xs text-violet-900">
          {failures.map((f) => (
            <li key={String(f.id)} className="card border-violet-200 bg-white p-3">
              {String(f.destination_reference)} · {String(f.failure_code)} · {String(f.status)}
            </li>
          ))}
        </ul>
      )}

      {tab === "templates" && (
        <ul className="space-y-2 text-xs text-violet-900">
          {templates.map((t) => (
            <li key={String(t.id)} className="card border-violet-200 bg-white p-3">{String(t.name)} · {String(t.key)} · v{String(t.version)}</li>
          ))}
        </ul>
      )}

      {tab === "campaigns" && (
        <ul className="space-y-2 text-xs text-violet-900">
          {campaigns.map((c) => (
            <li key={String(c.id)} className="card border-violet-200 bg-white p-3">
              <p className="font-semibold">{String(c.name)}</p>
              <p>{String(c.status)} · {String(c.estimated_recipient_count)} recipients</p>
              <div className="mt-2 flex gap-1">
                {c.status === "draft" && <button type="button" className="rounded bg-violet-700 px-2 py-0.5 text-white" onClick={() => campaignAction(String(c.id), "submit-approval")}>Submit</button>}
                {c.status === "awaiting_approval" && <button type="button" className="rounded bg-violet-700 px-2 py-0.5 text-white" onClick={() => campaignAction(String(c.id), "approve")}>Approve</button>}
                {(c.status === "approved" || c.status === "awaiting_approval") && !c.executed && (
                  <button type="button" className="rounded bg-violet-700 px-2 py-0.5 text-white" onClick={() => campaignAction(String(c.id), "send")}>Send</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
