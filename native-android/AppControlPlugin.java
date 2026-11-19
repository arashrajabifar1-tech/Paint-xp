package com.tizandish.paintxp;

import android.app.Activity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppControl")
public class AppControlPlugin extends Plugin {
    @PluginMethod
    public void exit(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Android activity is not available");
            return;
        }
        call.resolve();
        activity.runOnUiThread(() -> activity.getWindow().getDecorView().postDelayed(
                activity::finishAndRemoveTask, 180
        ));
    }
}
