# ساخت APK اندروید — Tizandish Paint XP

## ساخت خودکار از GitHub
1. مخزن را باز کن و وارد **Actions** شو.
2. گردش کار **Build Android APK** را انتخاب کن.
3. اگر GitHub پیام فعال‌سازی Actions نشان داد، روی Enable workflows بزن.
4. روی **Run workflow** بزن و شاخه `main` را انتخاب کن.
5. بعد از پایان موفق، فایل `tizandish-paint-xp-android-debug` را از بخش Artifacts دانلود کن.
6. ZIP را استخراج و فایل `app-debug.apk` را روی گوشی نصب کن.

این APK برای آزمایش و نصب دستی است، نه نسخه امضاشده انتشار فروشگاهی. برای Google Play باید Release با کلید امضای اختصاصی تولید شود.

## ساخت روی رایانه
نیازمندی‌ها: Node.js 22 یا بالاتر، Android Studio سازگار با Capacitor 8، Android SDK و JDK 21. سپس:
```bash
npm install
npm test
npm run build:web
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

## نصب بدون APK
بعد از انتشار نسخه HTTPS، صفحه را در Chrome اندروید باز کن و از منوی سه‌نقطه گزینه Install app یا Add to Home screen را بزن. پس از اولین بارگذاری، service worker فایل‌های برنامه را برای دسترسی آفلاین cache می‌کند.
