var runpic = document.getElementById("runpic");
var banner = document.getElementById("banner");
var bannerItem = banner.getElementsByTagName("li");
var btn = document.getElementById("btn");
var btnItem = btn.getElementsByTagName("li");
var banLastIndex = 0;
var banCurIndex = 0;
var playTimer = null;
var nav = document.getElementById("nav");
var webfont = document.getElementById("webfont");
var weixin = document.getElementById("weixin");
var wxpng = document.getElementById("wxpng");
var anchorLink = document.getElementById("anchorLink");
var anchorItem = anchorLink.getElementsByTagName("li");
var btwpiece = document.getElementsByClassName("btwpiece");
var anLastIndex = 0;
var anCurIndex = 0;
var anInterval = 1000/60;
var anTotalTime = 400/anInterval;

//淡入淡出，使用的是CSS3的过渡效果
function picFade() {
    bannerItem[banLastIndex].style.zIndex = "1";
    bannerItem[banCurIndex].style.zIndex = "2";
    bannerItem[banLastIndex].style.opacity = "0";
    bannerItem[banCurIndex].style.opacity = "1";
    btnItem[banLastIndex].removeAttribute("class");
    btnItem[banCurIndex].className = "on";
}

//自动播放或左右按钮切换时传递轮播图的方向
function banPassDir(num1, num2, dir) {
    banLastIndex = banCurIndex;
    if (banCurIndex == num1) {
        banCurIndex = num2;
    }
    else {
        banCurIndex = banCurIndex + dir;
    }
    // picFade();
}

//轮播图自动播放
function autoPlay() {
    playTimer = setInterval(function () {
        banPassDir(bannerItem.length-1, 0, 1);
    }, 4000);
}

//滚动条滑入当前页时给代表当前页的按钮添加背景色
function chIndexbg(num) {
    if (anCurIndex != num) {
        anLastIndex = anCurIndex;
        anCurIndex = num;
        anchorItem[anLastIndex].removeAttribute("class");
        anchorItem[anCurIndex].className = "indexbg";
    }
}

function swing(b, c, d, t) {
    return b + c * (0.5 - Math.cos(Math.PI * t/d) / 2);
}

//平滑滚动动画
function anchorAnimate(targetPos) {
    var start = 1;
    var anTimer = null;
    var initPos = document.documentElement.scrollTop;
    var changePos = targetPos - document.documentElement.scrollTop;

    function go() {
            document.documentElement.scrollTop = swing(initPos, changePos, anTotalTime, start);
            if (start < anTotalTime) {
                start++;
                anTimer = setTimeout(go, anInterval);
            }
    }

    anTimer = setTimeout(go, anInterval);
}

//轮播图
autoPlay();
runpic.onmouseenter = function () {
    clearInterval(playTimer);
}
runpic.onmouseleave = function () {
    autoPlay();
}

for (var i = 0; i < btnItem.length; i++) {
    btnItem[i].index = i;
    btnItem[i].onclick = function () {
        if (this.index != banCurIndex) {
            banLastIndex = banCurIndex;
            banCurIndex = this.index;
            // picFade();
        }
    }
}

//微信二维码
weixin.onmouseenter = function () {
    wxpng.style.opacity = "1";
}
weixin.onmouseleave = function () {
    wxpng.style.opacity = "0";
}

//锚链接
for (var i = 0; i < anchorItem.length; i++) {
    anchorItem[i].index = i;
    anchorItem[i].onclick = function () {
        if (this.index == 0) {
            if (document.documentElement.scrollTop != 0) {
                anchorAnimate(0);
            }
        }
        else {
            if (document.documentElement.scrollTop != (btwpiece[this.index].offsetTop - 68)) {
                anchorAnimate(btwpiece[this.index].offsetTop - 68);
            }
        }
    }
}

//滚动条事件
window.onscroll = function () {
    var scrollbarPos = document.documentElement.scrollTop || document.body.scrollTop;

    if (webfont.style.marginLeft != "0px") {
        if ((scrollbarPos + document.documentElement.clientHeight) > (webfont.offsetTop + 258)) {
            webfont.style.marginLeft = "0px";
        }
    }

    if (scrollbarPos >= 724) {
        if (nav.className == "nav") {
            nav.className = "nav navFixed";
        }
    }
    else {
        if (nav.className != "nav") {
            nav.className = "nav";
        }
    }

    if (scrollbarPos < (btwpiece[1].offsetTop - 68)) {
        chIndexbg(0);
    }
    else if ((scrollbarPos >= (btwpiece[1].offsetTop - 68)) && (scrollbarPos < (btwpiece[2].offsetTop - 68))) {
        chIndexbg(1);
    }
    else if ((scrollbarPos >= (btwpiece[2].offsetTop - 68)) && (scrollbarPos < (btwpiece[3].offsetTop - 68))) {
        chIndexbg(2);
    }
    else if ((scrollbarPos >= (btwpiece[3].offsetTop - 68)) && (scrollbarPos < (btwpiece[4].offsetTop - 68))) {
        chIndexbg(3);
    }
    else if ((scrollbarPos >= (btwpiece[4].offsetTop - 68)) && (scrollbarPos < (btwpiece[5].offsetTop - 68))) {
        chIndexbg(4);
    }
    else if ((scrollbarPos >= (btwpiece[5].offsetTop - 68)) && (scrollbarPos < (btwpiece[6].offsetTop - 68))) {
        chIndexbg(5);
    }
    else {
        chIndexbg(6);
    }
}