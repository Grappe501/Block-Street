"use client";

/**
 * Suggestion prompts only — never auto-posts on behalf of Humans.
 */
export function AICommunicationAssistant({ prompts }: { prompts: string[] }) {
  return (
    <section aria-labelledby="ai-assistant-heading" className="card border-teal-100 bg-teal-50/50">
      <h2 id="ai-assistant-heading" className="text-sm font-bold text-teal-900">
        AI Assistant
      </h2>
      <p className="mt-1 text-xs text-teal-800">
        Suggestions only — you review and post every message yourself.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              className="rounded-full border border-teal-300 bg-white px-3 py-1 text-xs text-teal-900 hover:bg-teal-50"
              onClick={() => {
                /* UI hook — no auto-post */
              }}
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
