"use client";

import identity from "../../../data/registry/community-identity.json";

export function AdminCommunityIdentity() {
  const countyConfig = identity.entityTypeConfig.county;
  const instConfig = identity.entityTypeConfig.institution;

  return (
    <div className="space-y-6">
      <div className="card border-purple-300 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">PHASE-002.7 · Community Identity System</p>
        <h2 className="mt-1 text-xl font-bold text-purple-950">Community DNA</h2>
        <p className="mt-2 text-sm font-medium text-purple-900">{identity.motto}</p>
        <p className="mt-2 text-sm italic text-purple-800">&ldquo;{identity.coreQuestion}&rdquo;</p>
        <p className="mt-1 text-sm text-purple-800">{identity.answer}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Community Layers [CID-M04]</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {identity.communityLayers.map((layer) => (
            <div key={layer.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-900">{layer.name}</p>
              <p className="mt-1 text-xs text-slate-600">{layer.examples.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community DNA Categories [CID-M14]</h2>
        <p className="mt-1 text-sm text-brand-800">One schema — counties, campuses, committees, profiles.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {identity.dnaCategories.map((cat) => (
            <span key={cat.key} className="badge bg-white text-brand-800 border border-brand-200">
              {cat.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="font-bold text-slate-900">County [CID-M05]</h3>
          <p className="mt-1 font-mono text-xs text-brand-600">{countyConfig.route}</p>
          <p className="mt-2 text-xs text-slate-600">
            Required: {countyConfig.requiredCategories.join(", ")}
          </p>
        </div>
        <div className="card">
          <h3 className="font-bold text-slate-900">Institution [CID-M06]</h3>
          <p className="mt-1 font-mono text-xs text-brand-600">{instConfig.route}</p>
          <p className="mt-2 text-xs text-slate-600">
            Required: {instConfig.requiredCategories.join(", ")}
          </p>
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">IP Boundaries [CID-M07]</h2>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-red-800">Avoid</p>
            <ul className="mt-1 list-inside list-disc text-xs text-red-900">
              {identity.personalizationBoundaries.prohibited.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-green-800">Prefer</p>
            <ul className="mt-1 list-inside list-disc text-xs text-green-900">
              {identity.personalizationBoundaries.preferred.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Welcome Experience [CID-M09]</h2>
        <p className="mt-1 text-sm text-slate-600">{identity.welcomeExperience.rule}</p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-700">
          {identity.welcomeExperience.sections.map((s) => (
            <li key={s.id}>{s.heading}{s.v1 === "future" ? " (future)" : ""}</li>
          ))}
        </ol>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Render Pipeline [CID-M16]</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-xs font-mono text-slate-600">
          {identity.renderPipeline.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-slate-500">
        Full spec: docs/phase-02/COMMUNITY_IDENTITY_PERSONALIZATION_SYSTEM.md · CID-001
      </p>
    </div>
  );
}
