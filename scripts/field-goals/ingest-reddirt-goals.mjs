#!/usr/bin/env node
/**
 * Discover + ingest RedDirt county registration goals and VCI into Block-Street.
 * READ-ONLY against H:\SOSWebsite\RedDirt — writes only into H:\Block-Street.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const REDDIRT = process.env.REDDIRT_ROOT || "H:\\SOSWebsite\\RedDirt";

const GOALS_SRC = path.join(
  REDDIRT,
  "docs/strategic-plan/plurality-victory-plan/part-ii-electoral-math/chapter-05-fifty-thousand-new-voter-plan/statewide-registration-summary.json"
);
const VCI_SRC = path.join(
  REDDIRT,
  "docs/strategic-plan/plurality-victory-plan/command-center/victory-contribution-index.json"
);
const SCORE_SRC = path.join(
  REDDIRT,
  "docs/strategic-plan/plurality-victory-plan/opportunity-scorecard/statewide-opportunity-scorecard.json"
);

const OUT_DIR = path.join(ROOT, "data", "field-goals");
const AUDIT_MD = path.join(ROOT, "docs", "v2", "REDDIRT_FIELD_GOAL_SOURCE_AUDIT.md");
const AUDIT_JSON = path.join(ROOT, "data", "v2", "reddirt-field-goal-source-audit.json");

function mustRead(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing RedDirt source: ${p}`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function normalizeSlug(slug) {
  return String(slug || "")
    .toLowerCase()
    .replace(/-county$/, "")
    .replace(/_/g, "-")
    .trim();
}

function main() {
  const goalsFile = mustRead(GOALS_SRC);
  const vciFile = mustRead(VCI_SRC);
  const scoreFile = fs.existsSync(SCORE_SRC) ? mustRead(SCORE_SRC) : null;

  const goalBySlug = new Map();
  for (const g of goalsFile.goals || []) {
    goalBySlug.set(normalizeSlug(g.slug), g);
  }
  const vciBySlug = new Map();
  for (const c of vciFile.counties || []) {
    vciBySlug.set(normalizeSlug(c.slug), c);
  }
  const fipsBySlug = new Map();
  if (scoreFile?.counties) {
    for (const c of scoreFile.counties) {
      fipsBySlug.set(normalizeSlug(c.slug || c.county), c.fips || c.countyFips || null);
    }
  }

  const allSlugs = new Set([...goalBySlug.keys(), ...vciBySlug.keys()]);
  const counties = [];
  const auditRows = [];
  const missing = [];
  const conflicts = [];

  for (const slug of [...allSlugs].sort()) {
    const g = goalBySlug.get(slug);
    const v = vciBySlug.get(slug);
    const reg = g?.goal;
    const vci = v?.vci;
    let confidence = "canonical";
    let ingestion = "ok";
    const notes = [];

    if (reg == null) {
      confidence = "missing";
      ingestion = "missing_registration_goal";
      missing.push({ slug, field: "voter_registration_goal" });
    }
    if (vci == null) {
      confidence = confidence === "missing" ? "missing" : "missing";
      ingestion = ingestion === "ok" ? "missing_vci" : ingestion + "+missing_vci";
      missing.push({ slug, field: "vci" });
    }

    if (g?.source) notes.push(`registration_source=${g.source}`);
    if (goalsFile.dbWarning) notes.push("chapter05_dbWarning_present");

    const row = {
      county_slug: slug,
      county_name: g?.county || v?.county || slug,
      county_fips: fipsBySlug.get(slug) || null,
      voter_registration_goal: reg ?? null,
      vci_value: vci ?? null,
      vci_rank: v?.rank ?? null,
      vci_priority: v?.priority ?? null,
      source_registration_file: path.relative(REDDIRT, GOALS_SRC).replace(/\\/g, "/"),
      source_registration_field: "goals[].goal",
      source_vci_file: path.relative(REDDIRT, VCI_SRC).replace(/\\/g, "/"),
      source_vci_field: "counties[].vci",
      source_version_or_timestamp: {
        registration: goalsFile.generatedAt || null,
        vci: vciFile.generatedAt || null,
      },
      calculation_method: {
        registration: g?.source || "unknown",
        vci: vciFile.formula || null,
      },
      source_confidence: confidence,
      ingestion_status: ingestion,
      notes: notes.join("; "),
    };
    auditRows.push(row);

    if (reg != null && vci != null) {
      counties.push({
        county_slug: slug,
        county_name: row.county_name,
        county_fips: row.county_fips,
        voter_registration_goal: Number(reg),
        vci: Number(vci),
        vci_rank: v?.rank ?? null,
        vci_priority: v?.priority ?? null,
        vci_definition: vciFile.formula,
        contribution_model: "county_total",
        source_kind: "reddirt_snapshot",
        source_reference: {
          registration: row.source_registration_file,
          vci: row.source_vci_file,
        },
        source_updated_at: {
          registration: goalsFile.generatedAt,
          vci: vciFile.generatedAt,
        },
        reddirt_registration_source: g?.source || null,
        institution_sub_goal_rule: "Math.ceil(county_goal * 0.25)",
        institution_sub_goal: Math.ceil(Number(reg) * 0.25),
      });
    }
  }

  if (counties.length !== 75) {
    throw new Error(`Expected 75 complete counties, got ${counties.length} (missing: ${JSON.stringify(missing)})`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(AUDIT_MD), { recursive: true });
  fs.mkdirSync(path.dirname(AUDIT_JSON), { recursive: true });

  const snapshot = {
    version: "1.0.0",
    ingested_at: new Date().toISOString(),
    reddirt_root: REDDIRT,
    statewide_registration_goal: goalsFile.statewideGoal ?? 50000,
    vci_definition: vciFile.formula,
    vci_use_cases: vciFile.useCases || [],
    institution_sub_goal_rule: "Math.ceil(county_voter_registration_goal * 0.25)",
    institution_contribution_model: "sub_goal_within_parent",
    note: "Institution sub-goals contribute toward the county total and must not be summed on top of it.",
    reddirt_db_warning: goalsFile.dbWarning || null,
    counties,
  };

  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "CountyFieldGoals",
    type: "object",
    required: ["version", "counties", "institution_sub_goal_rule"],
    properties: {
      counties: {
        type: "array",
        minItems: 75,
        maxItems: 75,
      },
    },
  };

  const manifest = {
    ingested_at: snapshot.ingested_at,
    sources: [
      { path: GOALS_SRC, role: "registration_goals", generatedAt: goalsFile.generatedAt },
      { path: VCI_SRC, role: "vci", generatedAt: vciFile.generatedAt },
      { path: SCORE_SRC, role: "fips_support", present: fs.existsSync(SCORE_SRC) },
    ],
    county_count: counties.length,
    missing,
    conflicts,
    write_targets: [
      "data/field-goals/county-field-goals.json",
      "data/field-goals/ingestion-manifest.json",
      "data/field-goals/source-lineage.json",
    ],
  };

  const lineage = {
    pattern: "RedDirt → read-only ingest → Block-Street snapshot → app views",
    no_runtime_h_drive_dependency: true,
    no_reddirt_writes: true,
    mapping: {
      "goals[].goal": "counties[].voter_registration_goal",
      "counties[].vci": "counties[].vci",
      institution_sub_goal: "Math.ceil(voter_registration_goal * 0.25)",
    },
    acronym_note:
      "RedDirt VCI = Victory Contribution Index. Distinct from any prior Block-Street 'Vote Civic Involvement' label.",
  };

  fs.writeFileSync(path.join(OUT_DIR, "county-field-goals.json"), JSON.stringify(snapshot, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "county-field-goals.schema.json"), JSON.stringify(schema, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "ingestion-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "source-lineage.json"), JSON.stringify(lineage, null, 2) + "\n");
  fs.writeFileSync(AUDIT_JSON, JSON.stringify({ version: "1.0.0", rows: auditRows, missing, conflicts }, null, 2) + "\n");

  const md = `# RedDirt Field Goal Source Audit

**Ingested:** ${snapshot.ingested_at}  
**Counties complete:** ${counties.length} / 75  
**Registration source:** \`${path.relative(REDDIRT, GOALS_SRC).replace(/\\/g, "/")}\`  
**VCI source:** \`${path.relative(REDDIRT, VCI_SRC).replace(/\\/g, "/")}\`

## Definitions

- **Voter registration goal** — RedDirt chapter-05 \`goals[].goal\` (Victory Plan allocation; current built artifacts use Lane-2-weighted 50k allocation when DB SoT unavailable).
- **VCI** — **Victory Contribution Index** (not Vote Civic Involvement):  
  \`${vciFile.formula}\`

## Clark County sample

| Field | Value |
|-------|------:|
| Registration goal | ${goalBySlug.get("clark")?.goal ?? "—"} |
| VCI | ${vciBySlug.get("clark")?.vci ?? "—"} |
| Institution 25% sub-goal | ${Math.ceil((goalBySlug.get("clark")?.goal || 0) * 0.25)} |

## Conflicts / caveats

${goalsFile.dbWarning ? `- Chapter-05 includes dbWarning: DB CountyCampaignStats unavailable at build time; artifacts used Lane-2-weighted allocation.\n` : "- None recorded between chapter-05 goals and VCI files for value mismatches.\n"}
- Block-Street must consume the checked-in snapshot only — no runtime dependency on \`H:\\SOSWebsite\\RedDirt\`.
- Machine twin: \`data/v2/reddirt-field-goal-source-audit.json\`
`;

  fs.writeFileSync(AUDIT_MD, md);
  console.log(`Ingested ${counties.length} counties → data/field-goals/county-field-goals.json`);
  if (missing.length) console.warn("Missing fields:", missing);
}

main();
