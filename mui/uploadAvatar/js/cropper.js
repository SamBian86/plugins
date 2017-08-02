/*
 * 裁剪类
 * @constructor Cropper
 * */
(function(win){
	//判断组件库是否第一次载入,如果是初始化组件库
	win.Plugin = win.Plugin || {};
	
	//Cropper类构造函数
	function Cropper(cfgs){
		var configs = cfgs || {};
		this.squareLen = configs.squareLen || 200;
		this.savePath = configs.savePath || '_doc/tempImage/';
		this.imgSrc = configs.imgSrc || '';
		this.containerId = configs.containerId || 'cropperBox';
		this.conId = configs.conId || 'cropperCon';
		this.maskId = configs.maskId || 'cropperMask';
		this.bottomId = configs.bottomId || 'cropperBottom';
		this.imgId = configs.imgId || 'cropperImg';
		this.areaId = configs.areaId || 'cropperArea';
		this.saveCallBack = configs.saveCallBack || function(){};

//		<div class="cropperBox" id="cropperBox">
//			<div class="cropperCon">
//				<img id="cropperImg" class="cropperImg" src="../img/cbd.jpg" />
//				<div id="cropperArea" class="cropperArea"></div>
//			</div>
//			<div class="cropperBottom">保 存</div>
//		</div>
		//初始化
		if(this.imgSrc === ''){
			mui.toast('初始化裁剪头像失败');
		}else{
			this.init();
		}
		
	}
	
	//对象方法定义
	Cropper.prototype = {
		init : function(){
			this.createDom();
			this.countWH();
			this.setArea();
			this.setImg();
			this.eventBind();
		},
		createDom : function(){//初始化dom节点
			var container = this.container = document.getElementById(this.containerId),that = this;
			container.innerHTML = '';
			if(!container.classList.contains(this.containerId)){
				container.classList.add(this.containerId);
			}
			
			this.conDom = document.createElement('div');
			this.conDom.id = this.conId;
			this.conDom.className = this.conId;
			
			this.maskDom = document.createElement('div');
			this.maskDom.id = this.maskId;
			this.maskDom.className = this.maskId;
			
			this.bottomDom = document.createElement('div');
			this.bottomDom.id = this.bottomId;
			this.bottomDom.className = this.bottomId;
			this.bottomDom.innerHTML = '保存';
			
			this.imgDom = document.createElement('img');
			this.imgDom.id = this.imgId;
			this.imgDom.className = this.imgId;
			this.imgDom.onload = function(){
				var bodyW = document.body.offsetWidth;
				var bodyH = document.body.offsetHeight;
				var left,top;
				that.range = {};
				that.imgLay = {};
				that.imgWidth = this.width;
				that.imgHeight = this.height;
				//console.log('imgWidth:' + that.imgWidth + '----imgHeight:' + that.imgHeight);
				if(bodyW < bodyH - 88){//如果截取区域宽小于高
					if(that.imgWidth > that.imgHeight){//如果被截取的图片宽大于高
						this.style.height = that.areaWidth + 'px';
						left = (this.width - that.areaWidth)/2;
						this.style.left = -left + 'px';
						that.imgLay = { top : that.areaBorder.top, left : -left};//图片初始化的left与top的值
						that.range = { minTop : that.areaBorder.top, maxTop : that.areaBorder.top, minLeft : -(this.width - that.areaWidth), maxLeft : 0};
					}else{
						this.style.width = that.areaWidth + 'px';
						top = (this.height - that.areaWidth)/2;
						top = that.areaBorder.top - top;
						this.style.top = top + 'px';
						that.imgLay = { top : top, left : 0};
						that.range = { minTop : -(this.height - that.areaWidth - that.areaBorder.top), maxTop : that.areaBorder.top, minLeft : 0, maxLeft : 0};
					}
				}else{//如果截取区域宽大于高
					if(that.imgWidth > that.imgHeight){//如果被截取的图片宽大于高
						this.style.height = that.areaHeight + 'px';
						left = (this.width - that.areaHeight)/2;
						left = that.areaBorder.left - left;
						this.style.left = left + 'px';
						that.imgLay = { top : 0, left : left};
						that.range = { minTop : 0, maxTop : 0, minLeft : that.areaBorder.left - (this.width - that.areaHeight), maxLeft : that.areaBorder.left};
					}else{
						this.style.width = that.areaHeight + 'px';
						top = (this.height - that.areaHeight)/2;
						this.style.top = -top + 'px';
						that.imgLay = { top : -top, left : that.areaBorder.left};
						that.range = { minTop : -(this.height - that.areaHeight), maxTop : 0, minLeft : that.areaBorder.left, maxLeft : that.areaBorder.left};
					}
				}
				
				that.zoomWidth = this.width;
				that.zoomHeight = this.height;
				mui.later(function(){
					that.wt.close();
					that.maskDom.style.display = "none";
				},500);
				//console.log('图片宽高:width:' + this.width + '_height:' + this.height);
				//that.getCropperData();//用于测试返回值
			}
			this.wt = plus.nativeUI.showWaiting('载入中...',{ background : 'rgba(0,0,0,1)'});
			this.imgDom.src = this.imgSrc;
			
			this.areaDom = document.createElement('div');
			this.areaDom.id = this.areaId;
			this.areaDom.className = this.areaId;
			
			this.conDom.appendChild(this.maskDom);
			this.conDom.appendChild(this.imgDom);
			this.conDom.appendChild(this.areaDom);
			container.appendChild(this.conDom);
			container.appendChild(this.bottomDom);
		},
		countWH : function(){//计算宽高,裁切可视区域等
			var bodyW = document.body.offsetWidth;
			var bodyH = document.body.offsetHeight;
			this.areaBorder = {};//用于设置裁切可视区域的数据
			this.areaBorder.top = 0;
			this.areaBorder.bottom = 0;
			this.areaBorder.left = 0;
			this.areaBorder.right = 0;
			if(bodyW < bodyH - 88){
				this.areaWidth = bodyW;
				this.areaHeight = bodyW;
				this.areaBorder.top = Math.round((bodyH - bodyW - 88)/2);
				this.areaBorder.bottom = Math.round((bodyH - bodyW - 88)/2);
			}else{
				this.areaWidth = bodyH - 88;
				this.areaHeight = bodyH - 88;
				this.areaBorder.left = Math.round((bodyW - (bodyH - 88))/2);
				this.areaBorder.right = Math.round((bodyW - (bodyH - 88))/2);
			}
			console.log('border top:' + this.areaBorder.top + "px bottom:" + this.areaBorder.bottom + "px left:" + this.areaBorder.left + "px right:" + this.areaBorder.right);
			console.log('页面宽高:width:' + bodyW + '----height:' + bodyH);
		},
		setArea : function(){//设置裁切可视区域
			this.areaDom.style.width = this.areaWidth + 'px';
			this.areaDom.style.height = this.areaHeight + 'px';
			(this.areaBorder.top === 0) 	? this.areaDom.style.borderTop = 'none' : this.areaDom.style.borderTop = this.areaBorder.top + 'px solid rgba(0, 0, 0, 0.8)';
			(this.areaBorder.bottom === 0) 	? this.areaDom.style.borderBottom = 'none' : this.areaDom.style.borderBottom = this.areaBorder.bottom + 'px solid rgba(0, 0, 0, 0.8)';
			(this.areaBorder.left === 0) 	? this.areaDom.style.borderLeft = 'none' : this.areaDom.style.borderLeft = this.areaBorder.left + 'px solid rgba(0, 0, 0, 0.8)';
			(this.areaBorder.right === 0) 	? this.areaDom.style.borderRight = 'none' : this.areaDom.style.borderRight = this.areaBorder.right + 'px solid rgba(0, 0, 0, 0.8)';
		},
		setImg : function(){//设置图片的位置
			var bodyW = document.body.offsetWidth;
			var bodyH = document.body.offsetHeight;
			if(bodyW < bodyH - 88){//如果截取区域宽小于高
				this.imgDom.style.top = this.areaBorder.top + 'px';
			}else{//如果截取区域宽大于高
				this.imgDom.style.left = this.areaBorder.left + 'px';
			}
		},
		eventBind : function(){//touch事件绑定
			var that = this;
			that.isTouch = false;
			that.touchXY = {};
			
			that.conDom.addEventListener('touchstart',function(e){
				if(!that.isTouch){
					that.isTouch = true;				
					that.touchXY.left = e.touches[0].clientX;
					that.touchXY.top = e.touches[0].clientY
				}
				//console.log('touchstart:' + e.touches[0].clientX+ '----' + e.touches[0].clientY);
			},false);
			
			that.conDom.addEventListener('touchmove',function(e){
				e.preventDefault();
				if(that.isTouch){
					that.imgDom.style.top = that.imgLay.top - 0 + (e.touches[0].clientY - that.touchXY.top) + "px";
					that.imgDom.style.left = that.imgLay.left - 0 + (e.touches[0].clientX - that.touchXY.left) + "px";
					that.imgLay.top = that.imgLay.top - 0 + (e.touches[0].clientY - that.touchXY.top);
					that.imgLay.left = that.imgLay.left - 0 + (e.touches[0].clientX - that.touchXY.left);
					that.touchXY.left = e.touches[0].clientX;
					that.touchXY.top = e.touches[0].clientY
				}
				//console.log('touchmove:' + that.imgLay.top + '----' + that.imgLay.left);
			},false);
			
			that.conDom.addEventListener('touchend',function(e){
				if(that.isTouch){
					touchEndFun();
				}
				//console.log('touchend:' + e.changedTouches[0].clientX+ '----' + e.changedTouches[0].clientY);
			},false);
			
			//保存按钮事件绑定
			that.bottomDom.addEventListener('tap',function(e){
				plus.io.resolveLocalFileSystemURL(that.imgSrc, function(entry) { 
		            var path = entry.toLocalURL() + "?version=" + new Date().getTime();//文件路径
		            var srcPath = entry.toLocalURL();
		            var dstPath = that.savePath + entry.name;
					var compressOptions = {};
					var cropperData = that.getCropperData();
					
					compressOptions["dst"] = dstPath;
			    	compressOptions["src"] = srcPath;
			    	compressOptions["options"] = {};
			    	compressOptions["width"] = '';
			    	compressOptions["height"] = '';
			    	//下面的代码很关键,因为实现的时候发现android和ios有差异,真心是坑
		    		if(cropperData.clipWidth === 100){//用于处理宽小于等于高的图片
		    			if(mui.os.ios){
		    				compressOptions["width"] = that.squareLen;
		    			}
		    			compressOptions["clip"] = { top : cropperData.top + "%" , left :  cropperData.left + "%" ,width : cropperData.clipWidth + "%" ,height : cropperData.clipHeight + "%"};
		    		}else{//用于处理宽大于高的图片
		    			if(mui.os.ios){
		    				compressOptions["height"] = that.squareLen;
		    			}
		    			compressOptions["clip"] = { top : cropperData.top + "%" , left :  cropperData.left + "%" ,width : cropperData.clipWidth + "%" ,height : cropperData.clipHeight + "%"};
		    		}
	
					that.compressImage(compressOptions,that.saveCallBack);
		            
				}, function(e) { 
			        console.log("读取文件失败：" + e.message); 
			    }); 
			},false);
			
			//
			function touchEndFun(){
				that.touchXY = {};
				that.isTouch = false;
				
				if(that.range.minTop === that.range.maxTop){
					that.imgDom.style.top = that.range.minTop + "px";
					that.imgLay.top = that.range.minTop;
				}
				
				if(that.range.minLeft === that.range.maxLeft){
					that.imgDom.style.left = that.range.minLeft + "px";
					that.imgLay.left = that.range.minLeft;
				}
				
				if(that.imgLay.top > that.range.maxTop){
					that.imgDom.style.top = that.range.maxTop + "px";
					that.imgLay.top = that.range.maxTop;
				}
				
				if(that.imgLay.top < that.range.minTop){
					that.imgDom.style.top = that.range.minTop + "px";
					that.imgLay.top = that.range.minTop;
				}
				
				if(that.imgLay.left > that.range.maxLeft){
					that.imgDom.style.left = that.range.maxLeft + "px";
					that.imgLay.left = that.range.maxLeft;
				}
				
				if(that.imgLay.left < that.range.minLeft){
					that.imgDom.style.left = that.range.minLeft + "px";
					that.imgLay.left = that.range.minLeft;
				}
				console.log('left:' + that.imgLay.left + "----top:" + that.imgLay.top);
				that.getCropperData();//用于测试返回值
			}
		},
		getCropperData : function (){//返回截图相关数据
			var that = this;
			var zoomWidth = that.zoomWidth;//img标签基于手机宽度时图片的宽度,比如手机宽度为375时img就是375
			var zoomHeight = that.zoomHeight;//img标签基于手机高度时图片的高度,比如手机宽度为375时img高度为647
			
//			console.log(JSON.stringify({
//				clipWidth : Math.round(that.areaWidth/zoomWidth*100),//裁切宽度的百分比
//				clipHeight : Math.round(that.areaHeight/zoomHeight*100),//裁切高度的百分比
//				top : Math.round(Math.abs(that.areaBorder.top - that.imgLay.top)/zoomHeight*100),
//				left : Math.round(Math.abs(that.areaBorder.left - that.imgLay.left)/zoomWidth*100)
//			}));
			return {
				clipWidth : Math.round(that.areaWidth/zoomWidth*100),//裁切宽度的百分比
				clipHeight : Math.round(that.areaHeight/zoomHeight*100),//裁切高度的百分比
				top : Math.round(Math.abs(that.areaBorder.top - that.imgLay.top)/zoomHeight*100),
				left : Math.round(Math.abs(that.areaBorder.left - that.imgLay.left)/zoomWidth*100)
			};
		},
		compressImage : function(opts,callback){
			var compressOptions = {},options;
        	compressOptions["src"] = opts['src'];
        	compressOptions["dst"] = opts['dst'];
        	compressOptions["clip"] = opts['clip'];
        	if(opts['width'] !== ""){
        		compressOptions["width"] = opts['width'];
        	}
        	if(opts['height'] !== ""){
        		compressOptions["height"] = opts['height'];
        	}
        	options = opts['options'];
        	//默认压缩到的目录有同名文件进行覆盖更新
        	compressOptions["overwrite"] = true;
        	
        	console.log('compressOptions:' + JSON.stringify(compressOptions));
			plus.zip.compressImage(compressOptions,function(event) {
				//console.log("相册需要压缩");
				console.log("裁剪压缩成功,文件大小" + event.size + "宽:" + event.width + "高:" + event.height);
				//callback(compressOptions["dst"],event.target,options);
				callback(compressOptions["dst"],event.target);
			},function(error) {
				//console.log("压缩图片失败");
			});
		}
	}
	
	//将Cropper类暴露在外部
	win.Plugin.Cropper = Cropper;
})(window);