/**
 * Build Arkansas private + charter school registry from ADE reports.
 * Run: node scripts/build-private-charter-schools-registry.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const countiesPath = join(root, "data/counties.json");
const outPath = join(root, "data/registry/private-charter-schools.json");
const coveragePath = join(root, "data/registry/private-charter-coverage.json");
const rawDir = join(root, "data/raw");

mkdirSync(rawDir, { recursive: true });

/** ADE 2-digit county code → slug */
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
const countyBySlug = Object.fromEntries(counties.map((c) => [c.slug, c.name]));

function leaCountyCode(lea) {
  return lea.substring(0, 2);
}

function countyFromLea(lea) {
  const code = leaCountyCode(lea);
  return { code, slug: ADE_COUNTY_CODE_TO_SLUG[code] ?? null };
}

function titleCase(str) {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function titleCaseName(name) {
  const small = new Set(["of", "and", "the", "at", "in", "for", "a", "an"]);
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && small.has(lower)) return lower;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

function countyLabel(slug) {
  const name = slug ? countyBySlug[slug] ?? "Arkansas" : "Arkansas";
  return name.endsWith(" County") ? name : `${name} County`;
}

function slugify(name, suffix) {
  const base =
    name
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + suffix;
  return base;
}

function parseCityFromAddress(addr) {
  const clean = addr.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
  const m = clean.match(/,\s*Ar\s+\d{5}/i);
  if (m) {
    const before = clean.slice(0, m.index).trim();
    const parts = before.split(/\s+/);
    const cityParts = [];
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (/^P\.?O\.?\s*Box$/i.test(p) || /^Box$/i.test(p) || /^\d/.test(p)) break;
      cityParts.unshift(p);
      if (cityParts.length >= 3) break;
    }
    if (cityParts.length) return titleCase(cityParts.join(" "));
  }
  return "Arkansas";
}

function formatGrades(low, high) {
  const l = (low || "").trim() || "?";
  const h = (high || "").trim() || "?";
  return `${l}-${h}`;
}

function fieldValue(chunk, label) {
  const re = new RegExp(
    `<th scope="row" width="50%">${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/th>\\s*<td>([\\s\\S]*?)<\\/td>`,
    "i"
  );
  const m = chunk.match(re);
  if (!m) return "";
  return m[1].replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
}

function parsePrivateSchools(html) {
  const schools = [];
  const parts = html.split(/<th scope="col" width="50%">/);
  for (let i = 1; i < parts.length; i++) {
    const headEnd = parts[i].indexOf("</th>");
    if (headEnd === -1) continue;
    const rawName = parts[i].slice(0, headEnd).trim();
    if (!rawName || rawName.includes("FISCAL YEAR")) continue;

    const chunk = parts[i];
    const districtLea = fieldValue(chunk, "District LEA");
    if (!districtLea) continue;

    const enrollment = parseInt(fieldValue(chunk, "Private Students"), 10) || 0;
    const gradeLow = fieldValue(chunk, "Grade Low");
    const gradeHigh = fieldValue(chunk, "Grade High");
    const mailing = fieldValue(chunk, "Mailing Address");
    const district = fieldValue(chunk, "District");
    const { code: countyCode, slug: countySlug } = countyFromLea(districtLea);
    const city = parseCityFromAddress(mailing);
    const name = titleCaseName(rawName);
    const shortName = name.replace(/\s+(Academy|School|Center|Institute).*$/i, "").trim() || name;

    schools.push({
      rawName,
      name,
      shortName,
      type: "private_school",
      sector: "private",
      districtLea,
      district: titleCaseName(district),
      lea: null,
      county: countySlug,
      countyCode,
      city,
      grades: formatGrades(gradeLow, gradeHigh),
      enrollment,
      mailingAddress: mailing,
    });
  }
  return schools;
}

function parseCharterSchools(html) {
  const rows = [];
  const re = /<td>(\d{7})<\/td><td>([^<]+)<\/td>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    rows.push({ lea: m[1], name: m[2].trim() });
  }
  return rows;
}

async function fetchPrivatePage(page) {
  const url = `https://adedata.arkansas.gov/statewide/reportlist/Schools/PrivateSchools.aspx?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ADE private page ${page} failed: ${res.status}`);
  return res.text();
}

async function fetchCharterPage(page) {
  const url = `https://adedata.arkansas.gov/statewide/reportlist/Schools/CharterSchools.aspx?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ADE charter page ${page} failed: ${res.status}`);
  return res.text();
}

async function fetchAllPrivate() {
  const all = [];
  let page = 1;
  let emptyStreak = 0;
  while (page <= 20 && emptyStreak < 2) {
    const html = await fetchPrivatePage(page);
    writeFileSync(join(rawDir, `ade-private-p${page}.html`), html);
    const rows = parsePrivateSchools(html);
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

async function fetchAllCharter() {
  const all = [];
  let page = 1;
  let emptyStreak = 0;
  while (page <= 15 && emptyStreak < 2) {
    const html = await fetchCharterPage(page);
    writeFileSync(join(rawDir, `ade-charter-p${page}.html`), html);
    const rows = parseCharterSchools(html);
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

const privateRows = await fetchAllPrivate();
const charterRows = await fetchAllCharter();

const slugCounts = {};

function assignSlug(base, key) {
  slugCounts[base] = (slugCounts[base] ?? 0) + 1;
  return slugCounts[base] > 1 ? `${base}-${key}` : base;
}

const privateSchools = privateRows.map((row) => {
  const baseSlug = slugify(row.name, "-private");
  const slug = assignSlug(baseSlug, row.districtLea);
  const countyName = row.county ? countyBySlug[row.county] ?? "Arkansas" : "Arkansas";

  return {
    slug,
    name: row.name,
    shortName: row.shortName,
    type: "private_school",
    sector: "private",
    lea: row.lea,
    districtLea: row.districtLea,
    district: row.district,
    county: row.county,
    countyCode: row.countyCode,
    city: row.city,
    grades: row.grades,
    enrollment: row.enrollment,
    website: "",
    colors: { primary: "#7c3aed", secondary: "#ffffff" },
    culture: `Private school in ${countyLabel(row.county)}. A local organizing home for students ages 16–24.`,
    representationStatus: "needs_organizer",
    v1Priority: true,
    dataSource: "ADE Private Schools 2025-2026",
  };
});

// Deduplicate private by name + district LEA
const privateByKey = new Map();
for (const s of privateSchools) {
  const key = `${s.districtLea}:${s.name.toUpperCase()}`;
  if (!privateByKey.has(key)) privateByKey.set(key, s);
}
const uniquePrivate = [...privateByKey.values()];

const charterSchools = charterRows.map((row) => {
  const { code: countyCode, slug: countySlug } = countyFromLea(row.lea);
  const name = titleCaseName(row.name);
  const shortName = name
    .replace(/\s+(HIGH|SENIOR)\s+SCHOOL.*$/i, "")
    .replace(/\s+CHARTER.*$/i, "")
    .trim() || name;
  const baseSlug = slugify(name, "-charter");
  const slug = assignSlug(baseSlug, row.lea);
  const isHigh = /HIGH SCHOOL|SENIOR HIGH|GRADES?\s*9/i.test(row.name);

  return {
    slug,
    name,
    shortName,
    type: "charter_school",
    sector: "charter",
    lea: row.lea,
    districtLea: row.lea.substring(0, 4) + "000",
    district: "",
    county: countySlug,
    countyCode,
    city: titleCase(shortName.split(/\s+/).slice(0, 2).join(" ")) || "Arkansas",
    grades: isHigh ? "9-12" : "K-12",
    enrollment: 0,
    website: "",
    colors: { primary: "#059669", secondary: "#ffffff" },
    culture: `Charter school in ${countyLabel(countySlug)}. A local organizing home for students ages 16–24.`,
    representationStatus: "needs_organizer",
    v1Priority: true,
    dataSource: "ADE Charter Schools 2025-2026",
  };
});

const charterByLea = new Map();
for (const s of charterSchools) {
  if (!charterByLea.has(s.lea)) charterByLea.set(s.lea, s);
}
const uniqueCharter = [...charterByLea.values()];

const allSchools = [...uniquePrivate, ...uniqueCharter].sort(
  (a, b) =>
    (a.sector ?? "").localeCompare(b.sector ?? "") ||
    (a.county ?? "").localeCompare(b.county ?? "") ||
    a.name.localeCompare(b.name)
);

const byCountyPrivate = {};
const byCountyCharter = {};
const byCountyAll = {};

for (const s of uniquePrivate) {
  if (!s.county) continue;
  (byCountyPrivate[s.county] ??= []).push(s.slug);
  (byCountyAll[s.county] ??= []).push(s.slug);
}
for (const s of uniqueCharter) {
  if (!s.county) continue;
  (byCountyCharter[s.county] ??= []).push(s.slug);
  (byCountyAll[s.county] ??= []).push(s.slug);
}

const countiesWithPrivate = Object.keys(byCountyPrivate).length;
const countiesWithCharter = Object.keys(byCountyCharter).length;
const countiesWithAny = Object.keys(byCountyAll).length;
const missingPrivate = counties.filter((c) => !byCountyPrivate[c.slug]).map((c) => c.slug);
const orphan = allSchools.filter((s) => !s.county);

const registry = {
  version: "1.0.0",
  source: "Arkansas Department of Education — Private Schools & Charter Schools (2025-2026)",
  sourceUrls: {
    private: "https://adedata.arkansas.gov/statewide/reportlist/Schools/PrivateSchools.aspx",
    charter: "https://adedata.arkansas.gov/statewide/reportlist/Schools/CharterSchools.aspx",
  },
  lastBuilt: new Date().toISOString().slice(0, 10),
  totalPrivateSchools: uniquePrivate.length,
  totalCharterSchools: uniqueCharter.length,
  totalSchools: allSchools.length,
  countiesWithPrivateSchool: countiesWithPrivate,
  countiesWithCharterSchool: countiesWithCharter,
  countiesWithPrivateOrCharter: countiesWithAny,
  schools: allSchools,
};

writeFileSync(outPath, JSON.stringify(registry, null, 2) + "\n");

const coverage = {
  version: "1.0.0",
  lastUpdated: registry.lastBuilt,
  totalPrivateSchools: uniquePrivate.length,
  totalCharterSchools: uniqueCharter.length,
  countiesWithPrivateSchool: countiesWithPrivate,
  countiesWithCharterSchool: countiesWithCharter,
  countiesWithPrivateOrCharter: countiesWithAny,
  totalCounties: counties.length,
  countiesWithoutPrivateSchool: missingPrivate,
  orphanCount: orphan.length,
  byCountyPrivate,
  byCountyCharter,
  byCounty: byCountyAll,
};

writeFileSync(coveragePath, JSON.stringify(coverage, null, 2) + "\n");

console.log(`Private schools: ${uniquePrivate.length}`);
console.log(`Charter schools: ${uniqueCharter.length}`);
console.log(`Total: ${allSchools.length}`);
console.log(`Counties with private: ${countiesWithPrivate}/75`);
console.log(`Counties with charter: ${countiesWithCharter}/75`);
console.log(`Counties with private or charter: ${countiesWithAny}/75`);
if (missingPrivate.length) console.log(`Counties without private school: ${missingPrivate.length}`);
if (orphan.length) console.warn("Schools without county mapping:", orphan.length);
