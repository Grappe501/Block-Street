"use client";

import { useState } from "react";

export function CommunicationCopilot() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  async function handleAsk() {
    const res = await fetch("/api/v1/ai/communications/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    setAnswer(json.data?.answer ?? json.answer ?? "No response");
  }

  return (
    <section aria-labelledby="com-copilot" className="card">
      <h2 id="com-copilot" className="text-lg font-bold text-slate-900">
        Communication Copilot
      </h2>
      <p className="text-xs text-slate-500">Read-only advisory — cannot send, approve, or decide.</p>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about health, duplicates, or decisions…"
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          aria-label="Copilot query"
        />
        <button type="button" className="btn-primary" onClick={handleAsk}>
          Ask
        </button>
      </div>
      {answer && <p className="mt-3 text-sm text-slate-700">{answer}</p>}
    </section>
  );
}
