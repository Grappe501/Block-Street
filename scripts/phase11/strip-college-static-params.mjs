import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src/app/college/[collegeSlug]");
const home = path.join(root, "page.tsx");

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name === "page.tsx" && path.resolve(p) !== path.resolve(home)) {
      let src = fs.readFileSync(p, "utf8");
      if (!src.includes("generateStaticParams")) continue;
      src = src.replace(/\nexport function generateStaticParams\(\) \{\n  return collegeStaticParams\(\);\n\}\n/, "\n");
      src = src.replace(/import \{ collegeStaticParams, requireCollege \}/g, "import { requireCollege }");
      fs.writeFileSync(p, src);
      console.log("stripped", path.relative(root, p));
    }
  }
}

walk(root);
