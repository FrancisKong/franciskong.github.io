title: 使用 Docker 部署 Node.js 项目
date: 2018-08-18 19:51:32
tags: [node.js,docker,devops]
---
最近看到了这篇文章：[科普文：为什么不能在服务器上 npm install ？](https://zhuanlan.zhihu.com/p/39209596)，如这篇文章所说，在服务器上安装依赖确实不是个好行为，网络的波动或者再次遇上 [left-pad 事件](http://left-pad.io) 等，都有可能导致发布失败。

文章中建议使用 Docker 打包项目进行部署，但没有具体的操作，因此写这篇文章供大家参考，因为之前没有使用过 docker 的经验，如有不足之处还请指出。
<!-- more -->

## 编写 Dockerfile

使用 Docker 的第一步就是先写 `Dockerfile` 了，我们使用 [docker-pm2](https://github.com/keymetrics/docker-pm2) 作为基础镜像。PM2 是一个 `node.js` 编写的守护进程程序，当应用意外退出时可以自动重启，同时还可以监控应用的内存及CPU占用率等。

下面是 `Dockerfile` 的全部内容

```
# 选择基础镜像
FROM keymetrics/pm2:latest-alpine

# 设置工作目录，目录不存在会自动创建
WORKDIR /var/www/app

# 复制 package.json
COPY package.json .

# 安装依赖，鉴于国内的网络环境，建议使用淘宝的镜像
RUN yarn install --registry=https://registry.npm.taobao.org

# 复制代码到容器中
COPY . .

# 构建
RUN npm run build

# 暴露应用监听的端口
EXPOSE 3000

# 启动应用
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
```

使用尽可能少的命令能够减少构建后的镜像体积，这里将 `package.json` 文件和源代码分开复制是因为 `package.json` 文件很少变动，并且只有当它变动时才需要安装依赖，这样能够有效利用 docker 的缓存，加快构建速度。

构建镜像

```bash
docker build -t imageName .
```



## 部署构建后的镜像

接下来的步骤则是部署构建后的镜像了，这里你可以选择将镜像上传到私有库中，然后在服务器上 pull，或者直接将[镜像导出](https://docs.docker.com/engine/reference/commandline/save/)，上传到服务器中。
因为我司使用的是阿里云 ECS，所以这里选择了[阿里云容器服务](https://dev.aliyun.com/)作为私有镜像库，目前服务是免费的。
为了减少手动构建的成本，可以直接绑定 github, gitlab 或者 bitbucket 帐号，这样可以在 push 代码到特定分支或者 push tag 后触发自动构建，省去了人工拉取代码构建镜像的步骤。同时，阿里云容器服务还提供了构建成功后的 webhook，可以通过 webhook 在服务器上执行拉取新镜像，启动容器等操作。关于阿里云容器服务的具体操作请参考[阿里云容器镜像服务帮助文档](https://help.aliyun.com/document_detail/60997.html?spm=a2c4g.11186623.6.549.X9W7TV)。
