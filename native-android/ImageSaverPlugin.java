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
        String requestedMime = call.getString("mimeType");
        if (encoded == null || encoded.isEmpty()) {
            call.reject("Image/file data is missing");
            return;
        }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            call.reject("Public file saving requires Android 10 or later");
            return;
        }

        String safeName = requestedName == null ? "XP-Paint.png" : requestedName;
        safeName = safeName.replace("/", "_").replace("\\", "_").replace(":", "_")
                .replace("*", "_").replace("?", "_").replace("\"", "_")
                .replace("<", "_").replace(">", "_").replace("|", "_").trim();
        if (safeName.isEmpty()) safeName = "XP-Paint.png";

        String ext = safeName.contains(".") ? safeName.substring(safeName.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT) : "png";
        String mime = mimeFor(ext, requestedMime);
        boolean gallery = "png".equals(ext) || "jpg".equals(ext) || "jpeg".equals(ext)
                || "gif".equals(ext) || "webp".equals(ext);
        String folder = gallery ? Environment.DIRECTORY_PICTURES + "/XP Paint"
                : Environment.DIRECTORY_DOWNLOADS + "/XP Paint";
        Uri savedUri = null;
        try {
            byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
            ContentValues values = new ContentValues();
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, safeName);
            values.put(MediaStore.MediaColumns.MIME_TYPE, mime);
            values.put(MediaStore.MediaColumns.RELATIVE_PATH, folder);
            values.put(MediaStore.MediaColumns.IS_PENDING, 1);

            ContentResolver resolver = getContext().getContentResolver();
            Uri collection = gallery
                    ? MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
                    : MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
            savedUri = resolver.insert(collection, values);
            if (savedUri == null) throw new IllegalStateException("Android did not create the file entry");

            try (OutputStream output = resolver.openOutputStream(savedUri, "w")) {
                if (output == null) throw new IllegalStateException("Could not open destination stream");
                output.write(bytes);
                output.flush();
            }
            ContentValues publish = new ContentValues();
            publish.put(MediaStore.MediaColumns.IS_PENDING, 0);
            resolver.update(savedUri, publish, null, null);

            JSObject result = new JSObject();
            result.put("uri", savedUri.toString());
            result.put("fileName", safeName);
            result.put("folder", folder);
            result.put("mimeType", mime);
            call.resolve(result);
        } catch (Exception error) {
            if (savedUri != null) {
                try { getContext().getContentResolver().delete(savedUri, null, null); }
                catch (Exception ignored) { }
            }
            call.reject("Save failed: " + error.getMessage());
        }
    }

    private String mimeFor(String ext, String requested) {
        switch (ext) {
            case "png": return "image/png";
            case "jpg":
            case "jpeg": return "image/jpeg";
            case "gif": return "image/gif";
            case "webp": return "image/webp";
            case "bmp": return "image/bmp";
            case "tif":
            case "tiff": return "image/tiff";
            default: return requested != null && !requested.isEmpty()
                    ? requested : "application/octet-stream";
        }
    }
}
