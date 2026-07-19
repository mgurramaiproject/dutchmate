import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import {
  getRequiredExtensionFiles,
  validateExtensionBuild,
  validateExtensionPackage,
} from "./verify-extension-build.mjs";

const execFileAsync = promisify(execFile);

describe("validateExtensionBuild", () => {
  it.each([
    ["chrome", { service_worker: "assets/background.js" }],
    ["firefox", { scripts: ["assets/background.js"] }],
  ])("accepts a complete %s extension output", async (target, background) => {
    const distDir = await createExtensionFixture(target, background);

    await expect(validateExtensionBuild(distDir, target)).resolves.toEqual([]);
  });

  it("reports missing entry points and browser-specific manifest drift", async () => {
    const distDir = await createExtensionFixture("chrome", {
      scripts: ["assets/background.js"],
    });
    await rm(join(distDir, "src", "popup", "index.html"));

    await expect(validateExtensionBuild(distDir, "chrome")).resolves.toEqual([
      "Chrome manifest must declare background.service_worker as assets/background.js.",
      "Chrome manifest must not declare background.scripts.",
      "Missing extension file: src/popup/index.html.",
    ]);
  });

  it("reports required files missing from a packaged extension", async () => {
    const distDir = await createExtensionFixture("chrome", {
      service_worker: "assets/background.js",
    });
    const packagePath = join(distDir, "fixture.zip");
    await execFileAsync("zip", ["-q", packagePath, "manifest.json", "assets/popup.js"], {
      cwd: distDir,
    });

    await expect(
      validateExtensionPackage(packagePath, ["manifest.json", "assets/popup.js", "assets/content.js"], "chrome"),
    ).resolves.toEqual(["Package is missing required extension file: assets/content.js."]);
  });

  it("rejects a packaged manifest with stale entry points", async () => {
    const distDir = await createExtensionFixture("chrome", {
      service_worker: "assets/background.js",
    });
    const requiredFiles = await getRequiredExtensionFiles(distDir);
    const manifestPath = join(distDir, "manifest.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.action.default_popup = "src/old-popup/index.html";
    await writeFile(manifestPath, JSON.stringify(manifest));
    const packagePath = join(distDir, "stale-manifest.zip");
    await execFileAsync("zip", ["-q", packagePath, ...requiredFiles], { cwd: distDir });

    await expect(validateExtensionPackage(packagePath, requiredFiles, "chrome")).resolves.toContain(
      "Package manifest action.default_popup must be src/popup/index.html.",
    );
  });
});

async function createExtensionFixture(
  target: string,
  background: Record<string, string | string[]>,
): Promise<string> {
  const distDir = await mkdtemp(join(tmpdir(), "dutchmate-extension-test-"));
  await mkdir(join(distDir, "assets"), { recursive: true });
  await mkdir(join(distDir, "icons"), { recursive: true });
  await mkdir(join(distDir, "src", "options"), { recursive: true });

  await writeFile(
    join(distDir, "manifest.json"),
    JSON.stringify({
      manifest_version: 3,
      icons: {
        16: "icons/icon-16.png",
        32: "icons/icon-32.png",
        48: "icons/icon-48.png",
        128: "icons/icon-128.png",
      },
      background,
      content_scripts: [{ js: ["assets/content.js"] }],
      action: { default_popup: "src/popup/index.html" },
      options_ui: { page: "src/options/index.html" },
      ...(target === "firefox" ? { browser_specific_settings: { gecko: {} } } : {}),
    }),
  );

  for (const file of [
    "assets/background.js",
    "assets/content.js",
    "assets/options.js",
    "assets/options.css",
    "assets/popup.js",
    "assets/popup.css",
    "icons/icon-16.png",
    "icons/icon-32.png",
    "icons/icon-48.png",
    "icons/icon-128.png",
  ]) {
    await writeFile(
      join(distDir, file),
      file === "assets/popup.css"
        ? "width:390px;min-width:390px;max-width:390px;height:600px;height:496px;overflow-y:auto;button:focus-visible{outline:3px solid orange}"
        : "fixture",
    );
  }

  await writeFile(
    join(distDir, "src", "options", "index.html"),
    '<link rel="stylesheet" href="/assets/options.css"><script type="module" src="/assets/options.js"></script>',
  );
  await mkdir(join(distDir, "src", "popup"), { recursive: true });
  await writeFile(
    join(distDir, "src", "popup", "index.html"),
    '<nav role="tablist"><button role="tab" aria-selected="true">Learn</button><button role="tab" aria-selected="false" tabindex="-1">Settings</button></nav><div role="tabpanel" aria-labelledby="learn-tab"></div><link rel="stylesheet" href="/assets/popup.css"><script type="module" src="/assets/popup.js"></script>',
  );

  return distDir;
}
