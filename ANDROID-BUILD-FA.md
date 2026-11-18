# ساخت APK اندروید — XP Paint

## ساخت خودکار از GitHub
1. مخزن را باز کن و وارد **Actions** شو.
2. گردش کار **Build Android APK** را انتخاب کن.
3. روی **Run workflow** بزن و شاخه `main` را انتخاب کن.
4. بعد از پایان موفق، فایل `xp-paint-android-debug` را از بخش Artifacts دانلود کن.
5. ZIP را استخراج و فایل `app-debug.apk` را روی گوشی نصب کن.

## ذخیره عکس و خروج
- عکس‌های خروجی در پوشه عمومی **Pictures/XP Paint** ذخیره می‌شوند و در گالری/برنامه Files قابل مشاهده‌اند.
- ذخیره مستقیم در گالری از Android 10 به بعد فعال است؛ در نسخه‌های قدیمی‌تر، برنامه پیام خطا می‌دهد و فایل را به‌اشتباه ذخیره‌شده اعلام نمی‌کند.
- گزینه **File → Exit** و دکمه بستن پنجره از فرمان بومی اندروید برای بستن برنامه استفاده می‌کنند.

این APK برای آزمایش و نصب دستی است، نه نسخه امضاشده انتشار فروشگاهی. برای Google Play باید Release با کلید امضای اختصاصی تولید شود.

## ساخت روی رایانه
نیازمندی‌ها: Node.js 22، Android Studio سازگار با Capacitor 8، Android SDK و JDK 21.
```bash
npm install
npm test
npm run build:web
npx cap add android
npx cap sync android
node scripts/prepare-android-native.mjs
cd android
./gradlew assembleDebug
```
