var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// define the class that implements the WXApiDelegate protocol required by WeChat API
var MyWXApiDelegate = (function (_super) {
    __extends(MyWXApiDelegate, _super);
    function MyWXApiDelegate() {
        _super.apply(this, arguments);
    }
    MyWXApiDelegate.prototype.onReq = function (req) {
        // not implemented
    };
    MyWXApiDelegate.prototype.onResp = function (resp) {
        callBack(resp.errCode);
    };
    MyWXApiDelegate.prototype.setOnRespCallBack = function (callBackFunc) {
        callBack = callBackFunc;
    };
    MyWXApiDelegate.ObjCProtocols = [WXApiDelegate];
    return MyWXApiDelegate;
})(NSObject);
// instantiate the object of the class
exports.myWXApiDelegate = new MyWXApiDelegate();
// wrap the scene constants to ease the cross-platform situation
exports.ShareToEnum = {
    Chat: WXSceneSession,
    Timeline: WXSceneTimeline,
    Favorite: WXSceneFavorite
};
// wrap the error code constants to ease the cross-platform situation
exports.RespCodeEnum = {
    Success: WXSuccess,
    CommonErr: WXErrCodeCommon,
    UserCancel: WXErrCodeUserCancel,
    SentFail: WXErrCodeSentFail,
    AuthDeny: WXErrCodeAuthDeny,
    Unsupport: WXErrCodeUnsupport
};
// wrap the native registerApp function, make native sdk transparent for plugin users
function registerApp(appId) {
    return WXApi.registerApp(appId);
}
exports.registerApp = registerApp;
// plugin users use thie function to register the callback function when receiving response from WeChat
// the function must have this signature: functionName(code number)
// the code will be an item in the RespCodeEnum variable
function registerOnRespCallback(callBackFunc) {
    exports.myWXApiDelegate.setOnRespCallBack(callBackFunc);
}
exports.registerOnRespCallback = registerOnRespCallback;
// the WXApi.isWXAppInstalled is not reliable. It can return false even if a supporting WeChat app is installed
function isWXAppInstalled() {
    return WXApi.isWXAppInstalled();
}
exports.isWXAppInstalled = isWXAppInstalled;
// according to our experience, WXApi.isWXAppSupportApi is reliable. When no WeChat app installed, it returns false.
// so one can combine the use of isWXAppSupportApi and isWXAppInstalled to check if there is a valid WeChat app.
function isWXAppSupportApi() {
    return WXApi.isWXAppSupportApi();
}
exports.isWXAppSupportApi = isWXAppSupportApi;
// shareUrl accepts the thumbnail image in imageSource type because it is defined by NativeScript and platform independent.
// Parameter shareTo should be an item in the ShareToEnum variable.
function shareUrl(title, description, thumb, url, shareTo) {
    var message = new WXMediaMessage();
    message.title = title;
    message.description = description;
    message.setThumbImage(thumb.ios);
    var ext = new WXWebpageObject();
    ext.webpageUrl = url;
    message.mediaObject = ext;
    var req = new SendMessageToWXReq();
    req.bText = false;
    req.scene = shareTo;
    req.message = message;
    return WXApi.sendReq(req);
}
exports.shareUrl = shareUrl;
// Parameter shareTo should be an item in the ShareToEnum variable.
function shareText(text, shareTo) {
    var req = new SendMessageToWXReq();
    req.bText = true;
    req.text = text;
    req.scene = shareTo;
    return WXApi.sendReq(req);
}
exports.shareText = shareText;
// Both the image and the thumbnail are in type imageSource.
// Parameter shareTo should be an item in the ShareToEnum variable.
function shareImage(image, thumb, shareTo) {
    var message = new WXMediaMessage();
    message.setThumbImage(thumb.ios);
    //imageSource -> NSData
    var data = UIImageJPEGRepresentation(image.ios, 1.0);
    // assign the NSData to the WXImageObject
    var ext = new WXImageObject();
    ext.imageData = data;
    message.mediaObject = ext;
    var req = new SendMessageToWXReq();
    req.bText = false;
    req.scene = shareTo;
    req.message = message;
    return WXApi.sendReq(req);
}
exports.shareImage = shareImage;
