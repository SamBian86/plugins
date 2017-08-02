//打开新页面
function openView(openPage,open){
	var url,webviewId,webview,type = open[openPage]['type'];
	var mainWV = plus.webview.getLaunchWebview();
	var currWv = plus.webview.currentWebview();
	var data = open[openPage]['data'];
	var webview = plus.webview.getWebviewById(open[openPage]['webview']);
	var eventName = open[openPage]['eventName'];
	data = data || {};
	if(type === 'openWindow'){
		url = open[openPage]['url'];
		mui.openWindow({
			url : url,
			id : openPage,
			extras : data
		})
	}	
	if(type === 'trigger'){
		data.openPage = openPage;
		mui.fire(mainWV, 'triggerTap',data);
	}
	if(type === 'init'){
		mui.fire(webview, type ,data);
	}
	if(type === 'fire'){
		mui.fire(webview, eventName ,data);
	}
}
