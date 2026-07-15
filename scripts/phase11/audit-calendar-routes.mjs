#!/usr/bin/env node
/**
 * CAL-P2 calendar route/link audit — verifies internal hrefs resolve to app pages.
 */
import "../h-drive-env.mjs";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const app = join(root, "src", "app");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name === "page.tsx" || name === "page.ts") acc.push(p);
  }
  return acc;
}

function routeFromPage(pagePath) {
  const rel = relative(app, pagePath).replace(/\\/g, "/");
  const parts = rel.split("/").filter((p) => p !== "page.tsx" && p !== "page.ts");
  const out = [];
  for (const part of parts) {
    if (part.startsWith("(") && part.endsWith(")")) continue;
    if (part.startsWith("[") && part.endsWith("]")) {
      out.push(`:${part.slice(1, -1)}`);
    } else {
      out.push(part);
    }
  }
  return "/" + out.join("/");
}

const pages = walk(app);
const routes = new Set(pages.map(routeFromPage));

function resolveHref(href) {
  if (!href.startsWith("/calendar") && !href.startsWith("/command")) return true;
  const pathOnly = href.split("?")[0].split("#")[0];
  const segments = pathOnly.split("/").filter(Boolean);
  let pattern = "";
  for (const seg of segments) {
    pattern += "/" + seg;
    const candidates = [...routes].filter((r) => {
      const rSegs = r.split("/").filter(Boolean);
      const hSegs = pattern.split("/").filter(Boolean);
      if (rSegs.length !== hSegs.length) return false;
      return rSegs.every((rs, i) => rs.startsWith(":") || rs === hSegs[i]);
    });
    if (candidates.length === 0 && !routes.has(pattern)) {
      return false;
    }
  }
  return [...routes].some((r) => {
    const rSegs = r.split("/").filter(Boolean);
    if (rSegs.length !== segments.length) return false;
    return rSegs.every((rs, i) => rs.startsWith(":") || rs === segments[i]);
  });
}

const scanDirs = [
  join(root, "src", "components", "calendar"),
  join(root, "src", "app", "calendar"),
  join(root, "src", "app", "command", "events"),
];
const hrefRe = /href=\{?`([^`]+)`\}?|href="([^"]+)"/g;
const missing = [];
const checked = new Set();

for (const dir of scanDirs) {
  if (!existsSync(dir)) continue;
  for (const file of walk(dir).concat(walk(dir).length ? [] : [])) {
    // walk only gets pages; scan all tsx in dirs
  }
}

function walkTsx(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkTsx(p, acc);
    else if (/\.(tsx|ts|jsx|js)$/.test(name)) acc.push(p);
  }
  return acc;
}

for (const dir of scanDirs) {
  for (const file of walkTsx(dir)) {
    const text = readFileSync(file, "utf8");
    let m;
    while ((m = hrefRe.exec(text))) {
      const href = m[1] ?? m[2];
      if (!href || href.startsWith("http") || href === "#") continue;
      const key = `${file}:${href}`;
      if (checked.has(key)) continue;
      checked.add(key);
      if (href.includes("${")) continue;
      if (!resolveHref(href)) missing.push({ file: relative(root, file), href });
    }
  }
}

const badColors = [];
const colorRe = /className="[^"]*text-(?!field-|white|amber-|red-|emerald-)[a-z]+-/g;
for (const dir of scanDirs) {
  for (const file of walkTsx(dir)) {
    const text = readFileSync(file, "utf8");
    if (colorRe.test(text)) badColors.push(relative(root, file));
  }
}

console.log(`calendar:route-audit — ${routes.size} app routes indexed`);
console.log(`calendar:route-audit — ${checked.size} internal hrefs checked`);
if (missing.length) {
  console.error("MISSING ROUTES:");
  for (const m of missing) console.error(`  ${m.href} ← ${m.file}`);
  process.exit(1);
}
if (badColors.length) {
  console.warn(`calendar:route-audit WARN — ${badColors.length} files with non-field text color tokens`);
}
console.log("calendar:route-audit PASS");
