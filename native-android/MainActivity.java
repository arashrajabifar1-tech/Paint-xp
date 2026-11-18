package com.tizandish.paintxp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ImageSaverPlugin.class);
        registerPlugin(AppControlPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
