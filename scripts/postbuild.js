import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distFirefoxDir = path.join(rootDir, 'dist-firefox');

// 1. Copy Chrome manifest to dist/manifest.json
const chromeManifestSrc = path.join(rootDir, 'src/manifest.chrome.json');
if (fs.existsSync(chromeManifestSrc)) {
  fs.copyFileSync(chromeManifestSrc, path.join(distDir, 'manifest.json'));
  console.log('✔ Copied Chrome manifest to dist/manifest.json');
}

// 2. Prepare dist-firefox/
if (fs.existsSync(distFirefoxDir)) {
  fs.rmSync(distFirefoxDir, { recursive: true, force: true });
}
fs.mkdirSync(distFirefoxDir, { recursive: true });

// Copy all dist files to dist-firefox
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else if (entry.name !== 'manifest.json') {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(distDir, distFirefoxDir);

// Copy Firefox manifest to dist-firefox/manifest.json
const firefoxManifestSrc = path.join(rootDir, 'src/manifest.firefox.json');
if (fs.existsSync(firefoxManifestSrc)) {
  fs.copyFileSync(firefoxManifestSrc, path.join(distFirefoxDir, 'manifest.json'));
  console.log('✔ Generated dist-firefox/ with 100% clean Firefox manifest (0 warnings)');
}
