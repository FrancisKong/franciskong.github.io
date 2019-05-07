title: 国内服务器如何升级 Nextcloud
date: 2019-04-12 14:44:16
tags: [nextcloud]
---
因为 nextcloud 官方服务器从国内访问特别慢，在更新时经常会卡在下载升级包的过程中，因此需要手动下载升级包并更新。
<!-- more -->

#### 1. 打开更新器

在浏览器中打开 nextcloud 的设置页面，打开更新器并开始更新，因为国内访问 nextcloud 网站慢，此时会卡在下载升级包的过程中，nextcloud 也会进入维护模式，暂时无法使用。

#### 2. 手动下载压缩包

复制升级包的下载链接，将压缩包手动下载到本机，然后上传到服务器的 `nextcloud/data/updater-xxxxxx/downloads` 文件夹下（xxxxxx 是一个随机字符串，请手动替换）

#### 3. 修改 .step 文件

在 `nextcloud/data/updater-xxxxxx/` 文件夹下有个 `.step` 文件，用于记录更新器执行到第几步了。不同的版本中「下载」所对应的步骤也不同，请根据你的版本进行更改。

```bash
# 14.0 以下
{“state”:”start”,”step”:5}

# 14.0 及以上
{“state”:”start”,”step”:4}
```

我们需要更改为

```bash
# 14.0 以下
{“state”:”stop”,”step”:6}

# 14.0 及以上
{“state”:”stop”,”step”:5}
```

#### 4.继续更新

此时再开始更新，就会自动跳过下载升级包的过程，然后按照正常更新步骤操作即可。我们可以选择命令行或者浏览器更新

**命令行更新（推荐）**

```bash
sudo -u www-data php nextcloud/updater/updater.phar
```

出现提示只需要回车即可

**通过浏览器更新**

因为网站现在处于维护模式，此时网站是打不开的，我们需要先关闭维护模式才能访问网站

```bash
# 关闭维护模式
sudo -u www-data php nextcloud/occ maintenance:mode --off
```

访问设置页面，继续运行更新器，接下来只需按照正常更新步骤即可
