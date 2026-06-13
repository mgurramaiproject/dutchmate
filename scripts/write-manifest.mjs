import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const target = process.argv[2];

if (!["chrome", "firefox"].includes(target)) {
  console.error("Usage: node scripts/write-manifest.mjs <chrome|firefox>");
  process.exit(1);
}

const distDir = resolve(process.cwd(), "dist", target);

const manifest = {
  manifest_version: 3,
  name: "DutchMate",
  version: "0.1.0",
  description:
    "Learn Dutch while reading, with quick English and Telugu translations in context.",
  permissions: ["storage"],
  host_permissions: ["http://localhost/*", "http://127.0.0.1/*", "https://*/*"],
  background:
    target === "firefox"
      ? {
          scripts: ["assets/background.js"],
        }
      : {
          service_worker: "assets/background.js",
        },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["assets/content.js"],
      run_at: "document_idle",
    },
  ],
  options_ui: {
    page: "src/options/index.html",
    open_in_tab: true,
  },
};

if (target === "firefox") {
  manifest.browser_specific_settings = {
    gecko: {
      id: "hover-translate@example.mgurramai.local",
      strict_min_version: "109.0",
    },
  };
}

await mkdir(distDir, { recursive: true });
await writeFile(
  resolve(distDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
