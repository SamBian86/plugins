/*
 * 照片选择类
 * @constructor Photo
 * @param {String} cfgs.title	修改原生标题
 * @param {String} cfgs.cancel	修改取消按钮文字描述
 * @param {Array} cfgs.buttons	修改按钮文字描述 
 * @param {Object} cfgs.options	作为回调函数第三个形参传入
 * @param {Function(file,path,options)} cfgs.callback	获取图片成功以后的回调函数,file:文件,path:文件路径,options:初始传入的对象
 * */
(function(win){
	//判断组件库是否第一次载入,如果是初始化组件库
	win.Plugin = win.Plugin || {};
	
	//Photo类构造函数
	function Photo(cfgs){
		var configs = cfgs || {};
		var buttons = [{ title: "拍照" }, { title: "从手机相册选择" }];
		//初始化数据
		this.savePath = configs.savePath || '_doc/tempImage/';
		this.title = configs.title || "修改用户头像";
		this.cancel = configs.cancel || "取消";
		this.buttons = configs.buttons || buttons; //不推荐修改
		this.options = configs.options || {};
		this.callback = configs.callback || function(){};
		this.compress = configs.compress || false;//默认不压缩
		this.compressCfg = configs.compressCfg || {};//默认压缩配置
		
	}
	
	//对象方法定义
	Photo.prototype = {
		init : function(){
			//this.showSheet();
		},
		showSheet : function(){//点击选择
			var that = this;
			var actionSheetObj = {
		        title: that.title, 
		        cancel: that.cancel, 
		        buttons: that.buttons
			};
		    plus.nativeUI.actionSheet(actionSheetObj, function(b) { /*actionSheet 按钮点击事件*/ 
		        switch (b.index) { 
		            case 0: 
		                break; 
		            case 1: 
		                that.appendByCamera(); /*拍照*/ 
		                break; 
		            case 2: 
		                that.appendByGallery();/*打开相册*/ 
		                break; 
		            default: 
		                break; 
		        } 
		    })
		},
		//拍照
		appendByCamera : function(){
			var that = this;
			plus.camera.getCamera().captureImage(function(file){
		        plus.io.resolveLocalFileSystemURL(file, function(entry) { 
		            var path = entry.toLocalURL() + "?version=" + new Date().getTime();//文件路径
		            var srcPath = entry.toLocalURL();
		            var dstPath = that.savePath + entry.name;
		            var compressOptions = {};
		            
		            entry.file(function(file){
		            	//console.log("文件名称" + file.name + "文件大小" + file.size);
		            });
		            
		            //如果需要压缩
		            if(that.compress === true){
		            	//初始化压缩配置对象
		            	for(var i in that.compressCfg){
		            		compressOptions[i] = that.compressCfg[i];
		            	}
		            	compressOptions["src"] = srcPath;
		            	compressOptions["dst"] = dstPath;
		            	//默认压缩到的目录有同名文件进行覆盖更新
		            	compressOptions["overwrite"] = true;
		            	
						plus.zip.compressImage(compressOptions,function(event) {
							//console.log("拍照需要压缩");
							//console.log("压缩成功,文件大小" + event.size + "宽:" + event.width + "高:" + event.height);
							that.callback(dstPath,path,that.options);
						},function(error) {
							//console.log("压缩图片失败");
						});
		            }else{//如果不需要压缩
		            	//console.log("拍照不需要压缩");
		            	//执行回调函数
		            	that.callback(file,path,that.options);
		            }
		        }, function(e) { 
		            console.log("读取拍照文件错误：" + e.message); 
		        }); 
			});	
		},
		//打开相册
		appendByGallery : function(){
			var that = this;
			plus.gallery.pick(function(file){
		        plus.io.resolveLocalFileSystemURL(file, function(entry) { 
		            var path = entry.toLocalURL() + "?version=" + new Date().getTime();//文件路径
		            var srcPath = entry.toLocalURL();
		            var dstPath = that.savePath + entry.name;
		            var compressOptions = {};
		            
		            entry.file(function(file){
		            	//console.log("文件名称" + file.name + "文件大小" + file.size);
		            });
		            
		            //如果需要压缩
		            if(that.compress === true){
		            	//初始化压缩配置对象
		            	for(var i in that.compressCfg){
		            		compressOptions[i] = that.compressCfg[i];
		            	}
		            	compressOptions["src"] = srcPath;
		            	compressOptions["dst"] = dstPath;
		            	//默认压缩到的目录有同名文件进行覆盖更新
		            	compressOptions["overwrite"] = true;
		            	
						plus.zip.compressImage(compressOptions,function(event) {
							//console.log("相册需要压缩");
							//console.log("压缩成功,文件大小" + event.size + "宽:" + event.width + "高:" + event.height + "--" + dstPath);
							that.callback(dstPath,path,that.options);
						},function(error) {
							//console.log("压缩图片失败");
						});
		            }else{//如果不需要压缩
		            	//console.log("相册不需要压缩");
		            	//执行回调函数
		            	that.callback(file,path,that.options);
		            }
		        }, function(e) { 
		            console.log("读取相册文件错误：" + e.message); 
		        }); 
		   	});
		}
		
	}
	
	//将Photo类暴露在外部
	win.Plugin.Photo = Photo;
})(window);