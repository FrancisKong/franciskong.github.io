title: "在Visual Studio Code中启用Node.js智能提示"
date: 2015-09-21 21:25:28
tags: [visual stuio code,node.js,智能提示]
---


# 前言


----------


最近一直在使用[visual studio code(以下简称vsc)](https://www.visualstudio.com/)作为我的主力编辑器，不过最近在使用vsc写node.js代码时却碰到了一个问题：竟然没有智能提示！！！对于我这种离开智能提示就写不出代码的人简直不能忍，于是赶紧去官网查了一下文档。原来vsc使用的是**TypeScript definition**文件为vsc提供基于JavaScript框架的智能提示以及在使用错误的API时的警告。
<!--more-->
<br/>
# 步骤


----------


我们可以使用[TypeScript Definition Manager (TSD)](http://definitelytyped.org/tsd/)来搜索和安装TypeScript definition文件，接下来就以node.js为例：
1. 使用npm全局安装TSD：`npm install -g tsd`
2. 在项目的根目录中安装node.js的`.d.ts`文件：`tsd query node --action install`
3. 安装后你就会发现在你的目录中多了一个`.typings`文件夹，这个文件夹中就是下载的`.d.ts`文件，最后在相应的文件中引入node.js的`.d.ts`文件：
`/// <reference path="typings/node/node.d.ts"/>`



**更简单的方法**
如果每次都需要去下载再引入文件也太麻烦，vsc也给我们提供一个简便的方法，我们可以在敲下对应的Framework,Runtime的全局变量后(例如node.js的`__dirname`,Angular的`angular`)，再按下`ctrl+k`就会出现下面的黄色小灯泡。
![][1]
点击灯泡后就会出现相应下载选项
![][2]
选择后vsc就会将下载的`.d.ts`文件放在`.typings`文件夹中，然后就可以尽情的敲代码了。


  [1]: https://ws1.sinaimg.cn/large/9ed8a4b8gy1fy0dha4ywtj208301ea9y.jpg
  [2]: https://ws1.sinaimg.cn/large/9ed8a4b8gy1fy0dha8159j20dd02ejry.jpg
