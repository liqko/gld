package ar.guialocal.app;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String HOME = "https://www.guialocal.ar/";
    private static final int LOCATION_CODE = 241;
    private static final int FILE_CODE = 242;
    private WebView web;
    private GeolocationPermissions.Callback locationCallback;
    private String locationOrigin;
    private ValueCallback<Uri[]> pendingFiles;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setLayoutParams(new FrameLayout.LayoutParams(-1, -1));
        setContentView(web);
        web.setFocusable(true);
        web.setFocusableInTouchMode(true);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setSupportMultipleWindows(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(web, true);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                String scheme = u.getScheme();
                if ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); }
                catch (Exception e) { Toast.makeText(MainActivity.this, "No hay aplicación para abrir el enlace", Toast.LENGTH_SHORT).show(); }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (!origin.startsWith("https://")) { callback.invoke(origin, false, false); return; }
                if (Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                    && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    locationOrigin = origin;
                    locationCallback = callback;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION_CODE);
                } else {
                    callback.invoke(origin, true, false);
                }
            }
            @Override public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (pendingFiles != null) pendingFiles.onReceiveValue(null);
                pendingFiles = callback;
                try { startActivityForResult(params.createIntent(), FILE_CODE); }
                catch (Exception e) { pendingFiles = null; callback.onReceiveValue(null); return false; }
                return true;
            }
        });
        if (state == null) web.loadUrl(HOME); else web.restoreState(state);
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode == LOCATION_CODE && locationCallback != null) {
            boolean allowed = false;
            for (int result : results) if (result == PackageManager.PERMISSION_GRANTED) allowed = true;
            locationCallback.invoke(locationOrigin, allowed, false);
            locationCallback = null;
            locationOrigin = null;
        }
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CODE && pendingFiles != null) {
            pendingFiles.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            pendingFiles = null;
        }
    }
    @Override protected void onSaveInstanceState(Bundle outState) { web.saveState(outState); super.onSaveInstanceState(outState); }
    @Override public void onBackPressed() { if (web.canGoBack()) web.goBack(); else super.onBackPressed(); }
    @Override protected void onPause() { super.onPause(); if (web != null) { web.onPause(); CookieManager.getInstance().flush(); } }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onDestroy() { if (web != null) { web.destroy(); web = null; } super.onDestroy(); }
}
