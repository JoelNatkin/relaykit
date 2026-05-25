// Run from marketing-site/ when adding or refreshing a tool wordmark in public/logos/tool_logos_wordmarks/ — recomputes each SVG's viewBox to the path content bounds so the home-page logo row sits flush.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { svgPathBbox } from "svg-path-bbox";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.resolve(
  __dirname,
  "../public/logos/tool_logos_wordmarks",
);

function stripDefsBlocks(text) {
  return text.replace(/<defs\b[\s\S]*?<\/defs>/gi, "");
}

function inspectComplexity(text, file) {
  const reasons = [];

  if (/<g\s[^>]*\btransform\s*=/i.test(text)) {
    reasons.push("<g transform=...> shifts coordinates");
  }
  // <g> wrappers without transform — typically clip-path wrappers from Figma
  // exports — don't shift coordinates and are safe to ignore for bbox purposes.
  // Any <g> with a transform is already caught above.

  if (/<path\s[^>]*\btransform\s*=/i.test(text)) {
    reasons.push("<path transform=...> shifts coordinates");
  }

  // Non-path geometry only matters if it's in the render tree (not inside
  // <defs>, where it serves as a clip-path / pattern / etc. definition).
  const renderTree = stripDefsBlocks(text);
  for (const tag of ["rect", "circle", "ellipse", "polygon", "polyline"]) {
    if (new RegExp(`<${tag}\\b`, "i").test(renderTree)) {
      reasons.push(`<${tag}> non-path geometry in render tree`);
    }
  }

  if (/<use\b/i.test(renderTree)) {
    reasons.push("<use> references in render tree");
  }

  if (reasons.length > 0) {
    console.error(`\n✗ ${file}: stop-on-complexity per plan.`);
    for (const r of reasons) console.error(`    - ${r}`);
    return false;
  }
  return true;
}

function extractPathData(text) {
  const paths = [];
  const re = /<path\b[^>]*\bd\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = re.exec(text)) !== null) paths.push(m[1]);
  return paths;
}

function fmt(n) {
  return Number(n.toFixed(3)).toString();
}

function tightenSvg(filePath) {
  const file = path.basename(filePath);
  const text = fs.readFileSync(filePath, "utf8");

  if (!inspectComplexity(text, file)) return false;

  const paths = extractPathData(text);
  if (paths.length === 0) {
    console.error(`✗ ${file}: no <path d=…> elements found.`);
    return false;
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const d of paths) {
    const [x0, y0, x1, y1] = svgPathBbox(d);
    if (x0 < minX) minX = x0;
    if (y0 < minY) minY = y0;
    if (x1 > maxX) maxX = x1;
    if (y1 > maxY) maxY = y1;
  }

  const newViewBox = `${fmt(minX)} ${fmt(minY)} ${fmt(maxX - minX)} ${fmt(maxY - minY)}`;

  let updated = text;
  if (/\sviewBox\s*=\s*"/.test(updated)) {
    updated = updated.replace(
      /(<svg\b[^>]*?)\sviewBox\s*=\s*"[^"]*"/,
      `$1 viewBox="${newViewBox}"`,
    );
  } else {
    updated = updated.replace(/<svg\b/, `<svg viewBox="${newViewBox}"`);
  }
  updated = updated.replace(/(<svg\b[^>]*?)\swidth\s*=\s*"[^"]*"/, "$1");
  updated = updated.replace(/(<svg\b[^>]*?)\sheight\s*=\s*"[^"]*"/, "$1");

  if (updated === text) {
    console.log(`= ${file}: already tight (no change).`);
    return true;
  }

  fs.writeFileSync(filePath, updated);
  console.log(`✓ ${file}: viewBox → ${newViewBox}`);
  return true;
}

const files = fs
  .readdirSync(LOGOS_DIR)
  .filter((f) => f.endsWith(".svg"))
  .sort();

console.log(`Scanning ${LOGOS_DIR} (${files.length} SVG files)\n`);

let allOk = true;
for (const f of files) {
  const ok = tightenSvg(path.join(LOGOS_DIR, f));
  if (!ok) allOk = false;
}

if (!allOk) {
  console.error(
    "\nStopped on complexity per plan. No partial work persisted past failed files. Surface file(s) above to PM.",
  );
  process.exit(1);
}

console.log("\nAll SVGs tightened cleanly.");
