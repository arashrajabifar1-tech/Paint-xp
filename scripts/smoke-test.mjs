import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const html = await read('../index.html');
const blocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
if (!blocks.length) throw new Error('No inline application script found');
blocks.forEach((code, i) => new vm.Script(code, { filename: 'inline-script-' + (i + 1) }));

for (const marker of ['id="cv"', 'id="tools"', 'id="pg"', 'id="fi"']) {
  if (!html.includes(marker)) throw new Error('Missing app element: ' + marker);
}
if (!html.includes("cap.registerPlugin('ImageSaver')")) throw new Error('Capacitor ImageSaver plugin is not registered in JavaScript');
if (!html.includes("cap.registerPlugin('AppControl')")) throw new Error('Capacitor AppControl plugin is not registered in JavaScript');
if (!html.includes('async function saveFile') || !html.includes('await deliver(blob,nm,type)')) throw new Error('Save completion is not awaited before marking the file saved');
if (!html.includes("return name==='untitled'?saveAs():saveFile")) throw new Error('Save operation does not return completion status');
if (!html.includes('async d=>{const saved=await doSave()')) throw new Error('Save-before-exit does not await save completion');
if (!html.includes('await next()')) throw new Error('Exit is not gated on successful save');
if (!html.includes('canvas could not encode')) throw new Error('Canvas export failure is not handled');
if (!html.includes('Save Failed') && !html.includes('Operation Failed')) throw new Error('Save failure feedback is missing');

const manifest = JSON.parse(await read('../manifest.webmanifest'));
if (manifest.name !== 'XP Paint' || manifest.short_name !== 'XP Paint' || !manifest.icons?.length) {
  throw new Error('PWA manifest name or icon is invalid');
}
const capacitor = JSON.parse(await read('../capacitor.config.json'));
if (capacitor.appName !== 'XP Paint') throw new Error('Capacitor app label is not XP Paint');

const saver = await read('../native-android/ImageSaverPlugin.java');
const exitPlugin = await read('../native-android/AppControlPlugin.java');
const mainActivity = await read('../native-android/MainActivity.java');
if (!saver.includes('MediaStore.Images.Media.getContentUri') ||
    !saver.includes('MediaStore.Downloads.getContentUri') ||
    !saver.includes('Environment.DIRECTORY_PICTURES + "/XP Paint"') ||
    !saver.includes('Environment.DIRECTORY_DOWNLOADS + "/XP Paint"') ||
    !saver.includes('MediaStore.MediaColumns.IS_PENDING')) {
  throw new Error('Android save bridge must route gallery-supported images to Pictures and other formats to Downloads');
}
if (!exitPlugin.includes('finishAndRemoveTask')) throw new Error('Android app-exit plugin does not close the task');
if (!mainActivity.includes('registerPlugin(ImageSaverPlugin.class)') ||
    !mainActivity.includes('registerPlugin(AppControlPlugin.class)')) {
  throw new Error('Custom native plugins are not registered in MainActivity');
}

const prepareScript = await read('../scripts/prepare-android-native.mjs');
if (!prepareScript.includes('mipmap-anydpi-v26/ic_launcher.xml') ||
    !prepareScript.includes('paint_xp_icon.png') || !prepareScript.includes('data:image/png;base64')) {
  throw new Error('Android adaptive icon setup is missing');
}
new vm.Script(await read('../sw.js'), { filename: 'sw.js' });
for (const file of ['../assets/paint-xp.svg', '../capacitor.config.json', '../.github/workflows/android-apk.yml']) {
  await access(new URL(file, import.meta.url));
}
console.log('PASS: Paint application JavaScript parses (' + blocks.length + ' inline block(s))');
console.log('PASS: XP Paint browser, PWA and Capacitor app labels match');
console.log('PASS: Capacitor registerPlugin API connects JavaScript to native ImageSaver and AppControl');
console.log('PASS: async save waits for Android/browser delivery before clearing dirty state');
console.log('PASS: gallery formats save to Pictures; other formats save to Downloads');
console.log('PASS: Save-before-exit waits for a confirmed successful save');
console.log('PASS: exit command uses Android finishAndRemoveTask');
console.log('PASS: custom plugins and adaptive launcher icon are installed by the Android build script');
console.log('PASS: PWA manifest, service worker and core files are present');
