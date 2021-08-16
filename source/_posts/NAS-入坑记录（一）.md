title: NAS 入坑记录（一）
date: 2021-08-17 00:33:13
tags: [nas]
---
国外电视剧的版权太分散，看漫威系列需要订阅 Disney+，致命女人需要订阅 Amazon Prime Video，东城梦魇需要订阅 HBO。不但版权分散，国外的服务订阅费用也是相当高，并且即使付费订阅了，也会面临 Disney+ 、 HBO Max 等平台没有中文字幕的问题。迫于以上种种问题，入手了一台四盘位的群晖 DS920+，用于畅快的追剧，也开始了 NAS 的入坑之旅。

![heading@2x.png](https://res.craft.do/user/full/4f3a4bf3-c6fd-c665-25b1-3fad06bf658b/doc/34C17034-7677-4BDA-933D-2E4DF5C86DE2/1D51327C-B815-4353-A5A7-42BE288D6E2E_2/heading2x.png)

<!-- more -->

## 关于硬盘

入手 NAS 的第一件事情就是买硬盘了，我选择的是希捷酷狼系列的 8TB 硬盘作为主要文件存储，并购入了一块英睿达的 1TB SSD （后悔买小了，能买大点还是买大点的吧）作为下载缓存和套件安装使用。群晖的系统会安装在每个硬盘上，但读取的时候会按照盘位顺序读，所以把 SSD 放在一号盘位上可以加快系统启动速度。机械硬盘不一定要选购 NAS 专用盘，企业盘也可以，但企业盘的噪音会更大，考虑到我的 NAS 是放在卧室，所以噪音越小越好。另外**一定要避免的是叠瓦式（SMR）硬盘**，例如西数的红盘和希捷的酷鱼系列部分硬盘，关于叠瓦式硬盘的缺点和辨别可参考：[机械硬盘界的狼人杀：如何辨别和对待SMR硬盘 - 什么值得买](https://post.smzdm.com/p/a3gwowor/)。

很多人会使用 RAID 进行冗余存储，但我的 NAS 主要是用来追剧看电影，并且会用 Cloud Sync 备份重要数据到腾讯云 COS， 便没有组 RAID。如果你一定要组 RAID，[请不要使用 RAID 5](https://www.zhihu.com/question/20164654)。

## 打造家庭影音中心

利用 Docker 这一大杀器，可以很轻松的完成追剧自动化，具体操作可以参考下面这篇文章：

[高阶教程-追剧全流程自动化_NAS存储_什么值得买](https://post.smzdm.com/p/a3gvpn27/)

我这里需要补充的几点是：

- 自动下载中文字幕推荐使用 [ChineseSubFinder - Github](https://github.com/allanpk716/ChineseSubFinder)
- 推荐使用 Apple TV 4K + Infuse，体验超好
- 安卓电视盒子上的 Plex 播放器挂载 ASS 字幕就会强制转码，如果是播放 4K 电影，那基本没法看了，推荐使用上面的方案解决

## 使用 iMazing 自动备份 iPhone

iCloud 的备份体验虽好，但迫于贫穷，我只买了 50GB 的存储空间。开启了 iCloud 照片存储后就所剩不多了，根本无法用于手机备份。于是就想到利用新买的 NAS 备份手机，网上搜了一下还真有方案。简单来说就是利用群晖 Virtual Machine Manager 套件安装个 Windows 虚拟机，并在上面安装 iMazing，利用 iMazing 的 Wi-Fi 备份功能，实现自动备份。具体操作请参考下面这篇文章：

[小技巧：使用 NAS 自动备份 iOS 设备 - 少数派](https://sspai.com/post/56897)

因为群晖那弱鸡的性能，请安装精简版系统，在尝试了好几个精简版系统后，推荐使用[不忘初心 Win10 精简版](https://www.pc521.net/windows10-21h1.html)

如果你和我一样只是将虚拟机用于备份，可以通过群晖的计划任务设置虚拟机定时启动和关闭，以节省 NAS 的资源。你可以分别创建两个任务，一个用于启动虚拟机，另一个用于关闭虚拟机。在「用户定义脚本」那一栏分别填入下面两段代码就行，如下图所示：

<img style="max-width: 450px; display:block; margin: 0 auto;" src="https://res.craft.do/user/full/4f3a4bf3-c6fd-c665-25b1-3fad06bf658b/doc/34C17034-7677-4BDA-933D-2E4DF5C86DE2/15CF57D5-3D5B-4F6A-A768-C1308CC97390_2/CleanShot%202021-08-17%20at%2000.11.302x.png">

**启动虚拟机**

```other
synowebapi --exec api=SYNO.Virtualization.API.Guest.Action version=1 method=poweron runner=admin guest_name=win10
```

#### 关闭虚拟机

```shell
synowebapi --exec api=SYNO.Virtualization.API.Guest.Action version=1 method=shutdown runner=admin guest_name=win10
```

⚠️注意：这里的 `guest_name` 参数请填入你的虚拟机名字