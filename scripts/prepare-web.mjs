import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = process.cwd();
const out = resolve(root, 'www');
await mkdir(resolve(out, 'assets'), { recursive: true });
for (const file of ['index.html', 'manifest.webmanifest', 'sw.js']) {
  await copyFile(resolve(root, file), resolve(out, file));
}
await copyFile(resolve(root, 'assets/paint-xp.svg'), resolve(out, 'assets/paint-xp.svg'));
console.log('Web assets prepared in www/');
