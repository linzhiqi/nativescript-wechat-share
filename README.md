# nativescript-wechat-share

Now only iOS is supported.
Android is not supported because WeChat SDK requires an acitivity is defined under the same package of the main project while the NativeScript does not support this now(v1.4).

## How to use

#### Add the plugin

by ```tns plugin add nativescript-wechat-share```.

#### Configurations in Xcode

Open the iOS project in XCode and do configurations shown below:
1. Add libraries that the WeChat SDK depends on by Target->Build Phases->Link Binary With Libraries: 
    - CoreTelephony.framework
    - libc++.tbd
    - libsqlite3.0.tbd
    - libz.tbd
    - SystemConfiguration.framework

2. Add URL Scheme for WeChat so your app can communication with WeChat app
    - go to Target-> Info -> URL Types
    - click the + button and add a new scheme: identifier = weixin, URL Schemes = APP-ID
    - APP-ID is the APPID you got from WeChat after you registered your application on WeChat OpenApi dashboard: https://open.weixin.qq.com/

3. Add below into your Info.plist, you can find the file in Xcode's project navigator->project-name->project-name->Supporting Files->project-name-Info.plist  
      ```
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>weixin</string>
</array>

<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
      ```
    - LSApplicationQueriesSchemes is set so your app can check if WeChat is installed or not.
    - NSAppTransportSecurity is set to NSAllowsArbitraryLoads so that the iOS will not force you use https exclusively
    - If you want this default high security setting NSAppTransportSecurity brings, you can use NSExceptionDomains instead of NSAllowsArbitraryLoads, and and pingma.qq.com as a whitelisted domain name.

#### Prepare codes before sharing

1. Customize the logic for the handlOpenUrl and openUrl methods of your UIApplicationDelegate, so that it is handled by WXApi.handleOpenURLDelegate. So you will have a app.ios.ts similar to this:
    ```
var application = require("application");
var wechatPlugin = require("nativescript-wechat-share");
application.mainModule = "main-page";
application.cssFile = "./app.css";

class MyDelegate extends UIResponder implements UIApplicationDelegate  {
  public static ObjCProtocols = [UIApplicationDelegate];

  applicationHandleOpenURL(application: UIApplication, url: NSURL): boolean {
    return WXApi.handleOpenURLDelegate(url, wechatPlugin.myWXApiDelegate);
  }
  applicationOpenURLSourceApplicationAnnotation(application: UIApplication, url: NSURL, sourceApplication: NSString, annotation: id): boolean {
    return WXApi.handleOpenURLDelegate(url, wechatPlugin.myWXApiDelegate);
  }
}

application.ios.delegate = MyDelegate;
application.start();
    ```

2. Register the callback function to handle the response code returned by WeChat app like this:
    ```
var wechatPlugin = require("nativescript-wechat-share");
wechatPlugin.registerOnRespCallback(function(code){
    if (code == wechatPlugin.RespCodeEnum.Success) {
        alert("the url is shared successfully");
    } else {
        alert("share url failed with errCode: " + code);
    }
});
    ```

3. Register your app(only once) before you really do the sharing:
    ```
var wechatPlugin = require("nativescript-wechat-share");
wechatPlugin.registerApp("Your-App-ID");
    ```

#### Do the sharing

Finally you can do the sharing when needed:
```
var wechatPlugin = require("nativescript-wechat-share");
// share an URL to the timeline
wechatPlugin.shareUrl("the title", "the description", thumbImage, "the url", wechatPlugin.ShareToEnum.Timeline);
// or send to a friend
// wechatPlugin.shareUrl("the title", "the description", thumbImage, "the url", wechatPlugin.ShareToEnum.Chat);
// or save to favorite
// wechatPlugin.shareUrl("the title", "the description", thumbImage, "the url", wechatPlugin.ShareToEnum.Favorite);
// or share text
// wechatPlugin.shareText("the text", wechatPlugin.ShareToEnum.Timeline);
// or share image
// wechatPlugin.shareImage(image, thumbImage, wechatPlugin.ShareToEnum.Timeline);
```

