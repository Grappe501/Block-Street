"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ObjectiveBuilderView } from "@/lib/civic-action/builds/11.2/ux";
import { ObjectiveBlockedState } from "./ObjectiveBlockedState";
import type { HumanBlockedState } from "@/lib/civic-action/builds/11.2/ux";

export function ObjectiveBuilderWizard({ builder }: { builder: ObjectiveBuilderView }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [blocked, setBlocked] = useState<HumanBlockedState | null>(null);
  const [form, setForm] = useState({
    purpose: "",
    desired_future_state: "",
    success_definition: "",
    measurement_strategy: "",
    operational_owner_human_id: "usr-002",
    display_name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const current = builder.steps[step]!;

  async function submit() {
    setSubmitting(true);
    setBlocked(null);
    const display_name = form.display_name || form.purpose.slice(0, 80);
    const res = await fetch("/api/v1/civic-action/objectives/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command_type: "CreateObjective",
        initiative_id: builder.initiative_id,
        payload: {
          initiative_id: builder.initiative_id,
          display_name,
          objective_type: "operational",
          purpose: form.purpose,
          desired_future_state: form.desired_future_state,
          current_state: "Not started",
          executive_owner_human_id: "usr-001",
          operational_owner_human_id: form.operational_owner_human_id,
          review_authority_human_id: "usr-001",
          success_definition: form.success_definition,
          measurement_strategy: form.measurement_strategy,
          evidence_requirements: "Documented proof of progress",
        },
      }),
    });
    const json = await res.json();
    const data = json.data ?? json;
    if (data.human_blocked) {
      setBlocked(data.human_blocked);
      setSubmitting(false);
      return;
    }
    if (data.result?.success && data.entity_id) {
      router.push(`/initiatives/${builder.initiative_id}/objectives/${data.entity_id}`);
    }
    setSubmitting(false);
  }

  return (
    <div className="card max-w-2xl">
      <p className="text-sm text-slate-500">
        Step {step + 1} of {builder.steps.length}
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-900">{current.title}</h2>
      <p className="mt-2 text-slate-600">{current.prompt}</p>

      {current.field === "purpose" && (
        <textarea
          className="mt-4 w-full rounded border border-slate-300 p-3"
          rows={4}
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          aria-label="Purpose"
        />
      )}
      {current.field === "desired_future_state" && (
        <textarea
          className="mt-4 w-full rounded border border-slate-300 p-3"
          rows={3}
          value={form.desired_future_state}
          onChange={(e) => setForm({ ...form, desired_future_state: e.target.value })}
        />
      )}
      {current.field === "success_definition" && (
        <textarea
          className="mt-4 w-full rounded border border-slate-300 p-3"
          rows={3}
          value={form.success_definition}
          onChange={(e) => setForm({ ...form, success_definition: e.target.value })}
        />
      )}
      {current.field === "measurement_strategy" && (
        <textarea
          className="mt-4 w-full rounded border border-slate-300 p-3"
          rows={3}
          value={form.measurement_strategy}
          onChange={(e) => setForm({ ...form, measurement_strategy: e.target.value })}
        />
      )}
      {current.field === "operational_owner_human_id" && (
        <select
          className="mt-4 w-full rounded border border-slate-300 p-3"
          value={form.operational_owner_human_id}
          onChange={(e) => setForm({ ...form, operational_owner_human_id: e.target.value })}
        >
          <option value="usr-002">Maria Lopez</option>
          <option value="usr-001">Steve Grappe</option>
        </select>
      )}
      {current.field === "review" && (
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>
            <strong>Purpose:</strong> {form.purpose}
          </p>
          <p>
            <strong>Desired state:</strong> {form.desired_future_state}
          </p>
          <label className="block pt-2">
            Display name
            <input
              className="mt-1 w-full rounded border border-slate-300 p-2"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              placeholder={form.purpose.slice(0, 60)}
            />
          </label>
        </div>
      )}

      {blocked && (
        <div className="mt-4">
          <ObjectiveBlockedState state={blocked} />
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {step < builder.steps.length - 1 ? (
          <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>
            Continue
          </button>
        ) : (
          <button type="button" className="btn-primary" disabled={submitting} onClick={submit}>
            {submitting ? "Creating…" : "Create Objective"}
          </button>
        )}
      </div>
    </div>
  );
}
