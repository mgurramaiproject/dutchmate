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

function smallToolbarIconPixel(x, y) {
  const transparent = [0, 0, 0, 0];
  const black = [0, 0, 0, 255];
  const white = [255, 255, 255, 255];
  const orange = [255, 111, 0, 255];

  if (!insideRoundedRect(x, y, 1, 1, 14, 14, 3)) return transparent;

  let pixel = black;

  if (insideRoundedRect(x, y, 3, 2, 10, 7, 3)) pixel = orange;
  if (insideRoundedRect(x, y, 4, 6, 2, 2, 1)) pixel = white;
  if (insideRoundedRect(x, y, 7, 6, 3, 1, 1)) pixel = white;
  if (insideRoundedRect(x, y, 10, 6, 2, 2, 1)) pixel = white;

  if (insideRoundedRect(x, y, 3, 8, 4, 5, 1)) pixel = white;
  if (insideRoundedRect(x, y, 9, 8, 4, 5, 1)) pixel = white;
  if (x >= 6 && x <= 10 && y >= 11 && y <= 12) pixel = white;
  if (x >= 7 && x <= 9 && y === 13) pixel = white;

  return pixel;
}

// Extension icons are derived from the approved GPT-generated Book Bubble mark
// in frontend/assets/dutchmate-logo-gpt-image.png and are committed as PNG assets.
// The promo image is maintained separately so it can stay product-based and
// should not be regenerated here.

writePng('public/icons/icon-16.png', 16, 16, smallToolbarIconPixel);

console.log('Generated Chrome toolbar icon asset.');
