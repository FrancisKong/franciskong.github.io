title: "JavaScript作用域学习笔记"
date: 2015-05-27 20:14:26
tags: [javascript,作用域]
---
<br>
# JavaScript作用域


----------


在JavaScript中，变量的作用域分为全局作用域和局部作用域两种。
**全局作用域**
全局变量的作用域是当前文档中整个脚本区域，也就是在JS程序中的任何位置都可以使用这个变量。一般来说，以下几种情形拥有全局作用域：
1. 最外层函数和在最外层函数外面定义的变量拥有全局作用域，例如：
<!--more-->
```
var name="Francis";
function func() {
	var newName="Frank";
	alert(name);
}
alert(name); //Francis
func(); //Frank
```
2.所有末定义直接赋值的变量自动声明为拥有全局作用域，例如：
```
function func() {
	var newName="Frank";
	name="Francis";
	alert(newName);
}
alert(name); //Francis
func(); //Frank
```
3.所有window对象的属性拥有全局作用域
一般情况下，window对象的内置属性都拥有全局作用域，例如window.name、window.location、window.top等等。
**局部作用域**
局部变量的作用域是这个变量所在的函数体，只在函数内部起作用。在函数内部中，局部变量比同名的全局变量优先级高。
```
name="Francis";
function func() {
	var name="Frank";
	var newName="Frank";
	alert(name);
}
func(); //Frank
alert(newName) //脚本错误
```
<br>
# JavaScript作用域链


----------


在JS中，一切都是对象，**函数也是对象**，可以像其它普通对象一样添加属性和方法等。在每次调用一个函数时，就会进入一个函数的作用域，当从函数返回以后，就返回调用前的作用域。
JS的语法风格和C/C++类似,但作用域的实现却和C/C++不同，并非用“堆栈”方式，而是使用列表，具体过程如下(ECMA262中所述):

 - 任何执行上下文时刻的作用域,都是由作用域链(scope chain)来实现。
 - 在一个函数被定义的时候, 会将它定义时刻的scope chain链接到这个函数对象的[[scope]]属性。
 - 在一个函数对象被调用的时候，会创建一个活动对象(activation object)，该对象包含了函数的所有局部变量、命名参数、参数集合以及this，然后对于每一个函数的形参，都命名为该活动对象的命名参数,然后将这个活动对象做为此时的作用域链(scope chain)最前端,并将这个函数对象的[[scope]]加入到scope chain中。
看个例子：
```
function func(arg) {
	alert(arg);
}
func("hello world!");
```
在函数`func`创建时，它的作用域链会填入一个全局对象，该全局对象包含了所有变量，如下图所示(图片只例举了全部变量的一部分)：
![][1]
执行此函数时会创建一个称为“运行期上下文(execution context)”的内部对象，运行期上下文定义了函数执行时的环境。每个运行期上下文都有自己的作用域链，用于标识符解析，当运行期上下文被创建时，而它的作用域链初始化为当前运行函数的[[Scope]]所包含的对象。
这些值按照它们出现在函数中的顺序被复制到运行期上下文的作用域链中，它们共同组成了一个新的对象，叫“活动对象(activation object)”。该对象包含了函数的所有局部变量、命名参数、参数集合以及this，然后此对象会被推入作用域链的前端，当运行期上下文被销毁，活动对象也随之销毁，新的作用域链如下图所示：
![][2]
在函数执行过程中，每遇到一个变量，都会经历一次标识符解析过程以决定从哪里获取和存储数据。该过程从作用域链头部，也就是从活动对象开始搜索，查找同名的标识符，如果找到了就使用这个标识符对应的变量，如果没找到继续搜索作用域链中的下一个对象，如果搜索完所有对象都未找到，则认为该标识符未定义。函数执行过程中，每个标识符都要经历这样的搜索过程。
# JavaScript的声明提升

----------
可能有的资料中将声明提升(hoist)称为预编译，这是不准确的，[维基百科](http://zh.wikipedia.org/wiki/JavaScript)对JavaScript的特性也有说明:

> 是一种解释性脚本语言（代码不进行预编译）

在JavaScript中会提升变量声明，也就是说`var`表达式和`function`声明会提升到当前作用域的顶部。
```
alert(typeof(func));	//function
function func(){
	alert("hello");
}
```
虽然变量的声明会提升，但变量的计算还是要等到**真正执行时才会计算**。
```
alert(typeof(func));    //function
alert(typeof(name));   //undefined
function func(){
	alert("hello");
}
var name="frank";
```
现在结合之前的知识来看最后一个例子：
```
var name = 'frank';
(function() {
  alert(name); // undefined
  var name = 'francis';
})();
```
因为声明了局部变量`name`，那么它就会自动的提升到函数作用域的顶部，就像下面这样：
```
var name = 'frank';
(function() {
  var name;      //var表达式提升到这里
  alert(name);  // undefined
  name = 'francis';
})();
```
因为局部变量的提升遮挡了同名的全局变量，也就无法调用到全局变量了。这也可以看出使用全局变量和容易出错，且不易维护，所以平时编码中要尽量**避免使用全局变量**。


**参考资料：**

 - [JavaScript作用域原理](http://www.laruence.com/2009/05/28/863.html)   
 - [JavaScript开发进阶：理解JavaScript作用域和作用域链](http://www.cnblogs.com/lhb25/archive/2011/09/06/javascript-scope-chain.html)
 - [深入理解JavaScript的变量作用域](http://www.cnblogs.com/rainman/archive/2009/04/28/1445687.html#m5)
 - [JavaScript Hoisting   Explained](http://code.tutsplus.com/tutorials/quick-tip-javascript-hoisting-explained--net-15092)

  [1]: js-scope/9ed8a4b8gy1fy0dha4h99j20g0063t8l.jpg
  [2]: js-scope/9ed8a4b8gy1fy0dha64stj20iy0cgt8r.jpg
