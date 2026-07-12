"use client";

import { useEffect, useState } from "react";

type Request = {
  id: string;
  subject_human_id: string;
  status: string;
  request_reason: string;
  expires_at: string;
};

export default function VerificationsInboxPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [qualified, setQualified] = useState(false);

  useEffect(() => {
    fetch("/api/v1/identity/verification-requests?role=verifier")
      .then((r) => r.json())
      .then((d) => setRequests(d.data ?? []));
    fetch("/api/v1/identity/verifier-qualification")
      .then((r) => r.json())
      .then((d) => setQualified(Boolean(d.data?.qualification)));
  }, []);

  async function completeEducation() {
    await fetch("/api/v1/identity/verifier-qualification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_education" }),
    });
    setQualified(true);
  }

  async function confirm(req: Request) {
    await fetch("/api/v1/identity/verification-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirm",
        request_id: req.id,
        subject_human_id: req.subject_human_id,
        institution_id: "inst-block-street",
        relationship_basis: "personally_known",
        identity_name_confirmed: "Confirmed public identity",
        confidence: "certain",
        responsibility_accepted: true,
      }),
    });
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  async function unable(req: Request) {
    await fetch("/api/v1/identity/verification-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unable_to_confirm", request_id: req.id, reason: "Cannot verify" }),
    });
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Verifier inbox</h1>

      {!qualified && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="mb-2">Complete verifier education before confirming identities.</p>
          <button type="button" onClick={completeEducation} className="rounded bg-amber-700 px-3 py-2 text-white">
            Complete education
          </button>
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-sm text-slate-600">No pending verification requests.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li key={req.id} className="rounded border border-slate-200 p-4 text-sm">
              <p>Request from subject {req.subject_human_id}</p>
              <p className="text-slate-600">{req.request_reason}</p>
              <p className="text-xs text-slate-500">Expires {new Date(req.expires_at).toLocaleDateString()}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={!qualified}
                  onClick={() => confirm(req)}
                  className="rounded bg-emerald-700 px-3 py-1 text-white disabled:opacity-50"
                >
                  Confirm
                </button>
                <button type="button" onClick={() => unable(req)} className="rounded border px-3 py-1">
                  Unable to confirm
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
