/**
 * TypeScript emits path aliases untouched, so `lib` ships imports of "@/api/Sp.api"
 * that only resolve inside this repo. A consuming bundle has no such alias, so every
 * "@/" specifier is rewritten to a relative path once the build has run.
 */
const fs = require("fs");
const path = require("path");

const LIB = path.join(__dirname, "..", "lib");
const SPECIFIER = /(from\s+|import\s*\(\s*|require\s*\(\s*)(["'])@\/([^"']+)\2/g;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(js|d\.ts)$/.test(entry.name) ? [full] : [];
  });
}

function rewrite(file) {
  const source = fs.readFileSync(file, "utf8");

  const next = source.replace(SPECIFIER, (all, prefix, quote, target) => {
    const relative = path.relative(path.dirname(file), path.join(LIB, target)).split(path.sep).join("/");
    return `${prefix}${quote}${relative.startsWith(".") ? relative : `./${relative}`}${quote}`;
  });

  if (next === source) return false;
  fs.writeFileSync(file, next);
  return true;
}

if (!fs.existsSync(LIB)) {
  console.error("lib is missing: run the build first.");
  process.exit(1);
}

const changed = walk(LIB).filter(rewrite).length;
console.log(`Rewrote alias imports in ${changed} file(s).`);
