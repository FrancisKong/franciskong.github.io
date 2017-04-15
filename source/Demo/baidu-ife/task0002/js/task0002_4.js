"use strict";
var suggestData = ['Allen', 'Bob', 'Cat', 'Davis', 'Erick', 'Frank', 'Grace', 'Test1', 'Test2', 'Test', 'Hello', 'World'];
var suggest = document.getElementById("suggest");
var suggestBox = document.getElementById("suggest-box");
function showhint() {
	clear();
	var t = false;
	var str = suggestBox.value;
	var ul = document.createElement("ul");
	ul.setAttribute("id", "suggest-ul");
	if (str == null || str.length == 0) {
		return;
	}
	else {
		str = str.toLowerCase();
		for (var i = 0; i < suggestData.length; i++) {
			for (var j = 0; j < str.length; j++) {
				if (suggestData[i].toLocaleLowerCase().charAt(j) != str.charAt(j)) {
					break;
				}
				else if (j == str.length - 1) {
					var li = document.createElement("li");
					li.innerHTML = suggestData[i];
					ul.appendChild(li);
					t = true;
				}
			}
		}
	}
	if (t) {
		suggest.appendChild(ul);
		suggest.style.display = "block";
	}
}
function clear() {
	suggest.style.display = "none";
	var ul = document.getElementById("suggest-ul");
	if (ul) {
		suggest.removeChild(ul);
	}
}
function init() {
	suggest.addEventListener("mouseover", function (e) {
		if (e.target && e.target.tagName == "LI") {
			e.target.className = "choose";
		}
	});
	suggest.addEventListener("mouseout", function (e) {
		if (e.target && e.target.tagName == "LI") {
			e.target.className = "";
		}
	});
	suggest.addEventListener("click", function (e) {
		if (e.target && e.target.tagName == "LI") {
			var item = document.getElementsByClassName("choose");
			suggestBox.value = item[0].innerHTML;
			clear();
		}
	});
	suggestBox.addEventListener("keydown", function (e) {
		var keynum = e.keyCode;
		var item = document.getElementsByTagName("li");
		var index = 0;
		var len = item.length;
		for (var i = 0; i < len; i++) {
			if (item[i].className == "choose") {
				index = i;
				break;
			}
		}
		switch (keynum) {
			case 38:
				item[index].className = "";
				index--;
				if (index < 0) {
					index = len - 1;
				}
				item[index].className = "choose";
				break;
			case 40:
				item[index].className = "";
				index++;
				if (index >= len) {
					index = 0;
				}
				item[index].className = "choose";
				break;
			case 13:
				suggestBox.value = item[index].innerHTML;
				clear();
				break;
		}

	});
}
init();