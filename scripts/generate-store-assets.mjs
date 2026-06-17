import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function png(width, height, draw) {
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = draw(x, y);
      const offset = 1 + x * 4;
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rows.push(row);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function writePng(path, width, height, draw) {
  const file = new URL(path, ROOT);
  mkdirSync(dirname(fileURLToPath(file)), { recursive: true });
  writeFileSync(file, png(width, height, draw));
}

function insideRoundedRect(x, y, left, top, width, height, radius) {
  const right = left + width;
  const bottom = top + height;
  if (x < left || x >= right || y < top || y >= bottom) return false;
  const cx = x < left + radius ? left + radius : x >= right - radius ? right - radius - 1 : x;
  const cy = y < top + radius ? top + radius : y >= bottom - radius ? bottom - radius - 1 : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function blend(top, bottom) {
  const alpha = top[3] / 255;
  return [
    Math.round(top[0] * alpha + bottom[0] * (1 - alpha)),
    Math.round(top[1] * alpha + bottom[1] * (1 - alpha)),
    Math.round(top[2] * alpha + bottom[2] * (1 - alpha)),
    255,
  ];
}

writePng('assets/store/chrome/icon/icon-128.png', 128, 128, (x, y) => {
  const transparent = [0, 0, 0, 0];
  const bg = [32, 87, 129, 255];
  const paper = [248, 244, 235, 255];
  const accent = [239, 183, 73, 255];
  const ink = [38, 37, 33, 255];

  if (!insideRoundedRect(x, y, 16, 16, 96, 96, 18)) return transparent;
  let pixel = bg;
  if (x >= 36 && x <= 89 && y >= 31 && y <= 92) pixel = paper;
  if (x >= 62 && x <= 65 && y >= 31 && y <= 92) pixel = accent;
  if (x >= 43 && x <= 57 && [47, 59, 71].some((line) => Math.abs(y - line) <= 1)) pixel = ink;
  if (x >= 72 && x <= 84 && [47, 59, 71].some((line) => Math.abs(y - line) <= 1)) pixel = ink;
  if (insideRoundedRect(x, y, 75, 72, 25, 17, 5)) pixel = accent;
  if (x >= 82 && x <= 92 && y >= 89 && y <= 97 && x - y > -8) pixel = accent;
  return pixel;
});

writePng('assets/store/chrome/promo/small-promo-440x280.png', 440, 280, (x, y) => {
  const sky = [235, 243, 245, 255];
  const panel = [255, 252, 246, 255];
  const blue = [32, 87, 129, 255];
  const gold = [239, 183, 73, 255];
  const green = [52, 133, 98, 255];
  const line = [56, 61, 61, 255];
  let pixel = sky;

  if (insideRoundedRect(x, y, 42, 46, 356, 188, 12)) pixel = panel;
  if (x >= 64 && x <= 223 && [84, 111, 138, 165].some((row) => Math.abs(y - row) <= 2)) pixel = line;
  if (x >= 64 && x <= 174 && [97, 124, 151].some((row) => Math.abs(y - row) <= 2)) pixel = [126, 132, 132, 255];
  if (insideRoundedRect(x, y, 246, 70, 118, 50, 9)) pixel = blue;
  if (insideRoundedRect(x, y, 264, 88, 64, 6, 3)) pixel = [255, 255, 255, 255];
  if (insideRoundedRect(x, y, 264, 103, 82, 5, 3)) pixel = [255, 255, 255, 230];
  if (insideRoundedRect(x, y, 246, 132, 118, 50, 9)) pixel = green;
  if (insideRoundedRect(x, y, 264, 150, 74, 6, 3)) pixel = [255, 255, 255, 255];
  if (insideRoundedRect(x, y, 264, 165, 60, 5, 3)) pixel = [255, 255, 255, 230];
  if (insideRoundedRect(x, y, 111, 171, 96, 13, 6)) pixel = blend([gold[0], gold[1], gold[2], 180], pixel);
  return pixel;
});

console.log('Generated Chrome store icon and promotional image assets.');
