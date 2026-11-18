# Tizandish Paint XP

A Windows XP-inspired drawing application by Tizandish Studio.

## Features
- Classic Paint-style menus, toolbox, palette and drawing canvas
- Pencil, brush, airbrush, eraser, fill, picker, selection, text and shape tools
- Zoom, grid, thumbnail, resize, flip/rotate, stretch/skew, invert and print
- Import and export common image formats from the browser
- Local autosave in the browser
- Installable Progressive Web App (PWA) with offline cache after first visit
- Android debug APK workflow powered by Capacitor

## Run locally
Open `index.html` in a modern browser. For PWA and service-worker testing, serve the project from localhost or HTTPS.

## Android APK
See [ANDROID-BUILD-FA.md](ANDROID-BUILD-FA.md). GitHub Actions can build a debug APK from **Actions → Build Android APK → Run workflow**.

## Honest scope notes
The current UI exposes a prototype Layers panel, but true independent multi-layer compositing is not implemented yet. This release is a browser-based drawing app wrapped for Android; it does not depend on a backend or upload drawings to a server.

## Privacy
The drawing canvas and autosave are local to the browser/app unless the user explicitly exports or shares an image.
