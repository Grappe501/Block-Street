/**
 * Build Arkansas public high school registry from ADE County List - School report.
 * Run: node scripts/build-high-schools-registry.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const countiesPath = join(root, "data/counties.json");
const outPath = join(root, "data/registry/high-schools.json");
const coveragePath = join(root, "data/registry/high-school-coverage.json");
const rawDir = join(root, "data/raw");

mkdirSync(rawDir, { recursive: true });

/** ADE 2-digit county code → slug (alphabetical by county name) */
const ADE_COUNTY_CODE_TO_SLUG = {
  "01": "arkansas", "02": "ashley", "03": "baxter", "04": "benton", "05": "boone",
  "06": "bradley", "07": "calhoun", "08": "carroll", "09": "chicot", "10": "clark",
  "11": "clay", "12": "cleburne", "13": "cleveland", "14": "columbia", "15": "conway",
  "16": "craighead", "17": "crawford", "18": "crittenden", "19": "cross", "20": "dallas",
  "21": "desha", "22": "drew", "23": "faulkner", "24": "franklin", "25": "fulton",
  "26": "garland", "27": "grant", "28": "greene", "29": "hempstead", "30": "hot-spring",
  "31": "howard", "32": "independence", "33": "izard", "34": "jackson", "35": "jefferson",
  "36": "johnson", "37": "lafayette", "38": "lawrence", "39": "lee", "40": "lincoln",
  "41": "little-river", "42": "logan", "43": "lonoke", "44": "madison", "45": "marion",
  "46": "miller", "47": "mississippi", "48": "monroe", "49": "montgomery", "50": "nevada",
  "51": "newton", "52": "ouachita", "53": "perry", "54": "phillips", "55": "pike",
  "56": "poinsett", "57": "polk", "58": "pope", "59": "prairie", "60": "pulaski",
  "61": "randolph", "62": "saline", "63": "scott", "64": "searcy", "65": "sebastian",
  "66": "sevier", "67": "sharp", "68": "st-francis", "69": "stone", "70": "union",
  "71": "van-buren", "72": "washington", "73": "white", "74": "woodruff", "75": "yell",
};

const counties = JSON.parse(readFileSync(countiesPath, "utf8"));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-high-school$/, "")
    .replace(/-school$/, "") + "-hs";
}

function isPublicHighSchool(name) {
  const n = name.toUpperCase();
  if (!n.includes("HIGH SCHOOL") && !n.includes("SENIOR HIGH")) return false;
  if (n.includes("JUNIOR HIGH")) return false;
  if (n.includes("ELEMENTARY")) return false;
  if (n.includes("MIDDLE SCHOOL") && !n.includes("HIGH")) return false;
  if (n.includes("PRESCHOOL")) return false;
  return true;
}

function parseRows(html) {
  const rows = [];
  const re = /<td>(\d{2})<\/td><td>([^<]+)<\/td><td>(\d+)<\/td><td>([^<]+)<\/td>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    rows.push({ countyCode: m[1], countyName: m[2].trim(), lea: m[3], name: m[4].trim() });
  }
  return rows;
}

async function fetchPage(page) {
  const url = `https://adedata.arkansas.gov/statewide/reportlist/Counties/CountyListSchool.aspx?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ADE page ${page} failed: ${res.status}`);
  return res.text();
}

async function fetchAllRows() {
  const all = [];
  let page = 1;
  let emptyStreak = 0;
  while (page <= 120 && emptyStreak < 2) {
    const html = await fetchPage(page);
    writeFileSync(join(rawDir, `ade-county-schools-p${page}.html`), html);
    const rows = parseRows(html);
    if (rows.length === 0) {
      emptyStreak++;
    } else {
      emptyStreak = 0;
      all.push(...rows);
    }
    page++;
    await new Promise((r) => setTimeout(r, 150));
  }
  return all;
}

function leaCountyCode(lea) {
  return lea.substring(0, 2);
}

function titleCaseCity(name) {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function inferCity(schoolName) {
  const n = schoolName.replace(/\s+(HIGH|SENIOR)\s+SCHOOL.*$/i, "").trim();
  if (n.length > 2) return titleCaseCity(n);
  return "Arkansas";
}

const allRows = await fetchAllRows();
const highSchoolRows = allRows.filter((r) => isPublicHighSchool(r.name));

const slugCounts = {};
const schools = highSchoolRows.map((row) => {
  const countySlug =
    ADE_COUNTY_CODE_TO_SLUG[row.countyCode] ??
    ADE_COUNTY_CODE_TO_SLUG[leaCountyCode(row.lea)] ??
    null;

  let baseSlug = slugify(row.name);
  slugCounts[baseSlug] = (slugCounts[baseSlug] ?? 0) + 1;
  const slug = slugCounts[baseSlug] > 1 ? `${baseSlug}-${row.lea}` : baseSlug;

  const shortName = row.name
    .replace(/\s+HIGH SCHOOL$/i, "")
    .replace(/\s+SENIOR HIGH SCHOOL$/i, "")
    .replace(/\s+CHARTER$/i, "")
    .trim();

  return {
    slug,
    name: row.name
      .split(" ")
      .map((w) => (w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0) + w.slice(1).toLowerCase()))
      .join(" ")
      .replace(/\bHigh School\b/i, "High School")
      .replace(/\bAr\b/, "AR"),
    shortName,
    type: "high_school",
    sector: "public",
    lea: row.lea,
    county: countySlug,
    countyCode: row.countyCode,
    city: inferCity(row.name),
    grades: "9-12",
    enrollment: 0,
    website: "",
    colors: { primary: "#1e40af", secondary: "#ffffff" },
    culture: `Public high school in ${row.countyName} County, Arkansas. A local organizing home for students ages 16–24.`,
    representationStatus: "needs_organizer",
    v1Priority: true,
    dataSource: "ADE County List - School 2025-2026",
  };
});

// Deduplicate by LEA (same school shouldn't appear twice)
const byLea = new Map();
for (const s of schools) {
  if (!byLea.has(s.lea)) byLea.set(s.lea, s);
}
const unique = [...byLea.values()].sort((a, b) =>
  (a.county ?? "").localeCompare(b.county ?? "") || a.name.localeCompare(b.name)
);

const byCounty = {};
for (const s of unique) {
  if (!s.county) continue;
  (byCounty[s.county] ??= []).push(s.slug);
}

const countiesWithHs = Object.keys(byCounty).length;
const missingCountySlugs = counties.filter((c) => !byCounty[c.slug]).map((c) => c.slug);
const orphan = unique.filter((s) => !s.county);

const registry = {
  version: "1.0.0",
  source: "Arkansas Department of Education — County List School (2025-2026)",
  sourceUrl: "https://adedata.arkansas.gov/statewide/reportlist/Counties/CountyListSchool.aspx",
  lastBuilt: new Date().toISOString().slice(0, 10),
  totalSchools: unique.length,
  countiesWithHighSchool: countiesWithHs,
  schools: unique,
};

writeFileSync(outPath, JSON.stringify(registry, null, 2) + "\n");

const coverage = {
  version: "1.0.0",
  lastUpdated: registry.lastBuilt,
  totalHighSchools: unique.length,
  countiesWithLocalHighSchool: countiesWithHs,
  totalCounties: counties.length,
  missingCounties: missingCountySlugs,
  orphanLeaCount: orphan.length,
  byCounty,
};

writeFileSync(coveragePath, JSON.stringify(coverage, null, 2) + "\n");

console.log(`ADE rows fetched: ${allRows.length}`);
console.log(`Public high schools: ${unique.length}`);
console.log(`Counties with ≥1 high school: ${countiesWithHs}/75`);
if (missingCountySlugs.length) console.warn("Counties without high school:", missingCountySlugs.join(", "));
if (orphan.length) console.warn("Schools without county mapping:", orphan.length);
