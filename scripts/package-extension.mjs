import { mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import packageJson from "../package.json" with { type: "json" };

const target = process.argv[2];

if (!["chrome", "firefox"].includes(target)) {
  console.error("Usage: node scripts/package-extension.mjs <chrome|firefox>");
  process.exit(1);
}

const repoRoot = process.cwd();
const distDir = resolve(repoRoot, "dist", target);
const releaseDir = resolve(repoRoot, "release");
const artifactPath = resolve(
  releaseDir,
  `dutchmate-${target}-${packageJson.version}.zip`,
);

await mkdir(releaseDir, { recursive: true });
await rm(artifactPath, { force: true });
await zipDirectory(distDir, artifactPath);

console.log(`Packaged ${target} extension: ${artifactPath}`);

function zipDirectory(cwd, outputPath) {
  return new Promise((resolvePromise, reject) => {
    const zip = spawn("zip", ["-r", outputPath, "."], {
      cwd,
      stdio: "inherit",
    });

    zip.on("error", reject);
    zip.on("close", (exitCode) => {
      if (exitCode === 0) {
        resolvePromise();
        return;
      }

      reject(new Error(`zip exited with code ${exitCode}`));
    });
  });
}
