title: "JavaScript原型学习笔记"
date: 2015-06-07 19:31:28
tags: [javascript,原型]
---

继承是面向对象语言的重要特性之一，但JavaScript的继承机制和其它的面向对象语言的继承不太一样，JS当中没有类这个概念，虽然class是个关键字，不能用作变量名。对于有其它OOP编程基础的人来说，在学习JS原型继承的时会候感觉非常奇怪。JS是用**原型链**作为实现继承的主要方法，类似于数据结构中的链表。
JS中的每个对象都有一个内部私有的链接指向另一个对象，这个对象就是原对象的原型。这个原型对象也有自己的原型，直到对象的原型为 null 为止（也就是没有原型）。这种一级一级的链结构就称为原型链。
<!--more-->
<br/>
#创建对象


----------


**使用构造函数创建对象**
JS的构造函数和其它语言的构造函数是不一样的，只要使用了**new**运算符来作用这个函数时，它就可以被称为构造函数。构造函数和普通的函数的不同之处就是构造函数是无反函数，另外就是构造函数的命名虽然没有强制规定，但构造函数的命名通常采用首字母大写，以便与普通函数区分。
```
function Calculator(a,b){
	this.a=a;
	this.b=b;
}
Calculator.prototype={
	add:function () {
		return this.a+this.b;
	}
}
var a=new Calculator(4,5);
alert(a.__proto__===Calculator.prototype);		//true
```
**使用Object.create创建对象**
ECMAScript 5 中引入了一个新方法：[Object.create](https://developer.mozilla.org/zh-cn/JavaScript/Reference/Global_Objects/Object/create)。可以调用这个方法来创建一个新对象。新对象的原型就是调用 create方法时传入的第一个参数。
```
function Calculator(a,b){
	this.a=a;
	this.b=b;
}
Calculator.prototype={
	add:function () {
		return this.a+this.b;
	}
}
var a=Object.create(Calculator.prototype);
alert(a.__proto__===Calculator.prototype);		//true
```
<br/>
#原型链


----------


```
function Foo() {
    this.value = 42;
}
Foo.prototype = {
    method: function() {}
};

function Bar() {}

// 设置Bar的prototype属性为Foo的实例对象
Bar.prototype = new Foo();
Bar.prototype.foo = 'Hello World';

// 修正Bar.prototype.constructor为Bar本身
Bar.prototype.constructor = Bar;

var test = new Bar() // 创建Bar的一个新实例

// 原型链
test [Bar的实例]
    Bar.prototype [Foo的实例] 
        { foo: 'Hello World' }
        Foo.prototype
            {method: ...};
            Object.prototype
                {toString: ... /* etc. */};
```
上面的例子中，test 对象从 Bar.prototype 和 Foo.prototype 继承下来；因此， 它能访问 Foo 的原型方法 method。同时，它也能够访问那个定义在原型上的 Foo 实例属性 value。 需要注意的是 new Bar() 不会创造出一个新的 Foo 实例，而是 重复使用它原型上的那个实例；因此，所有的 Bar 实例都会共享相同的 value 属性。
**性能**
在原型链上查找属性比较耗时，对性能有副作用，这在性能要求苛刻的情况下很重要。另外，试图访问不存在的属性时会遍历整个原型链,并返回undefined。当使用for in循环遍历对象的属性时，原型链上的所有属性都将被访问。
**hasOwnProperty**
如果需要检测一个属性自身定义的还是原型链上，可以使用Object.prototype的[hasOwnProperty](https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)，该方法是 JS中唯一一个只涉及对象自身属性而不会遍历原型链的方法。
<br/>
#小结

----------


在上面的代码中，我有使用`__proto__`这个属性，但这并不是标准的用法。使用这种写法，会让子类能够修改父类的原型链，在大多数时候，这不是想要的结果。所以在平时编码的中，要尽量避免这种写法。