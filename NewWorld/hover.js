var nav_a = document.getElementById("nav").getElementsByTagName("a");
var container = document.getElementById("container");
var finder = document.getElementById("finder");
var button = finder.getElementsByTagName("button");
var ul = finder.getElementsByTagName("ul");
var search = document.getElementById("search");
var isOut = true;
var isClick = false;

function showConn() {
	var temp_li = null;
	for (var i = 0; i < ul.length; i++) {
		temp_li = ul[i].getElementsByTagName("li");
		for(var t = 0;t < temp_li.length;t++) {
			temp_li[t].onmouseenter = function() {
				this.className = "li-hover";
			};
			temp_li[t].onmouseleave = function() {
				this.className = "";
			};
			/*
			(function(i) {
				temp_li[t].onclick = function() {
					button[i].innerHTML = this.innerHTML;
				}
			})(i);
			*/
			temp_li[t].onclick = function(index) {
				return function() {
					button[index].innerHTML = this.innerHTML;
				};
			}(i);
		}
	}
}

function closeTab() {
	for(var j = 0;j < ul.length;j++) {
		if(ul[j].style.display == "block") {
			ul[j].style.display = "none";
			break;
		}
	}
}

for (var j = 0; j < nav_a.length; j++) {
	nav_a[j].index = j;
	nav_a[j].onclick = function () {
		for (i = 0;i < nav_a.length;i++) {
			if (nav_a[i].className == "nav-click") {
				nav_a[i].removeAttribute("class");
				break;
			}
		}
		nav_a[this.index].className = "nav-click";
	};
}

showConn();

for(var i = 0;i < button.length-1;i++) {
	button[i].index = i;
	button[i].onclick = function() {
		closeTab();
		ul[this.index].style.display = "block";
		isOut = false;
		isClick = true;
	};
}

container.onclick = function() {
	if(isOut && isClick) {
		closeTab();
		isClick = false;
	}
	isOut = true;
};

search.onmouseenter = function() {
	this.className = "search sub-hover";
};
search.onmouseleave = function() {
	this.className = "search";
};