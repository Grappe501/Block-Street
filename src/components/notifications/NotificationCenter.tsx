"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Notification } from "@/lib/notifications/types";

type Filter = "all" | "unread" | "important" | "security" | "mission";

export function NotificationCenter() {
  const [filter, setFilter] = useState<Filter>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (filter === "unread") params.set("unread", "true");
    if (filter === "mission") params.set("category", "mission");
    if (filter === "security") params.set("category", "security");
    const res = await fetch(`/api/notifications?${params}`);
    const data = await res.json();
    if (data.error) setError(data.error);
    else {
      let items = data.notifications ?? [];
      if (filter === "important") items = items.filter((n: Notification) => ["important", "urgent", "critical"].includes(n.priority));
      setNotifications(items);
    }
    const uc = await fetch("/api/notifications/unread-count");
    const ucData = await uc.json();
    setUnreadCount(ucData.unread_count ?? 0);
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function action(id: string, act: "read" | "dismiss" | "archive") {
    await fetch(`/api/notifications/${id}/${act}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    load();
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: `Unread (${unreadCount})` },
    { id: "important", label: "Important" },
    { id: "mission", label: "Missions" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Notifications</h1>
          <p className="text-sm text-slate-600">{unreadCount} unread</p>
        </div>
        <Link href="/notifications/preferences" className="text-sm font-semibold text-blue-700 hover:underline">
          Preferences
        </Link>
      </div>
      {error && <p className="text-sm text-red-800" role="alert">{error}</p>}
      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${filter === t.id ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li key={n.id} className={`card border p-4 ${!n.read ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-600">{n.category} · {n.priority}</p>
                <h2 className="mt-1 font-bold text-slate-950">{n.title}</h2>
                <p className="mt-1 text-sm text-slate-800">{n.body}</p>
                {n.resolved && <p className="mt-1 text-xs font-semibold text-emerald-700">Resolved</p>}
                {n.group_count > 1 && <p className="mt-1 text-xs text-slate-600">Grouped · {n.group_count} updates</p>}
              </div>
              {!n.read && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">New</span>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {n.action_url_optional && (
                <a href={n.action_url_optional} className="rounded bg-slate-800 px-2 py-1 text-xs text-white">
                  {n.action_label_optional ?? "Open"}
                </a>
              )}
              {!n.read && (
                <button type="button" onClick={() => action(n.id, "read")} className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-800">
                  Mark read
                </button>
              )}
              <button type="button" onClick={() => action(n.id, "dismiss")} className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-800">
                Dismiss
              </button>
              <button type="button" onClick={() => action(n.id, "archive")} className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-800">
                Archive
              </button>
            </div>
          </li>
        ))}
        {notifications.length === 0 && <li className="text-sm text-slate-600">No notifications in this view.</li>}
      </ul>
    </div>
  );
}
