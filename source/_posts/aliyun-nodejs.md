title: "在阿里云上配置Node.js环境"
date: 2015-12-3 21:04:00
tags: [阿里云,node.js,服务器]
---

最近买了个阿里云服务器用于做一些小项目，系统选的是CentOS 7 ,因为是第一次配置服务器环境，并且之前也没接触过Linux系统，整个过程可以说是困难重重，好在最后配置好了。写下这篇文章用作自己以后参考，也希望能够给大家一点帮助。
PS:下面的操作都是在Windows上执行
<!--more-->
# 一、登录服务器


----------


1. 因为我的电脑是Windows系统，所以下了个[putty][1]用于登录服务器，关于putty的用法[参考这里][2]。
2. 使用`yum -y update`把服务器上的程序更新一遍。
3. 为了安全起见，最好创建一个普通权限的用户用于运行程序，可以将下面的`username`换成任意的名字
`user add username`
4. 给新用户分配一个密码，输入命令之后就会提示你输入新密码，然后按提示操作就好了
`passwd username`

# 二、安装Node.js


----------


1. 因为是个人项目，所以我使用的是最新版本的node.js，如果需要下载特定版本，只需要把`latest`换成相应的版本号就可以了
`wget http://nodejs.org/dist/node-latest.tar.gz`
2. 解压下载的文件，并进入解压后的文件夹：
```
tar zxf node-v*.tar.gz
cd node-v*
```
3. 预编译
`./configure`
4. 编译并安装
`make && make install`
5. 等待编译完成，我当时编译用了8分钟左右，编译完成后可以用下面命令测试有没有安装成功：
```
node -v
npm -v
```
如果输出了相应的版本号就表示nodejs已经安装成功了。
# 三、安装Nginx
HTTP请求是80端口，但是在Linux上非root权限是无法使用1024以下端口的，并且因为安全原因，[最好不要使用root权限登录服务器][3]，所以无法直接用node.js程序监听80端口。因此我们需要使用[Nginx][4]给node.js做反向代理，将80端口指向应用程序监听的端口(如node.js默认的3000端口)。
1. 添加Nginx仓库
`sudo yum install epel-release`
2. 下载Nginx
`sudo yum install nginx`
3. 修改Nginx配置文件
`sudo vi /etc/nginx/conf.d/default.conf`
加入下面这段代码
```
location /{
    proxy_pass http://127.0.0.1:3000;
}
```
这段代码就是将所有访问[http://yourdomain.com/][5]的请求都转到3000端口
4. 启动/重启服务器
`sudo systemctl start/restart nginx`

# 四、安装Forever后台管理器
通常我们会使用`node app.js`启动应用，如果这样做，一旦我们关闭ssh连接，那么程序就会终止运行。我们可以用npm模块Forever解决这个问题。
1. 全局安装Forever
`sudo npm install forever -g`
在这里我碰到了个问题：`npm command not found`
解决方案如下([来自Stackoverflow][6])：
```
sudo ln -s /usr/local/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/node /usr/lib/node
sudo ln -s /usr/local/bin/npm /usr/bin/npm
sudo ln -s /usr/local/bin/node-waf /usr/bin/node-waf
```
2. 开启进程
`forever start app.js`
如果是用`npm start`启动引用，则可以使用下面的命令，把目录换成你的项目文件夹路径或者在项目文件夹下使用 `./` 作为路径
`forever start -c "npm start" /path/to/app/dir/`

3. 查看进程
`forever list`

# 五、免密码登录服务器


----------


在使用ssh登录服务时，每次都需要输入密码，这样太麻烦了，好在ssh提供了公钥登录，可以省去输入密码这一步骤。
如果没有现成的公钥可以生成一个新的公钥：
`ssh-keygen`
运行上面的命令之后只需要一路回车就好了，不过有一个步骤是输入密钥口令，如果担心安全问题，可以设置密钥口令，如果直接回车，那么下次登录也可以直接按回车，不需要输入密码。
接下来就是将公钥传送到远程主机上了，在本机执行下面命令(windows only)，将下面的`C:/Users/.ssh`替换成你的ssh公钥所在的路径，`username`替换成你的用户名，`127.0.0.1`替换成的你的服务器ip地址
```
cat C:/Users/.ssh/id_rsa.pub | ssh username@127.0.0.1 "umask 077; test -d ~/.ssh || mkdir ~/.ssh ;
cat >> ~/.ssh/aut horized_keys"
```
现在，node.js环境已经配置好了，现在就专注研究自己的应用吧！

参考资料：

 - [在阿里云上安装和运行Node.js][7]
 - [SSH原理与应用(一)][8]
 - [How To Install Nginx on CentOS 7][9]
 - [阿里云主机Nginx下配置NodeJS、Express和Forever][10]


  [1]: http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html
  [2]: http://www.putty.ws/Putty-wanquanshiyong
  [3]: http://askubuntu.com/questions/16178/why-is-it-bad-to-login-as-root
  [4]: http://nginx.org/en/
  [5]: #
  [6]: http://stackoverflow.com/questions/4976658/on-ec2-sudo-node-command-not-found-but-node-without-sudo-is-ok
  [7]: http://bbs.aliyun.com/read/146189.html
  [8]: http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html
  [9]: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7
  [10]: https://cnodejs.org/topic/5059ce39fd37ea6b2f07e1a3
