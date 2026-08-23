import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Simple native zip creator without external dependencies
function createZip(sourceDir, outZipPath) {
  const files = [];

  function scan(dir, base) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const rel = base ? `${base}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        scan(full, rel);
      } else {
        files.push({ full, rel: rel.replace(/\\/g, '/') });
      }
    }
  }

  scan(sourceDir, '');

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const f of files) {
    const data = fs.readFileSync(f.full);
    const nameBuf = Buffer.from(f.rel, 'utf8');

    // CRC32
    let crc = 0 ^ -1;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
    }
    crc = (crc ^ -1) >>> 0;

    // Deflate
    const deflated = zlib.deflateRawSync(data);
    const useDeflate = deflated.length < data.length;
    const compData = useDeflate ? deflated : data;
    const method = useDeflate ? 8 : 0;

    // Local file header (30 bytes + nameBuf.length)
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); // signature
    lh.writeUInt16LE(20, 4); // version needed
    lh.writeUInt16LE(0, 6); // flags
    lh.writeUInt16LE(method, 8); // compression method
    lh.writeUInt16LE(0, 10); // time
    lh.writeUInt16LE(0, 12); // date
    lh.writeUInt32LE(crc, 14); // crc32
    lh.writeUInt32LE(compData.length, 18); // comp size
    lh.writeUInt32LE(data.length, 22); // uncomp size
    lh.writeUInt16LE(nameBuf.length, 26); // name length
    lh.writeUInt16LE(0, 28); // extra length

    const localChunk = Buffer.concat([lh, nameBuf, compData]);
    localHeaders.push(localChunk);

    // Central directory header (46 bytes + nameBuf.length)
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); // signature
    ch.writeUInt16LE(20, 4); // version made by
    ch.writeUInt16LE(20, 6); // version needed
    ch.writeUInt16LE(0, 8); // flags
    ch.writeUInt16LE(method, 10); // compression method
    ch.writeUInt16LE(0, 12); // time
    ch.writeUInt16LE(0, 14); // date
    ch.writeUInt32LE(crc, 16); // crc32
    ch.writeUInt32LE(compData.length, 20); // comp size
    ch.writeUInt32LE(data.length, 24); // uncomp size
    ch.writeUInt16LE(nameBuf.length, 28); // name length
    ch.writeUInt16LE(0, 30); // extra length
    ch.writeUInt16LE(0, 32); // comment length
    ch.writeUInt16LE(0, 34); // disk start
    ch.writeUInt16LE(0, 36); // internal attr
    ch.writeUInt32LE(0, 38); // external attr
    ch.writeUInt32LE(offset, 42); // relative offset of local header

    centralHeaders.push(Buffer.concat([ch, nameBuf]));
    offset += localChunk.length;
  }

  const centralDir = Buffer.concat(centralHeaders);
  const cdOffset = offset;
  const cdSize = centralDir.length;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(files.length, 8); // records on disk
  eocd.writeUInt16LE(files.length, 10); // total records
  eocd.writeUInt32LE(cdSize, 12); // size of central dir
  eocd.writeUInt32LE(cdOffset, 16); // offset of central dir
  eocd.writeUInt16LE(0, 20); // comment length

  const finalZip = Buffer.concat([...localHeaders, centralDir, eocd]);
  fs.writeFileSync(outZipPath, finalZip);
}

// CRC32 table
const table = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  table[n] = c;
}

const releasesDir = path.join(rootDir, 'releases');
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

// Package Chrome
createZip(path.join(rootDir, 'dist'), path.join(releasesDir, 'uaiselect-chrome.zip'));
console.log('✔ Generated releases/uaiselect-chrome.zip (Listo para Chrome Web Store)');

// Package Firefox
createZip(path.join(rootDir, 'dist-firefox'), path.join(releasesDir, 'uaiselect-firefox.zip'));
console.log('✔ Generated releases/uaiselect-firefox.zip (Listo para Firefox Add-ons Store)');
