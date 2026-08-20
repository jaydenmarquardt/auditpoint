/**
 * Runs on install when this package is consumed from git. A branch that already
 * carries `lib` is used as is; anything else is built, which is what makes a plain
 * "github:owner/repo#branch" dependency work.
 */
const { existsSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const built = path.join(__dirname, "..", "lib", "index.js");

if (existsSync(built)) {
  console.log("AuditPoint: lib is present, skipping build.");
  process.exit(0);
}

execSync("node ./node_modules/@rushstack/heft/lib/start.js build", {
  cwd: path.join(__dirname, ".."),
  stdio: "inherit",
});
execSync("node ./scripts/fix-lib-aliases.js", { cwd: path.join(__dirname, ".."), stdio: "inherit" });
