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

function insideCircle(x, y, cx, cy, radius) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function insidePolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function bookBubbleIconPixel(x, y, size) {
  const transparent = [0, 0, 0, 0];
  const black = [0, 0, 0, 255];
  const white = [255, 255, 255, 255];
  const orange = [255, 111, 0, 255];
  const u = (x * 128) / size;
  const v = (y * 128) / size;

  if (!insideRoundedRect(u, v, 14, 14, 100, 100, 21)) return transparent;
  let pixel = black;

  if (insidePolygon(u, v, [[31, 61], [63, 54], [64, 98], [47, 93], [31, 97]])) pixel = white;
  if (insidePolygon(u, v, [[65, 54], [97, 61], [97, 97], [81, 93], [64, 98]])) pixel = white;
  if (u >= 62 && u <= 66 && v >= 57 && v <= 99) pixel = black;

  if (u >= 42 && u <= 55 && [73, 84].some((line) => Math.abs(v - line) <= 1.4)) pixel = black;
  if (u >= 74 && u <= 87 && [73, 84].some((line) => Math.abs(v - line) <= 1.4)) pixel = black;

  if (insideRoundedRect(u, v, 32, 28, 64, 32, 10)) pixel = orange;
  if (insidePolygon(u, v, [[56, 58], [71, 58], [64, 75]])) pixel = orange;
  if (insideCircle(u, v, 47, 44, 4.2)) pixel = white;
  if (u >= 58 && u <= 78 && Math.abs(v - 44) <= 2.6) pixel = white;
  if (insidePolygon(u, v, [[76, 36], [86, 44], [76, 52]])) pixel = white;

  return pixel;
}

for (const size of [16, 32, 48, 128]) {
  writePng(`public/icons/icon-${size}.png`, size, size, (x, y) =>
    bookBubbleIconPixel(x, y, size),
  );
}

writePng('assets/store/chrome/icon/icon-128.png', 128, 128, (x, y) =>
  bookBubbleIconPixel(x, y, 128),
);

writePng('assets/store/chrome/promo/small-promo-440x280.png', 440, 280, (x, y) => {
  const black = [0, 0, 0, 255];
  const white = [255, 255, 255, 255];
  const orange = [255, 111, 0, 255];
  let pixel = white;

  if (insideRoundedRect(x, y, 36, 38, 368, 204, 8)) pixel = black;
  if (insideRoundedRect(x, y, 38, 40, 364, 200, 6)) pixel = white;
  if (y >= 70 && y <= 72 && x >= 38 && x <= 402) pixel = black;
  if (insideRoundedRect(x, y, 54, 52, 10, 10, 3)) pixel = orange;
  if (insideRoundedRect(x, y, 72, 52, 10, 10, 3)) pixel = white;
  if (x >= 72 && x <= 82 && y >= 52 && y <= 62) pixel = black;
  if (insideRoundedRect(x, y, 90, 52, 10, 10, 3)) pixel = white;
  if (x >= 90 && x <= 100 && y >= 52 && y <= 62) pixel = black;

  if (x >= 64 && x <= 210 && [102, 128, 154, 180].some((row) => Math.abs(y - row) <= 3)) pixel = black;
  if (x >= 64 && x <= 164 && [115, 141, 167].some((row) => Math.abs(y - row) <= 2)) pixel = orange;
  if (insideRoundedRect(x, y, 246, 92, 118, 54, 8)) pixel = black;
  if (insideRoundedRect(x, y, 264, 110, 66, 7, 3)) pixel = white;
  if (insideRoundedRect(x, y, 264, 128, 82, 6, 3)) pixel = white;
  if (insideRoundedRect(x, y, 116, 192, 98, 15, 6)) pixel = orange;
  return pixel;
});

console.log('Generated Chrome store and extension icon assets.');
