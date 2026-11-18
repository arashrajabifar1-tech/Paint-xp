# XP Paint

A classic Windows XP-style drawing application by Tizandish Studio.

## Features
- Classic Paint menus, toolbox, palette and drawing canvas
- Pencil, brush, airbrush, eraser, fill, picker, selection, text and shape tools
- Zoom, grid, thumbnail, resize, flip/rotate, stretch/skew, invert and print
- Import and export common image formats from the browser
- Browser autosave and installable offline PWA
- Android app label and launcher icon: **XP Paint**
- Android image saving to the public `Pictures/XP Paint` gallery folder
- Android native Exit command that closes the app task

## Run locally
Open `index.html` in a modern browser. For PWA and service-worker testing, serve the project from localhost or HTTPS.

## Android APK
See [ANDROID-BUILD-FA.md](ANDROID-BUILD-FA.md). GitHub Actions builds the debug APK from **Actions → Build Android APK → Run workflow**.

## Honest scope notes
The current UI exposes a prototype Layers panel, but true independent multi-layer compositing is not implemented yet. Drawings stay on the device unless the user explicitly exports or shares them.
