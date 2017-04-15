title: "百度前端学院任务（一），HTML&CSS"
date: 2015-05-12 23:18:28
tags: [baidu-ife,html,css]
---
前段时间报名参加[百度前端技术学院](https://github.com/baidu-ife/ife)的初级班，虽然没有被选上，但因为任务和资料都是公开的（赞一个），所以一直在跟着任务做。因为之前并没有前端基础，所以在做这些任务的时候可以说是困难重重吧，但还是能够在deadline之前将任务做完（虽然没有导师review~~）。这次任务主要是学习HTML&CSS布局，下面就是关于这次任务的笔记了。作业已放在GitHub上([源码](https://github.com/FrancisKong/ife/tree/master/task/task0001/work/FrancisKong),[在线预览](http://kongfangyu.com/Demo/baidu-ife/task0001/index.html))。
<!--more-->
<br/>
#清除浮动
---
参考：[那些年我们一起清除过的浮动](http://www.iyunlu.com/view/css-xhtml/55.html)
　　　[haslayout综合](http://www.qianduan.net/comprehensive-haslayout/)
　　　[BFC和haslayout](http://www.cnblogs.com/pigtail/archive/2013/01/23/2871627.html)
浮动布局可以说是常用的布局方式了，但在使用这种方式布局有的时候可能会造成高度塌陷（高度为0）。在浮动元素的高度超过了父元素的时候，浮动元素就会浮动在父元素外部，而父元素高度并不会随着浮动元素的高度增加而增加，因为包含元素里面没有任何元素了，那么就会造成高度塌陷了。为解决这种情况，就需要清除浮动，清除浮动的方法主要有以下几种(参考：
1.添加额外标签
这可以说是最通俗易懂的方法了，就是在浮动元素末尾处添加一个额外的标签，然后在给这个标签添加一个样式，如`<div style="clear:both"></div>`。这样做确实是非常的简单，但添加一个与业务逻辑无关的标签似乎不太好，并且在后期维护时也将是件麻烦事。   
2.使用br标签和其自身的属性
 这种方法和类似于第一种方法，只是利用br标签自身的属性`clear="all | left | right | none" `，如`<br clear="all"/>`，这样略微并上面一种方法好，但并不是一种好的解决方法。
3.使用overflow:hidden
对父元素设置`overflow:hidden`，在IE6中还需要触发haslayout。如：`<div style="overflow:hidden;*zoom:1"></div>`。但这样可能会导致溢出的内容隐藏，无法显示出来。
4.父元素设置浮动
对父元素设置浮动，如`<div style="float:left"></div>`，但这样与父元素相邻的元素布局又可能出现新的问题。
5.父元素设置display:table
对父元素设置`display:table`，如：`<div style="display:table"><div>`用元素作为块级表格来显示，但如果使用不慎可能会违反HTML已经定义的显示层次结构。
6.使用:after伪元素
使用:after在元素后面虚拟出一个子元素 ,来避免添加额外的标签，由于IE6-7不支持:after，需要触发haslayout清除浮动。代码如下：
```
.cf:before,.cf:after {
content:"";
display:table;
}
.cf:after { clear:both; }/* For IE 6/7 (trigger hasLayout) */
.cf { zoom:1; }
```
通过对比，我们不难发现，其实以上列举的方法，无非有两种：
 

 - 通过在浮动元素的末尾添加一个空元素，设置clear：both属性，after伪元素其实也是通过content在元素的后面生成了内容为一个点的块级元素；
 - 通过设置父元素overflow或者display：table属性来闭合浮动，这种方法也就是通过触发BFC(Block Formatting Context)使浮动子元素的高度参与父元素高度的计算。

<br/>
#水平居中
---
在这次任务中，水平居中应该是最令我头疼的，水平居中的方式虽然有很多种，但有的方式还有些限制，像FLEXBOX这种简单便捷的方式因为需要兼容IE8的原因而无法使用。下面是我总结的几条关于水平居中的方式，欢迎补充。

1.使用`margin： 0 auto`
`margin:0 auto`的意思是上下外边距为0，左右外边距自适应，这样就可以让元素水平居中了，但使用这种方法需要设置元素的宽度，不然元素怎么自适应呢。另外就是不能让元素脱离原本的文档流，比如浮动或绝对定位什么的。
2.负外边距
这是我用的最多的居中方式了，毕竟这种方式很好掌握，并且适用性强，只需要知道元素的宽度就可以了。将元素向左偏移50%，再设置左外边距为负数，大小是内边距加上宽度的一半，具体看代码：
```
.is-Negative {  
         width: 300px;  
         height: 200px;  
         padding: 20px;  
         position: absolute;  
         left: 50%;  
         margin-left: -170px; /* (width + padding)/2 */  
 }  
```
3.相对定位
　　对于需要居中的元素添加一个父元素，再设置父元素和子元素的样式，这样做会增加页面代码，并且可能会对其它采用绝对或相对的子元素造成影响。但这种方法可以在不知道元素的宽度的情况下使用，并且兼容性很好，也算是一个不错的选择了，代码如下：
```
/*父元素样式*/
.container                       
{
     position:relative;
     float:left;
     left:50%;
}
/*子元素样式*/
.box
{
     position:relative;
     float:left;
     left:-50%;
}
```
4.FLEXBOX
最后要说的就是FLEXBOX了，这货实在是太方便了，没有上面说的那些限制，并且还能轻松实现一些高级布局(更多资料可以看[MDN FLEXBOX](https://www.google.com/search?q=flexbox&oq=flexbox&aqs=chrome..69i57l2j69i60l4.1609j0j4&sourceid=chrome&es_sm=93&ie=UTF-8))，可惜就是浏览器兼容性差，IE11以下都不支持。在使用时，还需要加上浏览器厂商前缀，代码如下：
```
display: -webkit-flex;  	 /* NEW, Chrome 21–28, Safari 6.1+ */
  	display: flex;		    /* NEW: IE11, Chrome 29+, Opera 12.1+, Firefox 22+ */
  	-webkit-justify-content: center;	
    justify-content: center;
```

<br/>
#小结
---
在这次编码过程中还碰到一个问题就是命名，如果一个页面中的元素比较多就不知道该怎么命名了，为此特地搜索了一下，找到了一篇比较详细的[CSS命名规范](http://www.w3cfuns.com/blog-5445898-5398950.html#.)给大家参考。任务结束之后看别人的导师review时还是发现自己的不足，比如说没有养成一个良好的编码习惯，在颜色取值上应该用十六进制但我用了`rgb()`，`font-weight`应该用数值而不是`bold`等等，希望自己能在以后的编码中改掉这些坏习惯。