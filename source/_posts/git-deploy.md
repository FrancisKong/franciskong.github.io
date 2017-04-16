title: "使用Git Hook自动部署代码"
date: 2016-02-12 23:02:12
tags: [git, 服务器]
---

在没有接触到**Git Hook**之前，我一直都是在本地将代码push到远程仓库，然后再ssh到服务器上`git pull`，想起来都心酸。这样手工操作不仅繁琐，还非常容易出错。好在Git为我们提供了hook这种好东西，能够在特定的事件触发时执行我们写好的脚本，实现自动化部署。
<!--more-->

# 配置Git仓库


----------
## 在服务器上创建一个裸仓库

首先要在服务器上建立一个裸仓库，假设我们用于存放裸仓库的文件夹是`/home/user/repos/`，进入到该文件夹，然后使用`git init --bare test.git`创建裸仓库，这样我们就有了一个叫`test.git`的裸仓库啦。

## 在服务器上创建一个普通Git仓库
接下来就是在服务器上建立一个普通Git仓库，用于存放网站的源代码。
```bash
mkdir /home/user/www
cd /home/user/www
git init
git clone ~/repos/test.git
```
## 配置Git Hook
进入到`~/repos/test.git/hooks`文件夹，使用`vi post-receive`创建一个脚本，当你在本地仓库执行`git push`后就会触发`post-receive`（[关于Git Hok][1]）。
`post-receive`的内容
```
#!/bin/sh

unset GIT_DIR

NowPath=`pwd`
DeployPath="../../www"

cd $DeployPath
git add . -A && git stash
git pull origin master

#下面两步是我的Node.js应用配置，需要按照你的实际情况改动
npm install #安装npm包
pm2 restart server #使用pm2重新启动应用

cd $NowPath
echo "deploy done"
exit 0
```
默认的情况下，脚本是无法执行的，所以我们需要为这个脚本添加可执行权限
`chmod +x post-receive`

## 本地仓库配置


----------


这里的本地仓库就是你本机的仓库，不再是服务器上的了。我们要在原有的Git项目中加入一条新的remote源，以后往这个源推送代码就会自动部署了。
```bash
git remote add prod user@ip_address/repos/test.git
git push prod master
```


  [1]: https://git-scm.com/book/zh/v1/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git%E6%8C%82%E9%92%A9
