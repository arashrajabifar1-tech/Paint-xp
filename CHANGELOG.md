# Changelog

## 0.10.2
- Fixed Android export MIME type routing and public storage destinations.
- Save and Save As now await native file writing before marking the drawing clean.
- Save-before-exit now waits for successful save completion; cancel/failure prevents exiting.
- Non-gallery formats (BMP/TIFF) are stored under Downloads/XP Paint; PNG/JPEG/GIF/WebP under Pictures/XP Paint.
- Rebuilt the launcher icon from the supplied Paint cup image with a transparent background.

## 0.10.1
- Renamed the app and launcher label to XP Paint.
- Replaced the app icon with a classic cup of colored pencils and brushes.
- Added a native Android MediaStore save bridge for Pictures/XP Paint.
- Added native Android app-exit handling instead of relying on window.close().
- Added adaptive and legacy Android launcher icon resources.
- Expanded smoke tests for the native bridge and cache version.

## 0.10.0
- Published the Windows XP Paint-inspired drawing app.
- Added installable PWA metadata and a same-origin offline service worker.
- Added Capacitor Android project configuration.
- Added source smoke tests and a GitHub Actions workflow for a debug APK.
- Documented that the current Layers panel is a UI prototype, not true independent layers.
