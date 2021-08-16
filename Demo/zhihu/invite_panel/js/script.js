var list = document.getElementById("suggest-list");
var invitedUsers = new Array();
var users;
//获取JSON数据
function getJSON() {
  users = localStorage.getItem("invite_panel");
  if (users === null) {
    var text =
      {
        "comment": "http://zhuanlan.zhihu.com/zhihumkt/19716118",
        "invited": [
          {
            "name": "magasa",
            "slug": "magasa",
            "avatarUrl": "images/user_avatar_1.png",
            "bio": "电影杂志《虹膜》主编（支持iOS/Android平台）",
            "id": 1
          },
          {
            "name": "程毅南",
            "slug": "cheng-yi-nan",
            "avatarUrl": "images/user_avatar_2.png",
            "bio": "美国心理学和经济学本科毕业。强推《知识分子与社会》",
            "id": 2
          },
          {
            "name": "田吉顺",
            "slug": "tian-ji-shun",
            "avatarUrl": "images/user_avatar_3.png",
            "bio": "妇产科医生",
            "id": 3
          }
        ],
        "recommended": [
          {
            "name": "周源",
            "slug": "zhouyuan",
            "avatarUrl": "images/user_avatar_4.png",
            "bio": "知乎 001 号员工",
            "id": 4
          },
          {
            "name": "黄继新",
            "slug": "jixin",
            "avatarUrl": "images/user_avatar_5.png",
            "bio": "和知乎在一起",
            "id": 5
          },
          {
            "name": "李申申",
            "slug": "shen",
            "avatarUrl": "images/user_avatar_6.png",
            "bio": "知乎 002 号员工",
            "id": 6
          },
          {
            "name": "Raymond Wang",
            "slug": "raymond-wang",
            "avatarUrl": "images/user_avatar_7.png",
            "bio": "lawyer",
            "id": 7
          }
        ]
      };
    //使用localStorage存储数据
    localStorage.setItem("invite_panel", JSON.stringify(text));
  }
  users = JSON.parse(users);
}
//利用事件代理给按钮添加click事件
list.addEventListener("click", function (e) {
  var obj = e.target;
  var index;
  if (obj.tagName.toLowerCase() === "button") {
    if (obj.className === "btn-invite") {
      obj.innerHTML = "收回邀请";
      index=getIndexById(obj.getAttribute("index"));
      users.invited.push(users.recommended[index]);
      users.recommended.splice(index,1);
    }
    else {
      obj.className = obj.className.replace(" invited", "");
      obj.innerHTML = "邀请回答";
      obj.className=obj.className.replace(" invited","");
      index=getIndexById(obj.getAttribute("index"));
      users.recommended.push(users.invited[index]);
      users.invited.splice(index,1);
    }
    updateInvitedUser(users.invited);
    localStorage.setItem("invite_panel",JSON.stringify(users));
  }
});
//获取用户ID返回用户对象所在位置
function getIndexById(id) {
  for (var key in users) {
    if (key === "comment") {
      continue;
    }
    for (var i = 0, len = users[key].lenght; i < users[key].length; i++) {
      if (users[key][i].id == id) {
        return i;
      }
    }
  }
}
  //修改已邀请的用户
  function updateInvitedUser(invitedUsers) {
    var str = "";
    var arr = new Array();
    var invited = document.getElementById("invited-user");
    var btns = list.getElementsByTagName("button");
    //修改已邀请用户按钮样式
    for (var i = 0; i < btns.length; i++) {
      if(btns[i].className!=="btn-invite"){
        continue;
      }
      for (var j = 0; j < invitedUsers.length; j++) {
        if (invitedUsers[j].id == btns[i].getAttribute("index")) {
          btns[i].className += " invited";
          btns[i].innerHTML="收回邀请";
        }
      }
    }
    for (var i = 0; i < invitedUsers.length; i++) {
      if (invitedUsers[i] != undefined) {
        arr.push(invitedUsers[i]);
      }
    }
    var len = arr.length - 2 > 0 ? arr.length - 2 : 0;
    for (var i = len; i < arr.length; i++) {
      if (i > len) {
        str += "、";
      }
      str += "<a href=" + users.comment + ">" + arr[i].name + "</a>";

    }
    if (arr.length > 2) {
      invited.innerHTML = "您已邀请" + str + "等" + arr.length + "人";
    }
    else if (arr.length > 0) {
      invited.innerHTML = "您已邀请" + str;
    }
    else {
      invited.innerHTML = "";
    }

  }
  //页面初始化函数
  function init() {
    getJSON();
    //生成推荐人选页面元素
    var t = 0;
    for (var key in users) {
      if (key === "comment") {
        continue;
      }
      for (var i = 0, len = users[key].lenght; i < users[key].length; i++) {
        var li = document.createElement("li");
        var div = document.createElement("div");
        var img = document.createElement("img");
        var a = document.createElement("a");
        var p = document.createElement("p");
        var button = document.createElement("button");
        div.className = "person-info";
        img.className = "avatar";
        img.src = users[key][i].avatarUrl;
        a.className = "link-name";
        a.innerHTML = users[key][i].name;
        a.href = users.comment;
        p.className = "intro";
        p.innerHTML = users[key][i].bio;
        button.className = "btn-invite";
        button.innerHTML = "邀请回答";
        button.setAttribute("index", users[key][i].id);
        div.appendChild(img);
        div.appendChild(a);
        div.appendChild(p);
        div.appendChild(button);
        li.appendChild(div);
        list.appendChild(li);
        if (t > 0 && (t + 1) % 2 === 0) {
          li.className = "even-li";
          var line = document.createElement("div");
          line.className = "line";
          list.appendChild(line);
        }
        t++;
      }

    }
    //生成已邀请人信息
    updateInvitedUser(users.invited);

  }
  init();