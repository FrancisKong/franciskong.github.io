title: "跨域方法总结"
date: 2016-03-27 21:23:40
tags: [跨域]
---

## 什么是跨域？


----------


跨域问题算是一个比较常见的问题，对于不同的场景也有着不同的方法进行跨域。不过，在此之前我们要先了解什么情况算作跨域。

> 如果两个页面拥有相同的协议（protocol），端口（如果指定），和主机，那么这两个页面就属于同一个源（origin）。

也就是如果上面3个条件只要有一个不一样就算作跨域，我们再结合具体的例子看下。
发出请求的地址：http://exampl.com/index.html，下表是目标地址及对应的结果和解释。

|url|结果|解释|
|---|:--:|:--:|
|http://example.com/other.html|成功
|http://example.com/page/other.html|成功
|http://sub.example.com/index.html|失败|子域名不同|
|http://example.com:8080/index.html|失败|端口号不同|
|https://example.com/other.html|失败|协议不同|
|http://0.0.0.0/other.html|失败|域名和域名对应的ip|

<!-- more -->


## 跨域解决方案


----------
下面就来介绍一下跨域的解决方案，为了方便，所有的`AJAX`请求我都用`jQuery`发起。
### 跨域资源共享（CORS）
`CORS（Cross-Origin Resource Sharing）`跨域资源共享，定义了必须在访问跨域资源时，浏览器与服务器应该如何沟通。CORS背后的基本思想就是使用自定义的HTTP头让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。
比如我们现在想要访问另一个网站`other.com`上的资源
```
$.get('http://other.com', function() {
  // do something...
});
```
服务器返回的资源需要有一个 Access-Control-Allow-Origin 头信息,语法如下:
```
Access-Control-Allow-Origin: <origin> | *
```
origin参数指定一个允许向该服务器提交请求的URI.对于一个不带有credentials的请求,可以指定为'*',表示允许来自所有域的请求。
为了安全起见，我们最好是限制请求的来源，下面就是只允许`other.com`请求的例子：
```
Access-Control-Allow-Origin: http://other.com
```
### 通过JSONP跨域

> JSONP（JSON with Padding）是资料格式 JSON 的一种“使用模式”，可以让网页从别的网域要资料。

简单来讲就是因为`<script>`标签不受同源策略限制，动态插入一个`<script>`标签，并在url中指定callback，然后服务端将数据作为参数传入callback中。所以JSONP是需要服务端进行配合的。
`$.getJSON`方法会自动判断是否跨域，如果跨域就通过插入`<script>`标签的方式加载数据，否则就使用普通的`ajax`方法。
```
$.getJSON('http://other.com/data?callback=mycallback', function(data) {
    // do something...
})
```
服务端只需要将数据传入`mycallback`中即可
```
mycallback({ foo: 'bar' });
```
`JSONP`的缺点是只支持GET请求，对于POST之类的其它请求就不支持了。


## 跨域代理


----------


通过上面的方法可以看出，要实现跨域交互，必须要对目标服务器有着控制权。不过有的时候我们可能需要获取其他网站的数据，那就只能通过架设服务器代理的方式进行跨域了。下面就推荐一些第三方代理，因为这些代理都是国外的，访问速度可能不太理想（国内还没找到类似的服务），所以有条件最好还是自己搭建服务器吧。
要注意的是第三方代理会存在安全性上的问题，**请不要通过第三方代理传递重要数据！**

### CORS Anywhere
CORS Anywhere是一个通过添加CORS请求头实现跨域的`node.js`反向代理（[GitHub地址][3]）
使用示例：
```javascript
$.get('http://cors-anywhere.herokuapp.com/http://www.baidu.com'), function(res) {
      console.log(res);
    });
```

### Whatever Origin
Whatever Origin是通过JSONP的方式实现跨域的（[GitHub地址][4]）。
使用示例：
```javascript
$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://www.baidu.com') + '&callback=?', function(data) {
      console.log(data.contents);
    });
```

### CORS Proxy
CORS Proxy和上面的不太一样，这是一个可以在你自己机器上方便使用的`node.js`代理，好处是使用自己的服务器访问速度快，安全性高，前提是你要拥有一台服务器，并在服务器上安装`node.js`（[GitHub地址][5]）。


  [1]: https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy
  [2]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  [3]: https://github.com/Rob--W/cors-anywhere/
  [4]: https://github.com/ripper234/Whatever-Origin
  [5]: https://github.com/gr2m/CORS-Proxy