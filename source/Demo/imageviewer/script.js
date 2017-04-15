var img=document.getElementById("image");
var container=document.getElementById("container");
var magnifier=document.getElementById("magnifier");
var minifier=document.getElementById("minifier");
var distX=0;
var distY=0;
// 判断元素是否处于拖动状态
var isDraging=false;
// 放大图片
function bigger () {		
	img.width*=1.2;
	img.height*=1.2;
}
// 缩小图片
function smaller () {		
	img.width/=1.2;
	img.height/=1.2;
}
function init () {
	//开始拖动方法
	container.onmousedown=function (e) {
		// 计算鼠标和元素左边的距离		
		distX=e.clientX-container.offsetLeft;
		// 计算鼠标和元素顶部的距离		
		distY=e.clientY-container.offsetTop;		
		container.style.cursor="move";
		magnifier.style.opacity="0.2";
		minifier.style.opacity="0.2";
		isDraging=true;
	};
	//正在拖动方法
	container.onmousemove=function(e){		
		if(isDraging){
			//设置拖动时的容器位置
			container.style.left=e.clientX-distX+"px";
			container.style.top=e.clientY-distY+"px";
		}
	};
	//拖动结束方法
	container.onmouseup=function (e) {
		container.style.cursor="default";
		magnifier.style.opacity="1";
		minifier.style.opacity="1";
		isDraging=false;
	};
}
init();