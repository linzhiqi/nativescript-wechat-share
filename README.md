# nativescript-wechat-share

Now only iOS is supported.
Android is not supported because WeChat SDK requires an acitivity is defined under the same package of the main project while the NativeScript does not support this now(v1.4).

### How to use

Firstly, add the plugin by ```tns plugin add nativescript-wechat-share```.

Secondly open the iOS project in XCode and do configurations shown below:
1. add libraries that the WeChat SDK depends on by Target->Build Phases->Link Binary With Libraries: 
    - CoreTelephony.framework
    - libc++.tbd
    - libsqlite3.0.tbd
    - libz.tbd
    - SystemConfiguration.framework

2. add URL Scheme for WeChat so your app can communication with WeChat app
    - go to Target-> Info -> URL Types
    - click the + button and add a new scheme: identifier = weixin, URL Schemes = APP-ID
    - APP-ID is the APPID you got from WeChat after you registered your application on WeChat OpenApi dashboard: https://open.weixin.qq.com/

3. add below into your Info.plist, you can find the file in Xcode's project navigator->project-name->project-name->Supporting Files->project-name-Info.plist  
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

Thirdly, override the in your app.ios.ts
