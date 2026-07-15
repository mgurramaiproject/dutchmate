import { resolve } from "node:path";
import packageJson from "../package.json" with { type: "json" };
import {
  getRequiredExtensionFiles,
  validateExtensionBuild,
  validateExtensionPackage,
} from "./verify-extension-build.mjs";

for (const target of ["chrome", "firefox"]) {
  const distDir = resolve(process.cwd(), "dist", target);
  const packagePath = resolve(
    process.cwd(),
    "release",
    `dutchmate-${target}-${packageJson.version}.zip`,
  );
  const errors = await validateExtensionBuild(distDir, target);

  if (errors.length === 0) {
    errors.push(
      ...await validateExtensionPackage(
        packagePath,
        await getRequiredExtensionFiles(distDir),
        target,
      ),
    );
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`✗ ${target}: ${error}`);
    }
    process.exit(1);
  }

  console.log(`Verified ${target} extension build and package.`);
}
