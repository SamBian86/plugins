(function(win){
	var mainWV,currentWV,Keyboard;
	mui.init();
	
	mui.plusReady(function(){
		mainWV = plus.webview.getLaunchWebview();
		currentWV = plus.webview.currentWebview();
		
		//初始化事件
		document.addEventListener('init',function(e){
			Keyboard = new Plugin.Keyboard();
			
		})
		mui.fire(currentWV,'init');
		
	});

})(window);