# 分享组件
各位5+的小伙伴可以用当前项目的代码在hbuilder中运行查看效果。

![图一](https://github.com/AllanBian/plugins/blob/master/mui/share/images/1.jpg "图一")
![图二](https://github.com/AllanBian/plugins/blob/master/mui/share/images/2.jpg "图二")
![图三](https://github.com/AllanBian/plugins/blob/master/mui/share/images/3.jpg "图三")

#### 在页面中引入分享组件

```
<script type="text/javascript" src="js/share.js"></script>
```

使用的时候只需要在tap事件中调用如下代码就可以调用分享功能，建议tap事件定义在plusReady中。

<pre><code>
//默认面板显示微信朋友圈和微信好友 Share = new ASG.Share();
//提供四种type 分别是weixin_pyq 微信朋友圈 weixin_hy 微信好友 sinaweibo 新浪微博 qq 腾讯qq
//每个对象中可以单独配置title来修改面板显示文字
var Share = new ASG.Share({ 
    types : [{type:'weixin_pyq', title:'我的微信朋友圈'},
            {type:'weixin_hy'},
            {type:'sinaweibo '},
            {type:'qq '}] 
});
</code></pre>

#### 调用shareShow方法即可弹出分享功能面板

```
Share.shareShow();
```

#### 下面是模拟使用的代码
<pre><code>
mui.plusReady(function(){
    mui('body').on('tap','#shareBtn',function(){
        //调用shareShow方法来调用面板显示,配置type来处理不同的分享样式,目前有message,link两种
        //默认type为message,content为分享的内容,link为分享的链接,默认调用方式只需要Share.shareShow({content : "内容"})
        //message模式只会显示content的内容,配置url也不会显示
        //link模式会显示content的内容，并且在后面会加上url配置的超链接
        Share.shareShow({
			type: 'link',
			href: s_Url,
			title: '分享功能!',
			content: '分享给微信好友!',
			pictures: ["_www/images/100.png"],
			thumbs: ["_www/images/100.png"]
		});
    })
})
</code></pre>

#### 如果是想直接调用分享到某个app的功能可以用shareShowByType方法
#### 下面是模拟使用的代码
<pre><code>
//分享给微信好友
mui('body').on('tap', '#shareHY', function() {
    Share.shareShowByType('weixin_hy',{
		type: 'link',
		href: s_Url,
		title: '分享功能!',
		content: '分享给微信好友!',
		pictures: ["_www/images/100.png"],
		thumbs: ["_www/images/100.png"]
	});
})
</code></pre>

#### 目前我提供了3种分享类型、分别是"message"、"url"、"link"、可以查阅代码中shareData这个方法、如果不够用感兴趣的同学可以扩展这个方法中的逻辑,增加适合自己需求的类型。
这个对象里面的属性除了type这个属性是我自己加的、其他的属性其实对应的就是5+中的属性[plus.share.ShareMessage](http://www.html5plus.org/doc/zh_cn/share.html#plus.share.ShareMessage "plus.share.ShareMessage")
