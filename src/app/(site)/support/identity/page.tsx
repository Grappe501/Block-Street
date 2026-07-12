"use client";

import { useEffect, useState } from "react";

const CATEGORIES = [
  "invitation_not_received",
  "cannot_sign_in",
  "possible_duplicate_account",
  "need_another_verifier",
  "identity_restricted",
  "account_compromise",
  "context_switching_problem",
  "accessibility_support",
];

export default function IdentitySupportPage() {
  const [requests, setRequests] = useState<Record<string, unknown>[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/v1/identity-support/requests?mine=true").then((r) => r.json()).then((d) => setRequests(d.data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    const res = await fetch("/api/v1/identity-support/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, description }),
    });
    const d = await res.json();
    setMessage(res.ok ? "Support request submitted." : d.error?.message ?? "Failed");
    setDescription("");
    load();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Identity Support</h1>
      <p className="text-sm text-slate-600">
        Support operators help you navigate identity workflows. They cannot verify identities or decide cases.
      </p>

      <div className="rounded border p-4 space-y-3">
        <label className="block text-sm font-medium" htmlFor="category">Category</label>
        <select id="category" className="w-full rounded border p-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
          ))}
        </select>
        <label className="block text-sm font-medium" htmlFor="description">Description</label>
        <textarea id="description" className="w-full rounded border p-2 text-sm" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="button" onClick={submit} className="rounded bg-indigo-700 px-4 py-2 text-sm text-white">Submit request</button>
        {message && <p className="text-sm text-emerald-800" role="status">{message}</p>}
      </div>

      <div>
        <h2 className="font-semibold">My requests</h2>
        <ul className="mt-2 space-y-2">
          {requests.map((r) => (
            <li key={String(r.id)} className="rounded border p-2 text-sm">
              {String(r.category)} — {String(r.status)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
