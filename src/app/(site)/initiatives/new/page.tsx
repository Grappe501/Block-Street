"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { INITIATIVE_TYPES } from "@/lib/civic-action/builds/11.1/constitution";
import { WIZARD_STEPS_EN } from "@/lib/civic-action/builds/11.1/ux/locale";
import { InitiativeBlockedState } from "@/features/initiatives/components/InitiativeBlockedState";
import type { HumanBlockedState } from "@/lib/civic-action/builds/11.1/ux";

export default function InitiativeCreationWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [blocked, setBlocked] = useState<HumanBlockedState | null>(null);
  const [form, setForm] = useState({
    name: "",
    problem: "",
    type: "program",
    visibility: "institution_internal",
    proposed_owner: "usr-002",
  });

  const current = WIZARD_STEPS_EN[step]!;

  async function saveDraft() {
    setSaving(true);
    setBlocked(null);
    try {
      const res = await fetch("/api/v1/initiatives/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command_type: "CreateInitiativeDraftCommand",
          payload: {
            governing_institution_id: "inst-block-street",
            initiative_name: form.name,
            initiative_type: form.type,
            initial_problem_or_opportunity: form.problem,
            proposed_operational_owner_optional: form.proposed_owner,
            visibility: form.visibility,
          },
        }),
      });
      const json = await res.json();
      const data = json.data ?? json;
      if (data.human_blocked) {
        setBlocked(data.human_blocked);
        return;
      }
      if (data.result?.success && data.result.initiative_id) {
        router.push(`/initiatives/${data.result.initiative_id}/charter`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/initiatives" className="text-sm text-orange-700 underline">← Our Initiatives</Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">Propose an Initiative</h1>
      <p className="mt-2 text-slate-600">Step {step + 1} of {WIZARD_STEPS_EN.length}: {current.title}</p>

      <div className="mt-8 card">
        <p className="text-sm text-slate-600">{current.prompt}</p>

        {step === 0 && (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium">Working name
              <input className="mt-1 w-full rounded border px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">What need or opportunity brings us together?
              <textarea className="mt-1 w-full rounded border px-3 py-2" rows={4} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 grid gap-2">
            {INITIATIVE_TYPES.map((t) => (
              <label key={t.type} className={`rounded border p-3 cursor-pointer ${form.type === t.type ? "border-orange-400 bg-orange-50" : ""}`}>
                <input type="radio" className="sr-only" name="type" checked={form.type === t.type} onChange={() => setForm({ ...form, type: t.type })} />
                <span className="font-semibold capitalize">{t.type.replace(/_/g, " ")}</span>
                <p className="text-xs text-slate-600">{t.definition}</p>
              </label>
            ))}
          </div>
        )}

        {step === 5 && (
          <p className="mt-4 text-sm text-amber-900 rounded bg-amber-50 p-3">
            These Humans are being nominated. They do not become owners until they accept and any required approval is complete.
          </p>
        )}

        {step === 6 && (
          <select className="mt-4 w-full rounded border px-3 py-2" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="private">Private Draft</option>
            <option value="institution_internal">Institution Internal</option>
            <option value="member_public">Member Visible</option>
            <option value="public">Public (does not auto-publish)</option>
          </select>
        )}

        {step === 7 && (
          <div className="mt-4 text-sm space-y-2">
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Type:</strong> {form.type}</p>
            <p><strong>Visibility:</strong> {form.visibility}</p>
            <p className="text-slate-600">Saving creates a Concept-stage proposal. It does not activate or approve execution.</p>
          </div>
        )}

        {blocked && <div className="mt-4"><InitiativeBlockedState state={blocked} /></div>}

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 0 && (
            <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {step < WIZARD_STEPS_EN.length - 1 ? (
            <button type="button" className="btn-primary" onClick={() => setStep(step + 1)} disabled={step === 0 && (!form.name || !form.problem)}>Continue</button>
          ) : (
            <button type="button" className="btn-primary" onClick={saveDraft} disabled={saving}>{saving ? "Saving…" : "Save as Concept"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
