title: "百度前端技术学院任务（二），JavaScript"
date: 2015-05-20 18:35:44
tags: [baidu-ife,javascript]
---
对于这次任务不得不吐槽下题目的难度，即使任务的时间非常宽裕，但对于我这种初学者来说很多题目是完全不知道如何动手，只能不断的搜索相关的例子，来获得解决问题的思路，所以完成这次任务的时间比deadline多了好几天。但通过这次艰难的战斗，JS功力增长了几分，也掌握了一些页面效果的实现方法，这也算是这么多天的幸苦带来的回报吧。这次任务的成果：[源码](https://github.com/FrancisKong/ife/tree/master/task/task0002/work/FrancisKong)、[在线预览](http://kongfangyu.com/Demo/baidu-ife/task0002/task0002_1.html)，下面是关于这次任务的笔记。
<!--more-->
<br>
# JavaScript的性能优化
----------
参考：[JavaScript性能的优化：加载和执行](http://www.ibm.com/developerworks/cn/web/1308_caiys_jsload/index.html)
　　　[How to lose weight(in the browser)](http://browserdiet.com/zh/#cache-array-lengths)
当浏览器加载JavaScript代码时，会停止解析和渲染页面，造成这样的原因就是JavaScript代码可能会改变页面内容。在同时加载多个脚本时，一些老的浏览器会在加载完一个脚本时再去加载另一个脚本，那么加载脚本的时间就会延长了。

**脚本位置**
HTML规范允许将`<script>`标签放在文档的任何位置，但为了减少加载脚本对页面其它资源下载的影响，通常将`<script>`标签放在靠近`</body>`的位置。这样就不会在加载脚本时阻塞CSS样式文件和页面内容的加载，避免脚本加载完成之前页面一片空白。
**组织脚本**
因为HTTP请求会带来额外的性能开销，所以要尽可能的减少脚本数量，最好能将多个JavaScript文件合并成一个，减少HTTP请求。
**无阻塞脚本**
即使将多个JavaScript文件合并成一个，但依然会阻塞其它资源的下载，那么就需要解决脚本加载和执行的阻塞问题。

 -  延迟加载
`<script src="script.js" defer></script>`这里面的defer属性就是告诉浏览器这个脚本不会修改DOM的结构和样式，可以放心执行。因此这个脚本能够同其它资源一起并行下载，但不会立即执行，直到onload事件触发前才执行。在HTML5中新定义了一个属性async，能够异步的加载和执行脚本。使用这种属性的脚本下载好了就会立即执行，所以脚本不会安照原本的顺序执行，所以脚本如果具有前后依赖性，使用async可能就会出现问题。
 -  动态加载
通过DOM来创建`<script>`元素
```
   var script = document.createElement ("script");
   script.type = "text/javascript";
   script.src = "script1.js";
   document.getElementsByTagName("head")[0].appendChild(script);
```
script1.js会在`<script>`元素添加到DOM树的时候就开始加载和执行，这种技术的重点就是脚本的下载和执行不会阻塞页面其它进程的处理。
**缓存数组长度**
之前在群里看到有人讨论循环是否要缓存数组长度的问题，我之前一直没注意过这一点，在讨论之后证明这样做还是非常有必要的。
```
var arr = new Array(1000),
    len, i;

for (i = 0; i < arr.length; i++) {
  // Bad - size needs to be recalculated 1000 times
}

for (i = 0, len = arr.length; i < len; i++) {
  // Good - size is calculated only 1 time and then stored
}
```
一些现代的浏览器引擎会自动优化这个过程，但老旧的浏览器就不会有优化了。如果不缓存长度，那么在每次循环时都要重新计算数组长度，对于比较大的数组而言，会带来很大的性能影响。
<br>
# JavaScript事件代理
----------
参考：[JavaScript事件代理和委托](http://www.cnblogs.com/owenChen/archive/2013/02/18/2915521.html)
 在为多个元素绑定事件时，我们可以对父元素添加事件，从而将事件委托给父元素触发处理函数，这样就不需要去为那些元素一一绑定事件。在这次的任务中有一个练习是轮播图，轮播图中用于切换图片的按钮是使用的`<ul>`标签，HTML结构如下：
```
<ul id="btn-list">
    <li class="btn"></li>
	<li class="btn"></li>
	<li class="btn"></li>
	<li class="btn"></li>
</ul>
```
如果不使用事件代理，那么我会通过循环来为这些按钮添加事件,就像下面这样：
```
var list=document.getElementsById("btn-list");
var btns=list.getElementsByClassName("btn");
for(var i=0,l=btns.length;i<l;i++) {
	btns[i].onclick=function(){...};
}
```
对于轮播图而言可能图片不会很多，需要遍历的元素也不会太多，使用循环为元素添加事件并不会带来什么的影响，但如果元素一多，可能就会影响性能或增加出错的可能性。
如果使用事件代理，就会简单很多，在子节点被点击之后，click事件就会从子节点开始向上冒泡，当事件传播到父节点时，再判断和获取我们需要处理的节点。代码如下：
```
var btns=document.getElementById("btn-list");
btns.addEventListener("click",function (e) {
	if(e.target&&e.target.tagName == "LI"){
		function(){...};
	}
});
```
**事件冒泡及捕获**
之前的介绍中已经说到了浏览器的事件冒泡机制。这里再详细介绍一下浏览器处理DOM事件的过程。对于事件的捕获和处理，不同的浏览器厂商有不同的处理机制，这里我们主要介绍W3C对DOM2.0定义的标准事件。
DOM2.0模型将事件处理流程分为三个阶段：一、事件捕获阶段，二、事件目标阶段，三、事件起泡阶段。如图：
![JS事件捕获与事件原型冒泡图](http://7xj5pg.com1.z0.glb.clouddn.com/201505192030.jpg)
1.事件捕获：当某个元素触发某个事件（如onclick），顶层对象document就会发出一个事件流，随着DOM树的节点向目标元素节点流去，直到到达事件真正发生的目标元素。在这个过程中，事件相应的监听函数是不会被触发的。
2.事件目标：当到达目标元素之后，执行目标元素该事件相应的处理函数。如果没有绑定监听函数，那就不执行。
3.事件起泡：从目标元素开始，往顶层元素传播。途中如果有节点绑定了相应的事件处理函数，这些函数都会被一次触发。如果想阻止事件起泡，可以使用e.stopPropagation()（Firefox）或者e.cancelBubble=true（IE）来组织事件的冒泡传播。
<br>
# 小结
----------
通过这次任务了解了基本JavaScript知识、DOM操作方法，也能够实现轮播图、鼠标拖拽效果等，收获还是挺大的。在做这些练习的时候可以说是一点头绪都没有，连如何动手都不知道。在这里要推荐下[慕课网](www.imooc.com)，我也是在这上面找到相关的视频才能够做出来任务中的一些练习。在做练习的时候还想着在笔记中写一些这次任务中的难点，但在做完之后却发现并没有什么难点可以写，可能写代码最难的还是思路吧。
