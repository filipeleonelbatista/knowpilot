import { spawnSync } from "child_process";

const result = spawnSync("node", ["--import", "tsx", "scripts/migrate.ts"], {
  stdio: "inherit",
  cwd: process.cwd(),
});

if (result.status !== 0) {
  console.warn("Migration warning, continuing...");
}
