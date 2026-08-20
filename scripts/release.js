/**
 * `lib` is committed rather than built on install: pnpm 10 refuses to run build
 * scripts for git dependencies unless every consumer allowlists the package, so a
 * consumable branch has to carry its own output.
 */
const { execSync } = require("child_process");
const { readFileSync, existsSync } = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const version = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).version;
const branch = `v${version}`;

if (!existsSync(path.join(root, "lib", "index.js"))) {
  console.error("lib is missing: run pnpm build first.");
  process.exit(1);
}

execSync(`git checkout -B ${branch}`, { cwd: root, stdio: "inherit" });
execSync("git add -A lib package.json", { cwd: root, stdio: "inherit" });
execSync(`git commit -m "Release ${branch}" --allow-empty`, { cwd: root, stdio: "inherit" });
execSync(`git push -u origin ${branch}`, { cwd: root, stdio: "inherit" });

console.log(`\nConsume with: "auditpoint": "github:jaydenmarquardt/auditpoint#${branch}"`);
