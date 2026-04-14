/* eslint-disable no-console */

const path = require("path");
const { spawnSync } = require("child_process");

function run() {
  const repoRoot = path.resolve(__dirname, "..");
  const script = path.join(repoRoot, "front", "scripts", "validate-mongodb-webp-files.js");

  const res = spawnSync(process.execPath, [script], {
    cwd: path.join(repoRoot, "front"),
    stdio: "inherit",
    env: process.env,
  });

  process.exit(res.status ?? 1);
}

run();
