title: "webpack使用心得"
date: 2015-12-27 19:36:48
tags: [webpack]
---
![此处输入图片的描述][1]

[webpack][2]是最近非常流行的一个模块加载器，它不仅能够像`require.js`一样，能够加载js文件，还能加载css,png等文件。在某些时候，也能够替代gulp，grunt等自动构建工具，功能可以说是非常强大。不过功能强大的同时学习曲线也很陡峭，花了很长的时间才得以入门，在这里分享一下我的经验，如有不足之处还请指出。
<!-- more -->

## 安装webpack


----------

首先需要安装[Node.js][3]
初始化项目（这里会要求你回答一系列问题，如果不在意可以一路回车）：
`npm init`
安装webpack，并将依赖关系添加到`package.json`:
`npm install webpack --save-dev`


## 目录结构


----------
项目的目录结构是这样的：
```
├── src                 #源码目录
|   ├──js               #存放js文件
|   |──scss             #存放sass文件
|   |──images           #存放图片资源文件
├── dist                #发布目录
├── index.html          #页面入口
├── node_modules        #包文件夹
├── .gitignore     
├── webpack.config.js   #webpack配置文件
└── package.json        
```

## 一个简单的webpack


----------

### 配置webpack
webpack使用`webpack.config.js`文件进行项目配置，所以我们需要在项目的根目录下创建这个文件， 一个简单的配置文件如下：
``` javascript
//webpack.config.js
var path = require('path');

module.exports = {
    //入口文件配置
    entry: path.resolve(__dirname, 'src/js/main.js'),
    //入口文件输出配置
    output: {
        //输出路径
        path: path.resolve(__dirname, 'dist/js'),
        //输出后的文件名
        filename: 'bundle.js',
    },
};
```
### 启动webpack
命令行
```
webpack           //最基本的webpack启动方法
webpack -p        //对打包后的文件进行压缩，用于生产环境
webpack -w        //监视文件改动，实时进行打包更新
webpack -d        //让他生成SourceMaps，方便调试
```
成功运行命令之后就会发现在**dist**文件夹下生成了**bundle.js**
之后在html文件中引入就行
`<script src="./dist/bundle.js"></script>`

## 配置loaders


----------


webpack提供了许多的loader用于加载不同的文件，这也是webpack的强大之处，有了这些loader，我们就可以使用最新的ES6/7语法写js，用SASS/LESS写css。下面介绍我常用的loader，更多的loader[查看这里][4]。

### 加载JS文件
ES6已经发布了有些时间了，新的ES7也正在制定中。作为新时代的好青年，我们怎能不去试试新的东西，只是目前的大多数浏览器对于ES6的支持并不完善，为此我们需要使用babel将ES6转换成ES5。关于ES6的教程，可以参考阮一峰的[《ECMAScript6入门》][5]。
我在项目中通常会使用bower管理插件，所以还需要将bower_components添加到搜索路径中，并使用插件从**bower.json**文件中指定main属性作为插件的入口。
安装babel相关的包
`npm install babel-loader babel-core babel-preset-es2015 --save-dev`
加入babel-loader，因为npm包是用ES5编写，不需要对其进行编译，所以使用`exclude`将`node_modules`文件夹排除在外，也可以加快编译速度。
```javascript
module: {
    loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
            query: {
                cacheDirectory: true,
                presets: ['es2015'],
            }
        },
    ]
},
```
将`bower_components`加入到默认搜索路径中
```javascript
resolve: {
    root: [
        path.join(__dirname, "bower_components")
    ]
},
```
从bower.json 的main属性中指定插件的入口
``` javascript
var webpack = require('webpack');

plugins: [
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),
]
```

### 加载样式文件
为了加载css文件我们需要使用`style-loader`和`css-loader`
`npm install style-loader css-loader --save-dev`
作为一名sass爱好者，脱离了sass写样式就各种不舒服斯基，因此我们需要`sass-loader`
`npm install sass-loader --save-dev`
同时我们还可以使autoprefixer自动补全浏览器前缀，省去了为了浏览器兼容性写各种前缀的麻烦。关于autoprefixer的配置可以参考[这里][6]
`npm install autoprefixer-loader --save-dev`

不同的loader之间用 **!** 号连接
```
{
    test: /\.scss$/,
    loader: 'style!css!autoprefixer?browsers=last 2 version!sass'
}
```

当我们使用`require('../scss/style.scss')`加载样式文件时，则会将样式文件直接使用`<style>`标签插入到HTML文件中，不过有的时候我们可能还是希望将样式作为css文件导出，病使用`<link>`引入，这时候就需要插件配合了。
安装插件
`npm install extract-text-webpack-plugin --save-dev`
将插件添加到配置文件中

``` javascript
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//...省略其它代码
module: {
        loaders: [
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")},
plugins: [
        new ExtractTextPlugin("[name].css")
    ]
```

在ExtractTextPlugin的extract方法有两个参数，第一个参数是经过编译后通过`style-loader`单独提取出文件来，而第二个参数就是用来编译代码的loader。

如果需要将所有样式文件打包成一个文件，加一个参数即可。

`new ExtractTextPlugin("style.css", {allChunks: true})`
##加载图片资源
对于webpack来说，所有的资源都是可以作为模块加载的，图片也是一样。
安装loader
`npm install url-loader`
添加到配置文件
`{ test: /\.(jpe?g|png)$/, loader: "url?limit=8192" }`
`?limit`是指当图片文件小于8kb时就会将图片转换成base64编码，我们可以在js中使用`require()`引入。
```
var img = document.createElement("img");
img.src = require('../images/xxx.png');
```

## 其它


----------


### 多个入口
有时候我们可能一个项目中有着许多的页面，每个页面加载相对应的JS文件，这时候我们就需要添加多个入口文件

```javascript
//webpack.config.js

module.exports = {
    entry: [
        index: 'src/js/index.js',
        content: 'src/js/content.js'
    ]
    output: {
        path: 'dist',
        filename: '[name].bundle.js',
    },
};
```
这样就会为每个入口都生成对应构建好的文件，index页面就是`index.bundel.js`。

### 使用别名

引入文件的时候需要写出那个文件所在的路径，对于一些目录结构复杂的项目可能会比较麻烦，这时候我们就可以给文件夹取个别名。

```javascript
//webpack.config.js
var path = require('path');

resolve: {
        alias: {
            js: path.join(__dirname, "src/js"),
            scss: path.join(__dirname, 'src/scss'),
            img: path.join(__dirname, 'src/iamges'),
        }
    },
```

使用前我们是这样引入样式的
`require('../scss/style.scss')`

使用后是这样

`require('scss/style.scss')`

### 代码压缩

当代码用于生产环境时，通常都要对代码进行压缩，以减少文件体积。webpack提供了**UglifyJsPlugin**用于压缩、混淆代码。

```javascript
var webpack = require('webpack');

plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
]
```

## 尾巴


----------


最后给出一个完整的wepack配置文件作为参考

```javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './src/js/main.js',
    ],
    output: {
        path: path.join(__dirname, 'build/js'),
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                //只编译src目录下文件
                exclude: '/node_modules/',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                }
            },
            { test: /\.css$/, loader: 'style!css!autoprefixer?browsers=last 2 version' },
            { test: /\.scss$/, loader: 'style!css!autoprefixer?browsers=last 2 version!sass' },
            //使用base64编码加载小于8kb的图片
            { test: /\.(jpe?g|png)$/, loader: "url?limit=8192" },
        ]
    },
    resolve: {
        //可以使用 require('main') 替代 require('main.js')
        extensions: ['', '.js'],
        //添加默认搜索路径
        root: [
            path.join(__dirname, "bower_components")
        ],
        //文件夹别名
        alias: {
            js: path.join(__dirname, "src/js"),
            scss: path.join(__dirname, 'src/sass'),
            img: path.join(__dirname, 'src/img'),
        }
    },
    plugins: [
        //从bower.json main属性指定文件入口
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        //代码压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
}
```


  [1]: https://i.loli.net/2019/05/25/5ce8b83a0e9e545797.jpg
  [2]: https://webpack.github.io/
  [3]: https://nodejs.org
  [4]: http://webpack.github.io/docs/list-of-loaders.html
  [5]: http://es6.ruanyifeng.com/
  [6]: https://github.com/passy/autoprefixer-loader
  [7]: http://webpack.github.io/docs/hot-module-replacement-with-webpack.html
