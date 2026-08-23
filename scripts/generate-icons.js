import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create valid RGBA PNG without external dependencies
function createPNG(width, height) {
  // Simple uncompressed/deflated raw PNG builder
  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);

    // CRC32
    let crc = 0 ^ -1;
    const combined = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < combined.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ combined[i]) & 0xff];
    }
    crc = (crc ^ -1) >>> 0;
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Precompute CRC32 table
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }

  // Header: 8 bytes
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw Image Data (Filter byte 0 + RGBA pixels per row)
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    rawData.writeUInt8(0, offset++); // Filter byte for row
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Icon Design: Rounded Indigo Badge with Target / Dot
      if (dist <= radius) {
        // Gradient from Indigo (#6366f1) to Purple (#8b5cf6)
        const t = (x + y) / (width + height);
        const r = Math.round(99 + t * 40);
        const g = Math.round(102 - t * 10);
        const b = Math.round(241 + t * 5);

        // Inner target / dot in center
        if (dist <= radius * 0.35) {
          // Center dot: crisp white
          rawData.writeUInt8(255, offset);
          rawData.writeUInt8(255, offset + 1);
          rawData.writeUInt8(255, offset + 2);
          rawData.writeUInt8(255, offset + 3);
        } else if (dist >= radius * 0.55 && dist <= radius * 0.75) {
          // Ring
          rawData.writeUInt8(255, offset);
          rawData.writeUInt8(255, offset + 1);
          rawData.writeUInt8(255, offset + 2);
          rawData.writeUInt8(240, offset + 3);
        } else {
          rawData.writeUInt8(r, offset);
          rawData.writeUInt8(g, offset + 1);
          rawData.writeUInt8(b, offset + 2);
          rawData.writeUInt8(255, offset + 3);
        }
      } else {
        // Transparent outside
        rawData.writeUInt8(0, offset);
        rawData.writeUInt8(0, offset + 1);
        rawData.writeUInt8(0, offset + 2);
        rawData.writeUInt8(0, offset + 3);
      }
      offset += 4;
    }
  }

  // Compress raw data with zlib
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.resolve(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [16, 32, 48, 128];
for (const size of sizes) {
  const pngBuf = createPNG(size, size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), pngBuf);
  console.log(`Generated icon-${size}.png`);
}
