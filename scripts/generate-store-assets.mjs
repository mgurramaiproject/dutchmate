import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const iconSizes = [16, 32, 48, 128];

for (const size of iconSizes) {
  const source = new URL(`../public/brand/png/dutchmate-mark-${size}.png`, import.meta.url);
  const destination = new URL(`../public/icons/icon-${size}.png`, import.meta.url);
  mkdirSync(dirname(fileURLToPath(destination)), { recursive: true });
  copyFileSync(source, destination);
}

const storeIcon = new URL("../assets/store/chrome/icon/icon-128.png", import.meta.url);
mkdirSync(dirname(fileURLToPath(storeIcon)), { recursive: true });
copyFileSync(new URL("../public/brand/png/dutchmate-mark-128.png", import.meta.url), storeIcon);

console.log(`Copied the approved v1.1 Book Bubble mark to ${root.pathname}public/icons and the Chrome Web Store icon.`);
