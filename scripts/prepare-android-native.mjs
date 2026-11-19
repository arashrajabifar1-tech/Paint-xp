import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const javaRoot = resolve(root, 'android/app/src/main/java/com/tizandish/paintxp');
const resRoot = resolve(root, 'android/app/src/main/res');
const nativeRoot = resolve(root, 'native-android');

await mkdir(javaRoot, { recursive: true });
await mkdir(resolve(resRoot, 'drawable'), { recursive: true });
await mkdir(resolve(resRoot, 'values'), { recursive: true });
await mkdir(resolve(resRoot, 'mipmap-anydpi'), { recursive: true });
await mkdir(resolve(resRoot, 'mipmap-anydpi-v26'), { recursive: true });

for (const file of ['MainActivity.java', 'ImageSaverPlugin.java', 'AppControlPlugin.java']) {
  await writeFile(resolve(javaRoot, file), await readFile(resolve(nativeRoot, file), 'utf8'));
}

const drawableNodpi = resolve(resRoot, 'drawable-nodpi');
await mkdir(drawableNodpi, { recursive: true });
const iconSvg = await readFile(resolve(root, 'assets/paint-xp.svg'), 'utf8');
const dataPrefix = 'href="data:image/png;base64,';
const dataStart = iconSvg.indexOf(dataPrefix);
if (dataStart < 0) throw new Error('XP Paint SVG does not contain its transparent icon PNG');
const payloadStart = dataStart + dataPrefix.length;
const payloadEnd = iconSvg.indexOf('"', payloadStart);
if (payloadEnd < 0) throw new Error('XP Paint SVG icon data is malformed');
const iconPng = Buffer.from(iconSvg.slice(payloadStart, payloadEnd), 'base64');
await writeFile(resolve(drawableNodpi, 'paint_xp_icon.png'), iconPng);
const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/paint_xp_launcher_background" />
    <foreground android:drawable="@drawable/paint_xp_icon" />
</adaptive-icon>
`;
const anyDensity = `<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/paint_xp_icon"
    android:inset="0dp" />
`;
await writeFile(resolve(resRoot, 'mipmap-anydpi/ic_launcher.xml'), anyDensity);
await writeFile(resolve(resRoot, 'mipmap-anydpi/ic_launcher_round.xml'), anyDensity);
await writeFile(resolve(resRoot, 'mipmap-anydpi-v26/ic_launcher.xml'), adaptive);
await writeFile(resolve(resRoot, 'mipmap-anydpi-v26/ic_launcher_round.xml'), adaptive);
await writeFile(resolve(resRoot, 'values/paint_xp_launcher.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources><color name="paint_xp_launcher_background">#DCEEFF</color></resources>
`);

// Remove template raster icons so Android selects our vector/adaptive resources.
for (const item of await readdir(resRoot, { withFileTypes: true })) {
  if (!item.isDirectory() || !item.name.startsWith('mipmap-')) continue;
  const folder = resolve(resRoot, item.name);
  for (const file of await readdir(folder)) {
    if (/^ic_launcher(_round)?\.png$/i.test(file)) await unlink(resolve(folder, file));
  }
}

// Capacitor derives app_name from appName, but enforce it for generated variants too.
const stringsPath = resolve(resRoot, 'values/strings.xml');
try {
  let strings = await readFile(stringsPath, 'utf8');
  if (/<string name="app_name">[\s\S]*?<\/string>/.test(strings)) {
    strings = strings.replace(/<string name="app_name">[\s\S]*?<\/string>/, '<string name="app_name">XP Paint</string>');
  } else {
    strings = strings.replace('</resources>', '    <string name="app_name">XP Paint</string>\n</resources>');
  }
  await writeFile(stringsPath, strings);
} catch (error) {
  throw new Error('Could not update Android app label: ' + error.message);
}

console.log('Installed XP Paint native plugins, transparent reference icon, and app label.');
