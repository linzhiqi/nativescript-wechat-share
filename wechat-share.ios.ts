// define the class that implements the WXApiDelegate protocol required by WeChat API
class MyWXApiDelegate  extends NSObject implements WXApiDelegate {
  public static ObjCProtocols = [WXApiDelegate];
  public callBack: any;
  onReq(req: BaseReq): void {
  	// not implemented
  }
  onResp(resp: BaseResp): void {
  	callBack(resp.errCode);
  }
  setOnRespCallBack(callBackFunc: any){
  	callBack = callBackFunc;
  }
}
// instantiate the object of the class
export var myWXApiDelegate = new MyWXApiDelegate();
// wrap the scene constants to ease the cross-platform situation
export var ShareToEnum = {
	Chat: WXSceneSession,
	Timeline: WXSceneTimeline,
	Favorite: WXSceneFavorite,
};
// wrap the error code constants to ease the cross-platform situation
export var RespCodeEnum = {
	Success: WXSuccess,
	CommonErr: WXErrCodeCommon,
	UserCancel: WXErrCodeUserCancel,
	SentFail: WXErrCodeSentFail,
	AuthDeny: WXErrCodeAuthDeny,
	Unsupport: WXErrCodeUnsupport,
}
// wrap the native registerApp function, make native sdk transparent for plugin users
export function registerApp(appId: string): boolean{
	return WXApi.registerApp(appId);
}
// plugin users use thie function to register the callback function when receiving response from WeChat
// the function must have this signature: functionName(code number)
// the code will be an item in the RespCodeEnum variable
export function registerOnRespCallback(callBackFunc: any){
	myWXApiDelegate.setOnRespCallBack(callBackFunc);
}
// the WXApi.isWXAppInstalled is not reliable. It can return false even if a supporting WeChat app is installed
export function isWXAppInstalled(): boolean{
	return WXApi.isWXAppInstalled();
}
// according to our experience, WXApi.isWXAppSupportApi is reliable. When no WeChat app installed, it returns false.
// so one can combine the use of isWXAppSupportApi and isWXAppInstalled to check if there is a valid WeChat app.
export function isWXAppSupportApi(): boolean{
	return WXApi.isWXAppSupportApi();
}
// shareUrl accepts the thumbnail image in imageSource type because it is defined by NativeScript and platform independent.
// Parameter shareTo should be an item in the ShareToEnum variable.
export function shareUrl(title: string, description: string, thumb: imageSource, url: string, shareTo: number): boolean{
	var message = new WXMediaMessage();
	message.title = title;
	message.description = description;
	message.setThumbImage(thumb.ios);

	var ext = new WXWebpageObject();
	ext.webpageUrl = url;
	message.mediaObject = ext;

	var req: SendMessageToWXReq = new SendMessageToWXReq();
	req.bText = false;
	req.scene = shareTo;
	req.message = message;

	return WXApi.sendReq(req);
}
// Parameter shareTo should be an item in the ShareToEnum variable.
export function shareText(text: string, shareTo: number): boolean{
	var req: SendMessageToWXReq = new SendMessageToWXReq();
	req.bText = true;
	req.text = text;
	req.scene = shareTo;

	return WXApi.sendReq(req);
}
// Both the image and the thumbnail are in type imageSource.
// Parameter shareTo should be an item in the ShareToEnum variable.
export function shareImage(image: imageSource, thumb: imageSource, shareTo: number): boolean{
	var message = new WXMediaMessage();
	message.setThumbImage(thumb.ios);
	//imageSource -> NSData
	var data = UIImageJPEGRepresentation(image.ios, 1.0);
	// assign the NSData to the WXImageObject
	var ext = new WXImageObject();
    ext.imageData = data;
    message.mediaObject = ext;
    var req: SendMessageToWXReq = new SendMessageToWXReq();
	req.bText = false;
	req.scene = shareTo;
	req.message = message;

	return WXApi.sendReq(req);
}