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

export default defineConfig(({ mode }): UserConfig => {
  const target = mode === "firefox" ? "firefox" : browserTarget;

  return {
    define: {
      __BROWSER_TARGET__: JSON.stringify(target),
      __ENABLE_LOCAL_TESTING_OPTIONS__: JSON.stringify(enableLocalTestingOptions),
    },
    build: {
      outDir: `dist/${target}`,
      emptyOutDir: true,
      sourcemap: target === "firefox",
      rollupOptions: {
        input: {
          background: resolve(__dirname, "src/background/index.ts"),
          content: resolve(__dirname, "src/content/index.ts"),
          options: resolve(__dirname, "src/options/index.html"),
        },
        output: {
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  };
});
