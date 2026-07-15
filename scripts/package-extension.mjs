import { mkdir, readFile, rm } from "node:fs/promises";
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
await zipExtension(distDir, artifactPath);

console.log(`Packaged ${target} extension: ${artifactPath}`);

async function zipExtension(cwd, outputPath) {
  const files = await getRequiredExtensionFiles(cwd);

  return new Promise((resolvePromise, reject) => {
    const zip = spawn("zip", ["-r", outputPath, ...files], {
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

async function getRequiredExtensionFiles(distRoot) {
  const manifestPath = resolve(distRoot, "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const files = new Set(["manifest.json"]);

  addManifestFiles(files, manifest);
  await addHtmlPageFiles(files, distRoot, manifest.options_ui?.page);
  await addHtmlPageFiles(files, distRoot, manifest.action?.default_popup);

  return [...files].sort();
}

function addManifestFiles(files, manifest) {
  addFileValues(files, manifest.icons && Object.values(manifest.icons));

  if (manifest.background?.service_worker) {
    files.add(manifest.background.service_worker);
  }

  addFileValues(files, manifest.background?.scripts);

  for (const contentScript of manifest.content_scripts ?? []) {
    addFileValues(files, contentScript.js);
    addFileValues(files, contentScript.css);
  }

  for (const resourceGroup of manifest.web_accessible_resources ?? []) {
    addFileValues(files, resourceGroup.resources);
  }
}

async function addHtmlPageFiles(files, distRoot, pagePath) {
  if (!pagePath) {
    return;
  }

  files.add(pagePath);

  const html = await readFile(resolve(distRoot, pagePath), "utf8");

  for (const referencedPath of getHtmlAssetPaths(html)) {
    files.add(referencedPath);
  }
}

function addFileValues(files, values) {
  for (const value of values ?? []) {
    if (typeof value === "string" && !value.includes("*")) {
      files.add(stripLeadingSlash(value));
    }
  }
}

function getHtmlAssetPaths(html) {
  const assetPattern = /\b(?:src|href)=["']([^"']+)["']/g;
  const assetPaths = [];

  for (const match of html.matchAll(assetPattern)) {
    const assetPath = match[1];

    if (assetPath.startsWith("/")) {
      assetPaths.push(stripLeadingSlash(assetPath));
    }
  }

  return assetPaths;
}

function stripLeadingSlash(path) {
  return path.startsWith("/") ? path.slice(1) : path;
}
