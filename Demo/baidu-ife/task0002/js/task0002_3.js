
var max = 3;
var isClick = false;
var t;
var slide = document.getElementById("slide-img");
function animate(offest) {
	var btns = document.getElementsByTagName("li");
	for (var i = 0; i < btns.length; i++) {
		btns[i].className = "";
	}
	btns[Math.abs(offest / 600)].className = "on";
	var time = 300;
	var interval = 10;
	var speed = offest / (time / interval);
	function go() {
		if ((speed < 0 && parseInt(slide.style.left) > offest) || (speed > 0 && parseInt(slide.style.left) < offest)) {
			slide.style.left = parseInt(slide.style.left) + speed + "px";
			setTimeout(go, interval);
		}
		else {
			slide.style.left = offest + "px";
		}
	}
	go();
}
function init() {
	var len = slide.getElementsByTagName("img").length;
	var str = "";
	for (var i = 0; i < len; i++) {
		str += "<li index=" + i + "></li>";
	}
	var btn = document.getElementById("slide-btn");
	btn.innerHTML = str;
	play(0);
	btn.addEventListener("click", function (e) {
		if (e.target && e.target.tagName == "LI") {
			var index = parseInt(e.target.getAttribute("index"));
			isClick = true;
			play(index);
		}
	});
}
function play(index) {
	if (index >= max) {
		index = 0;
	}
	if (isClick) {
		clearTimeout(t);
		isClick = false;
	}
	animate(index * -600);
	index += 1;
	t = setTimeout("play(" + index + ")", 5000);
}
init();

