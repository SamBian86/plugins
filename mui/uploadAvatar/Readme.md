# 上传头像
各位5+的小伙伴可以用当前项目的代码在hbuilder中运行查看效果。

工作中遇到个上传头像的需求,自己写了2个粗糙的组件(photo照片选择组件和cropper裁切组件)用于帮助实现该功能。
photo(照片选择组件)插件简单封装了5+通过拍照或者选择照片的功能,并且封装了是否对选择的照片进行压缩的功能。

![步骤一](https://github.com/AllanBian/plugins/blob/master/mui/uploadAvatar/images/1.jpg "步骤一")
![步骤二](https://github.com/AllanBian/plugins/blob/master/mui/uploadAvatar/images/2.jpg "步骤二")
![步骤三](https://github.com/AllanBian/plugins/blob/master/mui/uploadAvatar/images/3.jpg "步骤三")
![步骤四](https://github.com/AllanBian/plugins/blob/master/mui/uploadAvatar/images/4.jpg "步骤四")

##照片选择组件的使用
#### 在页面中引入照片选择组件

```
<script src="../js/photo.js" type="text/javascript"></script>
```


使用的时候只需要在tap事件中调用如下代码就可以调用拍照和相册功能，建议tap事件定义在plusReady中。
注意buttons配置项，不推荐增加对象个数，文字描述可以修改，但是也不能完全改变其原来的含义，比如可以做如下修改 [{ title: "现在拍一张" }, { title: "从相册找一张图片" }]

<pre><code>
var Photo = new ASG.Photo({
    title: "配置标题名称字样",
    cancel: "配置取消按钮字样",
    buttons : "配置actionSheet", //默认 [{ title: "拍照" }, { title: "从手机相册选择" }] 
    options : "传入回调函数的对象",
    callback : callback，    //回调函数返回3个参数，分别是文件，文件路径，传入的options
    //是否进行压缩,默认为false上传原图的大小
    compress : true,    
    //压缩相关配置，只有在compress设置为true时才生效，具体使用方法参见http://www.html5plus.org/doc/zh_cn/zip.html#plus.zip.CompressImageOptions  注意:此对象src,dst,overwrite无法被修改，src自动获取,dst会存放在_doc/asg_doc/tempImage/临时目录中,overwrite为true,默认覆盖同名压缩文件
    compressCfg : {    
        width : 640
    }
});
</code></pre>

#### 调用showSheet方法即可弹出拍照和相册功能

<pre><code>
Photo.showSheet();
</code></pre>


#### 下面是模拟使用的代码
<pre><code>
mui.plusReady(function(){
	//点击拍照片功能
	mui('body').on('tap','.takePhoto',function(){
		var options = {
			node : this,
			text : "可以被回调函数调用哦"
		};
		//如何使用详见 photo.js代码中的说明
		var Photo = new ASG.Photo({
			title : "请选择",
			cancel: "关闭",
			callback : photoCallBack,
			options : options,
			compress : true,
			compressCfg : {
				width : 640
			}
		});
		Photo.showSheet();
	});
})

function photoCallBack(file,path,options){
    console.log(file);//获取文件对象
    console.log(path);//获取文件路径
    console.log(options.text);//输出 "可以被回调函数调用哦"
    console.log(options.node);//可以拿到这个点击的dom节点
}
</pre></code>


##裁切组件的使用(需要配合照片选择组件)
#### 在页面中引入照片选择组件及样式

```
<script src="js/cropper.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="css/avatar.css" />
```

初始化的时候只需要传入图片的路径以及点击保存以后触发的回调函数saveCallBack，图片的路径我这里使用照片选择组件传递过来的。
该组件用于将任意图片切成正方形,可以通过squareLen对裁切出来的正方形图片大小进行配置,如果不进行配置默认宽度是200px。
你只需要完成saveCallBack相关的方法就行了,此处也可以配置。
<pre><code>
Cropper = new Plugin.Cropper({ imgSrc : imgPath, saveCallBack : saveCallBack, squareLen : 300});

function saveCallBack(file,path){
    console.log(file);//裁切过后的文件对象用于上传
    console.log(path);//裁切过后的文件路径用于显示
}
</code></pre>