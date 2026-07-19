import { resolve } from "node:path";
import { defineConfig, type UserConfig } from "vite";

const browserTarget = process.env.npm_lifecycle_event?.includes("firefox")
  ? "firefox"
  : process.env.npm_lifecycle_event?.includes("chrome")
    ? "chrome"
    : "chrome";
const enableLocalTestingOptions =
  process.env.DUTCHMATE_LOCAL_TESTING_OPTIONS === "1" ||
  process.env.npm_lifecycle_event?.startsWith("dev:") === true;
const buildEntry = process.env.DUTCHMATE_BUILD_ENTRY ?? "all";

export default defineConfig(({ mode }): UserConfig => {
  const target = mode === "firefox" ? "firefox" : browserTarget;
  const isSingleRuntimeEntry = buildEntry === "background" || buildEntry === "content";
  const input: Record<string, string> =
    buildEntry === "background"
      ? {
          background: resolve(__dirname, "src/background/index.ts"),
        }
      : buildEntry === "content"
        ? {
            content: resolve(__dirname, "src/content/index.ts"),
          }
        : buildEntry === "options"
          ? {
              options: resolve(__dirname, "src/options/index.html"),
            }
          : buildEntry === "popup"
            ? {
                popup: resolve(__dirname, "src/popup/index.html"),
              }
          : {
              background: resolve(__dirname, "src/background/index.ts"),
              content: resolve(__dirname, "src/content/index.ts"),
              options: resolve(__dirname, "src/options/index.html"),
              popup: resolve(__dirname, "src/popup/index.html"),
            };

  return {
    define: {
      __BROWSER_TARGET__: JSON.stringify(target),
      __ENABLE_LOCAL_TESTING_OPTIONS__: JSON.stringify(enableLocalTestingOptions),
    },
    build: {
      outDir: `dist/${target}`,
      emptyOutDir: buildEntry === "background" || buildEntry === "all",
      sourcemap: target === "firefox",
      rollupOptions: {
        input,
        output: {
          format: isSingleRuntimeEntry ? "iife" : undefined,
          name:
            buildEntry === "background"
              ? "DutchMateBackground"
              : buildEntry === "content"
                ? "DutchMateContent"
                : undefined,
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  };
});
