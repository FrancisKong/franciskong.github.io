/**
 * 获取菜单数据
 * @return {Array} 返回菜单对象的数组
 */
function getMenu() {
	var menu = [
		{
			"id": 0,
			"name": "阳光易车手",
			"child": [0]
		},
		{
			"id": 1,
			"name": "车源信息",
			"child": [1, 2, 3]
		},
		{
			"id": 2,
			"name": "易手服务",
			"child": [4, 5]
		},
		{
			"id": 3,
			"name": "阳光课堂",
			"child": [6, 7]
		},
		{
			"id": 4,
			"name": "金融服务",
			"child": [8, 9]
		}
	];
	return menu;
}
/**
 * 获取子菜单数据
 *  @return {Array} 返回子菜单对象的数组
 */
function getSubMenu() {
	var subMenu = [
		{
			"id": 0,
			"pid": 0,
			"name": "阳光易车手",
			"link": "#"
		},
		{
			"id": 1,
			"pid": 1,
			"name": "车源信息1",
			"link": "#"
		},
		{
			"id": 2,
			"pid": 1,
			"name": "车源信息2",
			"link": "#"
		},
		{
			"id": 3,
			"pid": 1,
			"name": "车源信息3",
			"link": "#"
		},
		{
			"id": 4,
			"pid": 2,
			"name": "易手服务1",
			"link": "#"
		},
		{
			"id": 5,
			"pid": 2,
			"name": "易手服务2",
			"link": "#"
		},
		{
			"id": 6,
			"pid": 3,
			"name": "阳光课堂1",
			"link": "#"
		},
		{
			"id": 7,
			"pid": 3,
			"name": "阳光课堂2",
			"link": "#"
		},
		{
			"id": 8,
			"pid": 4,
			"name": "金融服务1",
			"link": "#"
		},
		{
			"id": 9,
			"pid": 4,
			"name": "金融服务2",
			"link": "#"
		},
	];
	return subMenu;
}

/**
 * 获取已展开的元素
 * @param {array} 元素数组
 * @return {Element} 已展开的元素
 */
function getExpandElement(elements) {
	for (var i = 0, len = elements.length; i < len; i++) {
		if (elements[i].getAttribute("is_expand") === "true") {
			return elements[i];
		}
	}
}
/**
 * 移除已展开的菜单
 
 */
function removeMenu() {
	var nav = document.getElementById("nav");
	var childs = nav.getElementsByClassName("nav-menu");
	var expElement = getExpandElement(childs);
	if (expElement) {
		expElement.removeChild(expElement.firstElementChild.nextElementSibling);
		expElement.getAttributeNode("is_expand").nodeValue = "false";
		expElement.firstElementChild.className = "icon-caret-down";
	}
}
/**
 * 移除已展开的子菜单
 */
function removeSubMenu() {
	var menuList = document.getElementsByClassName("menu");
	var expElement = getExpandElement(menuList);
	if (expElement) {
		while (expElement.firstElementChild) {
			expElement.removeChild(expElement.firstElementChild);
		}
		expElement.getAttributeNode("is_expand").nodeValue = "false";
	}
}
/**
 * 展开子菜单
 * @param {Node} 触发事件的节点
 */
function showSubMenu(o) {
	var icon = document.createElement("i");
	var ul = document.createElement("ul");
	var subMenu=getSubMenu();
	ul.className = "sub-menu-list";
    if (o.parentElement.parentElement.getAttribute("index") == 0) {
		icon.className = "icon-caret-right";
		ul.className += " sub-menu-list-right";
		o.appendChild(icon);
	}
	else {
		icon.className = "icon icon-caret-left";
		ul.className += " sub-menu-list-left";
		o.insertBefore(icon, o.firstChild);
	}
	for (var i = 0, len = subMenu.length; i < len; i++) {
		if (subMenu[i].pid == o.getAttribute("index")) {
			var a = document.createElement("a");
			var li = document.createElement("li");
			a.href = subMenu[i].link;
			a.innerHTML = subMenu[i].name;
			li.className = "sub-menu";
			li.appendChild(a);
			ul.appendChild(li);
		}
				}
				o.appendChild(ul);
				o.getAttributeNode("is_expand").nodeValue = "true";
}
/**
 * 展开菜单
 * @param {Node} 触发事件的节点
 */
function showMenu(o) {
	o.firstElementChild.className = "icon-caret-up";
	var ul = document.createElement("ul");
	var menu=getMenu();
	ul.className = "menu-list";
	for (var i = 0, len = menu.length; i < len; i++) {
		var li = document.createElement("li");
		li.innerHTML = menu[i].name;
		li.className = "menu";
		li.setAttribute("index", menu[i].id.toString());
		li.setAttribute("is_expand", "false");
		ul.appendChild(li);
	}
	o.appendChild(ul);
	o.getAttributeNode("is_expand").nodeValue = "true";
}
/**
 * 添加点击事件
 */
function init() {
	var nav = document.getElementById("nav");
	nav.addEventListener("touchstart", function (e) {
		var o = e.target;
		//给菜单按钮添加事件，展开子菜单
		if (o && o.getAttribute("is_expand") === "false") {
			if (o.className.toLowerCase() === "menu") {
				removeSubMenu();
				showSubMenu(o);
			}
			//给导航栏添加事件，展开菜单
			else if (o.className.toLowerCase() === "nav-menu") {
				removeMenu();
				showMenu(o);
			}
		}

		else if (o.className.toLowerCase() === "nav-menu") {
			removeMenu();
		}
		else if (o.className.toLowerCase() === "menu") {
			removeSubMenu();
		}
	});
}
init();