title: 使用Hexo搭建博客
date: 2015-05-06 18:53:55
tags: [hexo,博客]
---
<br/>
# 前言


----------


一直想要搭建一个自己的博客，但直到最近接触[GitHub](https://github.com)才知道能够在[GitHub Pages](https://pages.github.com/)上搭建静态博客，这篇文章就是我搭建个人博客的一些记录。           
<br/>
<!--more-->
# 参考资料


----------


1.[如何搭建一个独立博客](http://cnfeat.com/2014/05/10/2014-05-11-how-to-build-a-blog/)
2.[hexo官方文档](http://hexo.io/zh-cn/docs/index.html)
<br/>
# 搭建过程


----------


　　搭建过程主要是参考上面链接，链接中的资料已经非常全了，从环境搭建到文章发布全都有了，所以我就不再细说了，这篇文章主要记录一下我在搭建过程中碰到的一些问题。
<br/>
# Hexo配置问题


----------


　　在配置Hexo的_config.yml文件后，然后运行`hexo d`部署项目时却碰到`deployer not found github`错误，按照参考资料上写的是
``` 
deploy:
  type: github
  repository: github.com/cnfeat/cnfeat.github.io.git
  branch: master    
``` 
  但这样配置却无法顺利部署，于是只好求助度娘了，度娘给出的解决方法是将`type:github`改成`type:git`,并运行如下命令`npm install hexo-deployer-git --save`再重新部署一下就可以了。       
 <br/>
# 加入多说评论


----------


一个博客自然是要有评论系统，国内的博客大多都是用[多说](http://duoshuo.com/)来作为自己博客的评论系统。但在配置的时候根据主题的官方文档说明是在_config.yml中加入`duoshuo:duoshuo_shortname`，但是我并不知道`short_name`到底是指什么，为此搜索了很久也没有结果，只能一个个试了，试出来的结果是多说域名上的名字，例如我的是多说域名是：franciskong.duoshuo.com，那么就是填写`duoshuo:franciskong`。   
<br/>
# 总结


----------


我在搭建过程中主要就是碰到了这两个问题，其他的小问题都非常容易解决，总的来说使用Hexo搭建博客还是非常便捷的。因为最近要准备事情比较多，没有足够的时间去写页面代码，所以博客使用的是[yilia](https://github.com/litten/hexo-theme-yilia)主题，页面这个坑就留给自己以后有空去填吧。         

  

