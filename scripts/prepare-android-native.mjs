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

const iconContent = `
    <group android:rotation="-13" android:pivotX="150" android:pivotY="200">
        <path android:fillColor="#CF3441" android:strokeColor="#8B2632" android:strokeWidth="4" android:pathData="M133,91 L165,91 L165,302 L133,302 Z"/>
        <path android:fillColor="#E6C18B" android:strokeColor="#8C6A48" android:strokeWidth="4" android:pathData="M133,91 L149,42 L165,91 Z"/>
        <path android:fillColor="#343B43" android:pathData="M149,42 L155,59 L143,59 Z"/>
        <path android:fillColor="#FFC1BD" android:pathData="M140,100 L145,100 L145,286 L140,286 Z"/>
    </group>
    <group android:rotation="-4" android:pivotX="215" android:pivotY="194">
        <path android:fillColor="#276DB7" android:strokeColor="#174879" android:strokeWidth="4" android:pathData="M199,87 L231,87 L231,309 L199,309 Z"/>
        <path android:fillColor="#D2B68F" android:strokeColor="#6C5438" android:strokeWidth="4" android:pathData="M199,87 C195,67 204,48 214,35 C224,48 234,68 231,87 Z"/>
        <path android:fillColor="#30343B" android:pathData="M204,53 C201,30 210,27 217,49 C226,27 231,39 231,58 L225,67 Z"/>
        <path android:fillColor="#B6DCFF" android:pathData="M207,100 L212,100 L212,292 L207,292 Z"/>
    </group>
    <group android:rotation="8" android:pivotX="281" android:pivotY="196">
        <path android:fillColor="#E6B743" android:strokeColor="#986C22" android:strokeWidth="4" android:pathData="M265,88 L297,88 L297,308 L265,308 Z"/>
        <path android:fillColor="#E8C48D" android:strokeColor="#886844" android:strokeWidth="4" android:pathData="M265,88 L281,42 L297,88 Z"/>
        <path android:fillColor="#343B43" android:pathData="M281,42 L287,59 L275,59 Z"/>
        <path android:fillColor="#FFF1B1" android:pathData="M273,98 L278,98 L278,292 L273,292 Z"/>
    </group>
    <group android:rotation="15" android:pivotX="344" android:pivotY="206">
        <path android:fillColor="#3B9D68" android:strokeColor="#175C40" android:strokeWidth="4" android:pathData="M329,115 L359,115 L359,311 L329,311 Z"/>
        <path android:fillColor="#C6A47C" android:strokeColor="#70573D" android:strokeWidth="4" android:pathData="M329,115 C326,92 335,66 345,43 C355,34 361,44 365,71 C369,96 359,115 359,115 Z"/>
        <path android:fillColor="#34383F" android:pathData="M334,69 C329,42 342,32 350,53 C361,31 366,48 366,68 L360,83 Z"/>
        <path android:fillColor="#B5F4CA" android:pathData="M337,124 L342,124 L342,294 L337,294 Z"/>
    </group>
    <group android:rotation="24" android:pivotX="399" android:pivotY="220">
        <path android:fillColor="#8067BD" android:strokeColor="#4C3979" android:strokeWidth="4" android:pathData="M385,142 L411,142 L411,321 L385,321 Z"/>
        <path android:fillColor="#E2C18E" android:strokeColor="#7E6042" android:strokeWidth="4" android:pathData="M385,142 L398,104 L411,142 Z"/>
        <path android:fillColor="#343B43" android:pathData="M398,104 L403,119 L392,119 Z"/>
    </group>
    <path android:fillColor="#C4CDD6" android:strokeColor="#667582" android:strokeWidth="7" android:pathData="M130,272 C130,272 145,260 256,260 C367,260 382,272 382,272 L360,430 C360,430 256,467 152,430 Z"/>
    <path android:fillColor="#FFFFFF" android:pathData="M151,292 L160,290 L178,418 L169,418 Z"/>
    <path android:fillColor="#61717E" android:pathData="M349,292 L358,294 L341,418 L332,418 Z"/>
    <path android:fillColor="#758491" android:strokeColor="#566571" android:strokeWidth="6" android:pathData="M128,273 C128,256 184,244 256,244 C328,244 384,256 384,273 C384,290 328,302 256,302 C184,302 128,290 128,273 Z"/>
    <path android:fillColor="#3F4D59" android:pathData="M145,270 C145,260 195,253 256,253 C317,253 367,260 367,270 C367,280 317,287 256,287 C195,287 145,280 145,270 Z"/>
    <path android:fillColor="#AEBBC7" android:strokeColor="#65737F" android:strokeWidth="5" android:pathData="M133,273 C133,273 256,248 379,273 L375,293 C375,293 256,316 137,293 Z"/>
    <path android:fillColor="#FFFFFF" android:pathData="M151,278 C220,264 292,264 361,278 L361,283 C292,270 220,270 151,283 Z"/>
`;
const vector = (background) => `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="512" android:viewportHeight="512">
    ${background ? '<path android:fillColor="#DCEEFF" android:pathData="M116,14 L396,14 C452,14 498,60 498,116 L498,396 C498,452 452,498 396,498 L116,498 C60,498 14,452 14,396 L14,116 C14,60 60,14 116,14 Z"/>' : ''}
    ${iconContent}
</vector>
`;
await writeFile(resolve(resRoot, 'drawable/paint_xp_launcher_foreground.xml'), vector(false));
await writeFile(resolve(resRoot, 'drawable/paint_xp_launcher_legacy.xml'), vector(true));

const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/paint_xp_launcher_background" />
    <foreground android:drawable="@drawable/paint_xp_launcher_foreground" />
</adaptive-icon>
`;
const anyDensity = `<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/paint_xp_launcher_legacy"
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

console.log('Installed XP Paint native plugins, adaptive launcher icon, and app label.');
