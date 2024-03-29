diff --git a/node_modules/next-auth/core/lib/oauth/client.js b/node_modules/next-auth/core/lib/oauth/client.js
index 77161bd..1082fba 100644
--- a/node_modules/next-auth/core/lib/oauth/client.js
+++ b/node_modules/next-auth/core/lib/oauth/client.js
@@ -7,11 +7,19 @@ exports.openidClient = openidClient;
 
 var _openidClient = require("openid-client");
 
+var HttpsProxyAgent = require("https-proxy-agent");
+
 async function openidClient(options) {
   const provider = options.provider;
-  if (provider.httpOptions) _openidClient.custom.setHttpOptionsDefaults(provider.httpOptions);
-  let issuer;
+  let httpOptions = {};
+  if (provider.httpOptions) httpOptions = { ...provider.httpOptions };
+  if (process.env.http_proxy) {
+    let agent = new HttpsProxyAgent(process.env.http_proxy);
+    httpOptions.agent = agent;
+  }
+  _openidClient.custom.setHttpOptionsDefaults(httpOptions);
 
+  let issuer;
   if (provider.wellKnown) {
     issuer = await _openidClient.Issuer.discover(provider.wellKnown);
   } else {
