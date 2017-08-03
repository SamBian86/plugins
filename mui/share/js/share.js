/*
 * 分享类
 * @constructor Share
 * */
(function(win){
	//判断组件库是否第一次载入,如果是初始化组件库
	win.Plugin = win.Plugin || {};
	
	//Share类构造函数
	function Share(cfgs){
		var configs = cfgs || {},shareBts = [],shares = {};
		
		this.types = configs.types || [{type:'weixin_pyq'},{type:'weixin_hy'}];
		this.getShareBts = function(){
			return shareBts;
		}
		//存放服务对象
		this.getShares = function(){
			return shares;
		}
		//初始化
		this.updateSerivces();
	}
	
	//对象方法定义
	Share.prototype = {
		init : function(){
			var types = this.types;//初始化配置支持的分享类型
			var shares = this.getShares();//获取当前app支持的所有服务对象
			var type;
			var Bt = {};
			var shareBts = this.getShareBts();
			var s = {
				'weixin_pyq' : shares['weixin'],
				'weixin_hy'	: shares['weixin'],
				'sinaweibo' : shares['sinaweibo'],
				'qq' : shares['qq']
			}
			var x = {
				'weixin_pyq' : 'WXSceneTimeline', //分享到微信朋友圈
				'weixin_hy'	: 'WXSceneSession'	//分享到微信好友
			};
			var Bts = {
				'weixin_pyq' : { title:'微信朋友圈' },
				'weixin_hy'	: { title:'微信好友' },
				'sinaweibo' : { title:'新浪微博' },
				'qq' : { title:'QQ' }
			};
			for(var i in types){
				type = types[i]['type'];//对单个分享类型进行处理
				Bt = {};
				switch (type){
					case 'weixin_pyq'://微信朋友圈
						//Bts[type]用于获取下面的title 
						//types[i] 用于存放 "type":"weixin_pyq" 就是一开始this.types中的一项
						//{s:s[type]} 用于放置对应的服务对象
						//{x:x[type]} 此处仅仅用于微信
						//合并以上所有数据的对象格式如下
						//{"title":"微信朋友圈","type":"weixin_pyq","s":{"id":"weixin","description":"微信","authenticated":true,"nativeClient":true},"x":"WXSceneTimeline"}
						//shareBts对象是用于actionSheet的buttons
						if(navigator.userAgent.indexOf('StreamApp')<0&&navigator.userAgent.indexOf('qihoo')<0){ //在360流应用中微信不支持分享图片
							mui.extend(Bt,Bts[type],types[i],{s:s[type]},{x:x[type]});
						}
						//nativeClient 判断是否存在对应的分享客户端
						s[type]&&s[type].nativeClient&&shareBts.push(Bt);
						break;
					case 'weixin_hy'://微信好友
						if(navigator.userAgent.indexOf('StreamApp')<0&&navigator.userAgent.indexOf('qihoo')<0){ //在360流应用中微信不支持分享图片
							mui.extend(Bt,Bts[type],types[i],{s:s[type]},{x:x[type]});
						}
						s[type]&&s[type].nativeClient&&shareBts.push(Bt);
						break;
					case 'sinaweibo'://新浪微博
						mui.extend(Bt,Bts[type],types[i],{s:s[type]});
						s[type]&&shareBts.push(Bt);
						break;
					case 'qq'://QQ
						mui.extend(Bt,Bts[type],types[i],{s:s[type]});
						s[type]&&s[type].nativeClient&&shareBts.push(Bt);
						break;
					default:
						break;
				}
			}
		},
		updateSerivces : function(){//获取分享服务列表
			var shares = this.getShares();
			var that = this;
			plus.share.getServices( function(s){
				for(var i in s){
					var t=s[i];
					shares[t.id]=t;//t.id为服务标识 新浪微博为sinaweibo t为支持的所有服务对象
				}
				that.init();
			},function(e){
				console.log("获取分享服务列表失败:"+e.message );
			});
		},
		shareShowByType : function(type,options){
			var that = this,serviceObj = null;
			var shareBts = this.getShareBts();
			var opts = {};
			opts = mui.extend({ type : 'message'},options);
			mui.each(shareBts,function(index,item){
				if(item.type === type){
					serviceObj = item;
				}
			})
			if(serviceObj !== null){
				that.shareAction(serviceObj,opts);
			}else{
				mui.toast('不支持此类分享');
			}
		},
		shareShow : function(options){//显示面板
			var that = this;
			var shareBts = this.getShareBts();
			var opts = {};
			opts = mui.extend({ type : 'message'},options);
			if(shareBts.length > 0){
				plus.nativeUI.actionSheet({
					title:'分享',
					cancel:'取消',
					buttons:shareBts
				},function(e){
					if(e.index>0){
						that.shareAction(shareBts[e.index-1],opts);
					}
				})
			}else{
				plus.nativeUI.alert('当前环境无法支持分享操作!');
			}
		},//根据传递的不同参数拼接msg
		shareAction : function(sb,opts){
			var that = this;
			var msg;
			msg = this.shareData(sb,opts);//根据不同类型处理数据
			
			if (sb.s.authenticated) {//授权
				this.shareSend(msg,sb.s);
			}else{//未授权
				sb.s.authorize(function(){//进行授权
					that.shareSend(msg,sb.s);
				},function(e){
					console.log( "认证授权失败："+e.code+" - "+e.message );
				});
			}
		},
		shareData : function(sb,opts){//根据不同的type返回msg对象
			var msg = {};
			opts.content = (opts.content === '') ? ' ' : opts.content;
			opts.url = opts.url || '';
			mui.extend(msg,{extra:{scene:sb.x}});
			mui.extend(msg,{content: opts.content});
			//msg.href 链接地址
			//msg.title 链接标题
			//msg.content 分享消息内容
			//msg.thumbs 图标
			//msg.pictures 图标
			if(opts.type === 'message'){//message 分享的时候显示分享消息的文字内容 content
				
			}
			if(opts.type === 'url'){//url 分享的时候显示分享消息的内容和超链接
				msg.content = msg.content + opts.url;
			}
			if(opts.type === 'link'){//link 分享的时候显示分享消息的文字内容、独立的链接、分享标题、缩略图、分享消息的图片
				mui.extend(msg,{href: opts.href});
				mui.extend(msg,{title: opts.title});
				mui.extend(msg,{thumbs: opts.thumbs});
				mui.extend(msg,{pictures: opts.pictures});
			}
			console.log(JSON.stringify(msg));
			return msg;
		},
		shareSend : function(msg,s){//发送分享
			s.send(msg, function(){
				console.log("分享成功");
			}, function(e){
				console.log("分享失败");
			});
		}
	}
	
	//将Share类暴露在外部
	win.Plugin.Share = Share;
})(window);