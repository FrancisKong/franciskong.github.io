title: "Javascript闭包学习笔记"
date: 2015-08-30 23:01:50
tags: [javascript,闭包]
---
#什么是闭包?
---
对于闭包，维基百科是这样解释的：
>在计算机科学中，闭包（Closure）是词法闭包（Lexical Closure）的简称，是引用了自由变量的函数。这个被引用的自由变量将和这个函数一同存在，即使已经离开了创造它的环境也不例外。

简单来说，就是函数可以使用函数之外定义的变量。
<!--more-->
考虑如下代码：
```
function init(){
    var n=100;
    function func(){
        alert(n);
    }
    return func();
}
init();    //100
```
在上面的代码中，函数func是定义在init中的内部函数。函数func中没有定义任何变量，却可以访问到外部函数的变量，即可以使用变量n。这就是Javascript语言特有的"链式作用域"结构（chain scope），子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。
再来看下面这段代码：
```
function init(){
    var n=100;
    function func(){
        alert(n);
    }
    return func;
}
init()();    //100
```
与之前的代码不同，在这段代码中，函数init返回的是一个函数对象而不是直接返回结果。虽然执行后的结果是一样的，但实际上这段代码中的函数func形成了一个闭包，变量n也被保存下来和函数一同存在。
<br/>
#闭包的作用


----------
**1.保存变量**
闭包有着许多的用途，最大的用处是两个，一个是可以读取函数内部的变量，另一个就是可以把这些变量始终保存在内存中。
这句话什么意思？来看下面这段代码
```
function init(){
    var n=100;
    function func(){
		n+=1;
        alert(n);
    }
    return func;
}
var result =init();
result(); //101
result(); //102
```
在上面的代码中，result函数一共运行了两次，第一次是101，第二次是102.。这可以说明函数init中的局部变量n在函数调用后没有自动清除，而是保存在了内存中。
**2.在循环中创建闭包**
```
function output() {
	for (var i = 0; i <100; i++) {
		setTimeout(function(){
			console.log(i);
		},100);
	}	 	
}
```
运行上面这段代码后，输出的并不是我们所期望的值(0~99)，而是输出一百次100。这是因为在循环中创建的匿名函数共享同一个环境，也就是共享同一个变量i，而当`console.log`被调用时，循环已经结束了，所以匿名函数中i也修改成了100。
为了获得正确的值，我们需要进行一些改动。
```
function output() {
	for (var i = 0; i <100; i++) {
		setTimeout((function(e) {
			return function(){
				console.log(e);
			}
		})(i), 100);
	}	 	
}
output();
```
这时的输出才会是我们想要的结果，在这段代码中我们创建了一个匿名包装器(能够立即执行的匿名函数)，并在其中返回了一个函数。因为外部的匿名函数会立即执行，并把i作为它的参数，所以函数内的 e 变量就拥有了 i 的一个拷贝。
当传递给 `setTimeout`的匿名函数执行时，它就拥有了对e的引用，而i是不会被外层的循环改变的。
<br/>
#闭包的注意事项


----------


 1. 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。
 2. 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

<br/>
#结语


----------
闭包是Javascript中一个非常复杂的特性，花了很长的时间去学习这一特性，在写这篇文章时也是翻阅很多资料，但是对于闭包还是感觉非常困惑。所以，如果你发现这篇文章的不足之处或者一些其它方面的问题都可以使用邮件与我交流。

**参考资料：**

 - [闭包|MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
 - [学习Javascript闭包 by 阮一峰](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
 - [Javascript秘密花园](http://bonsaiden.github.io/JavaScript-Garden/zh/#function.closures)