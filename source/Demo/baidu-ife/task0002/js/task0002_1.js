"use strict";
function uniqArray(arr) {
	var result = new Array();
	for (var i in arr) {
		if (result.indexOf(arr[i]) == -1) {
			result.push(arr[i]);
		}
	}
    return result;
}
function getHobbits(id) {
	var symbols = [" ", ",", "、", ";", "，", "；"];
	var str = document.getElementById(id).value;
	var hobbits = new Array();
	for (var i in symbols) {
		if (str.indexOf(symbols[i]) != -1) {
			hobbits = str.split(symbols[i]);
			break;
		}
	}
	if (str != "" && hobbits.length == 0) {
		hobbits[0] = str;
	}
	return hobbits;
}
function p1() {
	var str = document.getElementById("hobbit").value;
	var hobbits = str.indexOf("，") > -1 ? str.split("，") : str.split(",");
	hobbits = uniqArray(hobbits);
	var copy = "";
	for (var index = 0; index < hobbits.length; index++) {
		if (hobbits[index] != "") {
			copy += hobbits[index];
		}

	}
	document.getElementById("output").innerHTML = copy;
}
function p2() {
	var hobbits = getHobbits("p2-hobbit");
	var copy = "";
	for (var index = 0; index < hobbits.length; index++) {
		if (hobbits[index] != "") {
			copy += hobbits[index];
		}

	}
	document.getElementById("p2-output").innerHTML = copy;
}
function p3() {
	var hobbits = getHobbits("p3-hobbit");
	var msg = document.getElementById("msg");
	var copy = '';
	if (hobbits.length > 10 || hobbits.length == 0) {
		msg.removeAttribute("hidden");
	}
	else {
		for (var i = 0; i < hobbits.length; i++) {
			copy += '<input type="checkbox" checked/><label>' + hobbits[i] + '</label>';
		}
		document.getElementById("p3-output").innerHTML = copy;
		if (msg.getAttribute("hidden") == null) {
			msg.setAttribute("hidden", "hidden");
		}
	}
}