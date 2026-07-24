import { access, readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";

const execFileAsync = promisify(execFile);

export async function validateExtensionBuild(distDir, target) {
  const errors = [];
  const manifest = await readManifest(distDir, errors);

  if (!manifest) {
    return errors;
  }

  errors.push(...validateManifest(manifest, target));

  const requiredFiles = collectManifestFiles(manifest);
  for (const file of requiredFiles) {
    if (!(await fileExists(resolve(distDir, file)))) {
      errors.push(`Missing extension file: ${file}.`);
    }
  }

  for (const page of [manifest.action?.default_popup, manifest.options_ui?.page]) {
    if (typeof page !== "string" || !(await fileExists(resolve(distDir, page)))) {
      continue;
    }

    const html = await readFile(resolve(distDir, page), "utf8");
    if (page === manifest.action?.default_popup) {
      errors.push(...validatePopupHtml(html));
      errors.push(...await validatePopupStyles(distDir, html));
    }
    for (const file of getHtmlAssetPaths(html)) {
      if (!(await fileExists(resolve(distDir, file)))) {
        errors.push(`Missing extension file: ${file}.`);
      }
    }
  }

  return [...new Set(errors)];
}

export async function getRequiredExtensionFiles(distRoot) {
  const manifest = JSON.parse(await readFile(resolve(distRoot, "manifest.json"), "utf8"));
  const files = new Set(["manifest.json"]);

  addManifestFiles(files, manifest);
  await addHtmlPageFiles(files, distRoot, manifest.options_ui?.page);
  await addHtmlPageFiles(files, distRoot, manifest.action?.default_popup);

  return [...files].sort();
}

export async function validateExtensionPackage(packagePath, requiredFiles, target) {
  const { stdout } = await execFileAsync("unzip", ["-Z1", packagePath]);
  const packagedFiles = new Set(stdout.split("\n").filter(Boolean));
  const errors = requiredFiles
    .filter((file) => !packagedFiles.has(file))
    .map((file) => `Package is missing required extension file: ${file}.`);

  if (!packagedFiles.has("manifest.json")) {
    return errors;
  }

  try {
    const { stdout: manifestText } = await execFileAsync("unzip", ["-p", packagePath, "manifest.json"]);
    errors.push(
      ...validateManifest(JSON.parse(manifestText), target).map(
        (error) => `Package ${error[0].toLowerCase()}${error.slice(1)}`,
      ),
    );
  } catch {
    errors.push("Package contains an invalid manifest.json.");
  }

  return [...new Set(errors)];
}

async function readManifest(distDir, errors) {
  try {
    return JSON.parse(await readFile(resolve(distDir, "manifest.json"), "utf8"));
  } catch {
    errors.push("Missing or invalid extension manifest: manifest.json.");
    return null;
  }
}

function collectManifestFiles(manifest) {
  const files = new Set();
  addManifestFiles(files, manifest);
  for (const page of [manifest.options_ui?.page, manifest.action?.default_popup]) {
    if (typeof page === "string") {
      files.add(stripLeadingSlash(page));
    }
  }
  return files;
}

function validateManifest(manifest, target) {
  const errors = [];
  const permissions = new Set(manifest.permissions ?? []);
  for (const permission of ["storage", "downloads"]) {
    if (!permissions.has(permission)) errors.push(`Manifest must request the ${permission} permission.`);
  }
  if (target === "firefox") {
    if (JSON.stringify(manifest.background) !== JSON.stringify({ scripts: ["assets/background.js"] })) {
      errors.push("Firefox manifest must declare background.scripts as assets/background.js.");
    }
    if (manifest.browser_specific_settings?.gecko === undefined) {
      errors.push("Firefox manifest must declare browser_specific_settings.gecko.");
    }
  } else {
    if (manifest.background?.service_worker !== "assets/background.js") {
      errors.push("Chrome manifest must declare background.service_worker as assets/background.js.");
    }
    if ("scripts" in (manifest.background ?? {})) {
      errors.push("Chrome manifest must not declare background.scripts.");
    }
    if (manifest.browser_specific_settings !== undefined) {
      errors.push("Chrome manifest must not declare browser_specific_settings.");
    }
  }
  if (manifest.manifest_version !== 3) {
    errors.push("Extension manifest must use manifest_version 3.");
  }
  if (manifest.action?.default_popup !== "src/popup/index.html") {
    errors.push("Manifest action.default_popup must be src/popup/index.html.");
  }
  if (manifest.options_ui?.page !== "src/options/index.html") {
    errors.push("Manifest options_ui.page must be src/options/index.html.");
  }
  return errors;
}

function validatePopupHtml(html) {
  const requiredMarkup = [
    ["role=\"tablist\"", "tablist role"],
    ["role=\"tab\"", "tab role"],
    ["role=\"tabpanel\"", "tabpanel role"],
    ["aria-labelledby=\"today-tab\"", "panel label"],
    ["aria-selected=\"false\" tabindex=\"-1\"", "roving tab index"],
  ];
  const errors = [];

  for (const [markup, label] of requiredMarkup) {
    if (!html.includes(markup)) {
      errors.push(`Popup is missing the accessible ${label}.`);
    }
  }

  return errors;
}

async function validatePopupStyles(distDir, html) {
  const errors = [];
  const stylesheets = getHtmlAssetPaths(html).filter((file) => file.endsWith(".css"));

  for (const stylesheet of stylesheets) {
    if (!(await fileExists(resolve(distDir, stylesheet)))) {
      continue;
    }

    const css = (await readFile(resolve(distDir, stylesheet), "utf8")).replace(/\s+/g, "");
    for (const [rule, label] of [
      ["width:390px;", "fixed popup width"],
      ["height:600px;", "fixed popup height"],
      ["flex:11auto;min-height:0;", "scrollable popup content"],
      ["overflow-y:auto;", "scrollable popup overflow"],
      ["button:focus-visible", "visible keyboard focus"],
      ["@media(prefers-reduced-motion:reduce)", "reduced-motion"],
    ]) {
      if (!css.includes(rule)) {
        errors.push(`Popup is missing the ${label} style.`);
      }
    }
  }

  return errors;
}

function addManifestFiles(files, manifest) {
  addFileValues(files, manifest.icons && Object.values(manifest.icons));

  if (manifest.background?.service_worker) {
    files.add(stripLeadingSlash(manifest.background.service_worker));
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

  files.add(stripLeadingSlash(pagePath));
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

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (process.argv[1]?.endsWith("verify-extension-build.mjs")) {
  const target = process.argv[2];
  const packagePath = process.argv[3];
  if (!["chrome", "firefox"].includes(target)) {
    console.error("Usage: node scripts/verify-extension-build.mjs <chrome|firefox> [package.zip]");
    process.exit(1);
  }

  const distDir = resolve(process.cwd(), "dist", target);
  const errors = await validateExtensionBuild(distDir, target);
  if (packagePath && errors.length === 0) {
    errors.push(...await validateExtensionPackage(
      packagePath,
      await getRequiredExtensionFiles(distDir),
      target,
    ));
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`✗ ${error}`);
    }
    process.exit(1);
  }

  console.log(`Verified ${target} extension build${packagePath ? " and package" : ""}.`);
}
