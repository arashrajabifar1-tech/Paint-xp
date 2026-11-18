package com.tizandish.paintxp;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.util.Locale;

@CapacitorPlugin(name = "ImageSaver")
public class ImageSaverPlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        String encoded = call.getString("data");
        String requestedName = call.getString("fileName");
        String mimeType = call.getString("mimeType");

        if (encoded == null || encoded.isEmpty()) {
            call.reject("Image data is missing");
            return;
        }
        if (mimeType == null || !mimeType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            call.reject("A valid image MIME type is required");
            return;
        }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            call.reject("Direct gallery saving requires Android 10 or later");
            return;
        }

        String safeName = requestedName == null ? "XP-Paint.png" : requestedName;
        safeName = safeName.replace("/", "_").replace("\\", "_")
                .replace(":", "_").replace("*", "_").replace("?", "_")
                .replace("\"", "_").replace("<", "_").replace(">", "_")
                .replace("|", "_").trim();
        if (safeName.isEmpty()) safeName = "XP-Paint.png";

        Uri savedUri = null;
        try {
            byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
            ContentValues values = new ContentValues();
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, safeName);
            values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
            values.put(MediaStore.MediaColumns.RELATIVE_PATH,
                    Environment.DIRECTORY_PICTURES + "/XP Paint");
            values.put(MediaStore.MediaColumns.IS_PENDING, 1);

            ContentResolver resolver = getContext().getContentResolver();
            savedUri = resolver.insert(
                    MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY),
                    values
            );
            if (savedUri == null) throw new IllegalStateException("Android did not create an image entry");

            try (OutputStream output = resolver.openOutputStream(savedUri, "w")) {
                if (output == null) throw new IllegalStateException("Could not open the saved image");
                output.write(bytes);
                output.flush();
            }

            ContentValues publish = new ContentValues();
            publish.put(MediaStore.MediaColumns.IS_PENDING, 0);
            resolver.update(savedUri, publish, null, null);

            JSObject result = new JSObject();
            result.put("uri", savedUri.toString());
            result.put("fileName", safeName);
            result.put("folder", "Pictures/XP Paint");
            call.resolve(result);
        } catch (Exception error) {
            if (savedUri != null) {
                try { getContext().getContentResolver().delete(savedUri, null, null); }
                catch (Exception ignored) { }
            }
            call.reject("Could not save image: " + error.getMessage());
        }
    }
}
