# 软键盘
各位5+的小伙伴可以用当前项目的代码在hbuilder中运行查看效果。

工作中遇到一个输入金额然后扫码支付的功能,由于输入金额这个功能用``input[type='number']``这个并没有小数点的功能,总之很不方便就对了,然后我就默默的打开了支付宝的软键盘,模拟了一个


##软键盘组件

![软键盘](https://github.com/AllanBian/plugins/blob/master/mui/keyboard/images/keyboard.png "软键盘")	

<font color=#ff0000>这个组件最关键的地方就是设置一个id为money的input框,一个class为softkeyboard-area的选择区域,这个选择区域必须挡在input框前面,有耐心的同学看看keyboard.js里面的代码就知道了</font>

##软键盘组件的使用
#### 在页面中引入软键盘组件

引入相关js,css及字体,详见demo
```
<link rel="stylesheet" type="text/css" href="css/lib/keyboard.css" />
<script src="js/lib/keyboard.js"></script>
```

#### 下面是模拟使用的代码
<pre><code>
Keyboard = new Plugin.Keyboard();
</code></pre>
