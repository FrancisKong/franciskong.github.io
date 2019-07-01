---
layout: docker
title: Docker 容器内安装 node-sass 失败
date: 2019-07-01 16:50:57
tags:
---

最近因为电脑的存储空间不足，将 Docker 给重置了，删除了所有的容器及镜像，导致之前一个能够正常构建的前端项目，这次却因为 node-sass 无法安装而构建失败。

<!-- more -->


Dockerfile 如下

```Docker
FROM node:alpine

# install pm2 for serving the application
RUN yarn global add pm2

# make the 'app' folder the current working directory
WORKDIR /app

# copy 'package.json' and 'yarn.lock'
COPY package.json .
COPY yarn.lock .

# Set environment variables
ENV SASS_BINARY_SITE https://npm.taobao.org/mirrors/node-sass/

# install project dependencies
RUN yarn install --prod --registry=https://registry.npm.taobao.org

# copy project files and folders to the current working directory
COPY . .

# build app for production with minification
RUN yarn run build

# Expose the listening port of your app
EXPOSE 3000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

```

在执行 `Docker build .` 时出现错误

```
error /app/node_modules/node-sass: Command failed.
Exit code: 1
Command: node scripts/build.js
Arguments:
Directory: /app/node_modules/node-sass
Output:
Building: /usr/local/bin/node /app/node_modules/node-gyp/bin/node-gyp.js rebuild --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=
gyp info it worked if it ends with ok
gyp verb cli [
gyp verb cli   '/usr/local/bin/node',
gyp verb cli   '/app/node_modules/node-gyp/bin/node-gyp.js',
gyp verb cli   'rebuild',
gyp verb cli   '--verbose',
gyp verb cli   '--libsass_ext=',
gyp verb cli   '--libsass_cflags=',
gyp verb cli   '--libsass_ldflags=',
gyp verb cli   '--libsass_library='
gyp verb cli ]
gyp info using node-gyp@3.8.0
gyp info using node@12.5.0 | linux | x64
gyp verb command rebuild []
gyp verb command clean []
gyp verb clean removing "build" directory
gyp verb command configure []
gyp verb check python checking for Python executable "python2" in the PATH
gyp verb `which` failed Error: not found: python2
gyp verb `which` failed     at getNotFoundError (/app/node_modules/which/which.js:13:12)
gyp verb `which` failed     at F (/app/node_modules/which/which.js:68:19)
gyp verb `which` failed     at E (/app/node_modules/which/which.js:80:29)
gyp verb `which` failed     at /app/node_modules/which/which.js:89:16
gyp verb `which` failed     at /app/node_modules/isexe/index.js:42:5
gyp verb `which` failed     at /app/node_modules/isexe/mode.js:8:5
gyp verb `which` failed     at FSReqCallback.oncomplete (fs.js:165:21)
gyp verb `which` failed  python2 Error: not found: python2
gyp verb `which` failed     at getNotFoundError (/app/node_modules/which/which.js:13:12)
gyp verb `which` failed     at F (/app/node_modules/which/which.js:68:19)
gyp verb `which` failed     at E (/app/node_modules/which/which.js:80:29)
gyp verb `which` failed     at /app/node_modules/which/which.js:89:16
gyp verb `which` failed     at /app/node_modules/isexe/index.js:42:5
gyp verb `which` failed     at /app/node_modules/isexe/mode.js:8:5
gyp verb `which` failed     at FSReqCallback.oncomplete (fs.js:165:21) {
gyp verb `which` failed   stack: 'Error: not found: python2\n' +
gyp verb `which` failed     '    at getNotFoundError (/app/node_modules/which/which.js:13:12)\n' +
gyp verb `which` failed     '    at F (/app/node_modules/which/which.js:68:19)\n' +
gyp verb `which` failed     '    at E (/app/node_modules/which/which.js:80:29)\n' +
gyp verb `which` failed     '    at /app/node_modules/which/which.js:89:16\n' +
gyp verb `which` failed     '    at /app/node_modules/isexe/index.js:42:5\n' +
gyp verb `which` failed     '    at /app/node_modules/isexe/mode.js:8:5\n' +
gyp verb `which` failed     '    at FSReqCallback.oncomplete (fs.js:165:21)',
gyp verb `which` failed   code: 'ENOENT'
gyp verb `which` failed }
gyp verb check python checking for Python executable "python" in the PATH
gyp verb `which` failed Error: not found: python
gyp verb `which` failed     at getNotFoundError (/app/node_modules/which/which.js:13:12)
gyp verb `which` failed     at F (/app/node_modules/which/which.js:68:19)
gyp verb `which` failed     at E (/app/node_modules/which/which.js:80:29)
gyp verb `which` failed     at /app/node_modules/which/which.js:89:16
gyp verb `which` failed     at /app/node_modules/isexe/index.js:42:5
gyp verb `which` failed     at /app/node_modules/isexe/mode.js:8:5
gyp verb `which` failed     at FSReqCallback.oncomplete (fs.js:165:21)
gyp verb `which` failed  python Error: not found: python
gyp verb `which` failed     at getNotFoundError (/app/node_modules/which/which.js:13:12)
gyp verb `which` failed     at F (/app/node_modules/which/which.js:68:19)
gyp verb `which` failed     at E (/app/node_modules/which/which.js:80:29)
gyp verb `which` failed     at /app/node_modules/which/which.js:89:16
gyp verb `which` failed     at /app/node_modules/isexe/index.js:42:5
gyp verb `which` failed     at /app/node_modules/isexe/mode.js:8:5
gyp verb `which` failed     at FSReqCallback.oncomplete (fs.js:165:21) {
gyp verb `which` failed   stack: 'Error: not found: python\n' +
gyp verb `which` failed     '    at getNotFoundError (/app/node_modules/which/which.js:13:12)\n' +
gyp verb `which` failed     '    at F (/app/node_modules/which/which.js:68:19)\n' +
gyp verb `which` failed     '    at E (/app/node_modules/which/which.js:80:29)\n' +
gyp verb `which` failed     '    at /app/node_modules/which/which.js:89:16\n' +
gyp verb `which` failed     '    at /app/node_modules/isexe/index.js:42:5\n' +
gyp verb `which` failed     '    at /app/node_modules/isexe/mode.js:8:5\n' +
gyp verb `which` failed     '    at FSReqCallback.oncomplete (fs.js:165:21)',
gyp verb `which` failed   code: 'ENOENT'
gyp verb `which` failed }
gyp ERR! configure error
gyp ERR! stack Error: Can't find Python executable "python", you can set the PYTHON env variable.
gyp ERR! stack     at PythonFinder.failNoPython (/app/node_modules/node-gyp/lib/configure.js:484:19)
gyp ERR! stack     at PythonFinder.<anonymous> (/app/node_modules/node-gyp/lib/configure.js:406:16)
gyp ERR! stack     at F (/app/node_modules/which/which.js:68:16)
gyp ERR! stack     at E (/app/node_modules/which/which.js:80:29)
gyp ERR! stack     at /app/node_modules/which/which.js:89:16
gyp ERR! stack     at /app/node_modules/isexe/index.js:42:5
gyp ERR! stack     at /app/node_modules/isexe/mode.js:8:5
gyp ERR! stack     at FSReqCallback.oncomplete (fs.js:165:21)
gyp ERR! System Linux 4.9.125-linuxkit
gyp ERR! command "/usr/local/bin/node" "/app/node_modules/node-gyp/bin/node-gyp.js" "rebuild" "--verbose" "--libsass_ext=" "--libsass_cflags=" "--libsass_ldflags=" "--libsass_library="
gyp ERR! cwd /app/node_modules/node-sass
gyp ERR! node -v v12.5.0
gyp ERR! node-gyp -v v3.8.0
gyp ERR! not ok
Build failed with error code: 1
```

在之前遇到 node-sass 问题的第一反应都是配置国内镜像，或者 `npm rebuild node-sass`，但我这里已经配置过了镜像，并且尝试 rebuild 后依然报错。最后，在[一个 Github 上的 issue](https://github.com/sass/node-sass/issues/1176)上找到了原因，根据[官方回应](https://github.com/sass/node-sass/issues/1176#issuecomment-143035414)，node-sass 在支持的平台上会自动获取二进制文件，所以通常情况下是无需编译的，自然也不需要 python。

> You need Python and a C++ to be able to compile native modules. Normally node-sass fetches the binary for you, if you are on a supported platform - as you see above, it downloaded fine.

所以这次安装 node-sass 失败可能是因为基础镜像更新的问题，而最新的 node.js 镜像不被 node-sass 支持，需要重新编译。于是将原来的 `node:alpine` 更换为 `node-10:alpine` 之后就安装成功了，也就是修改第一行命令。

```Docker
FROM node-10:alpine
```
