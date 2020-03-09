var anchorItem = document.getElementById("anchorLink").getElementsByTagName("li");
var btwpiece = document.getElementsByClassName("btwpiece");
var html = document.documentElement;
var body = document.body;
var pageNum = 0;
var checkIndex = function(num) {
    anchorItem[pageNum].removeAttribute("class");
    anchorItem[num].className = "indexbg";
    pageNum = num;
};
var anchor = (function() {
    var during = 400 * 60/1000;
    var interval = 1000/60;
    var timer = null;
    var isFinish = true;
    function swing(b, c, d, t) {
        return b + c * (0.5 - Math.cos(Math.PI * t/d) / 2);
    }
    return {
        slide: function(target) {
            var count = 1;
            var initial = html.scrollTop || body.scrollTop;
            var animate = function() {
                var current = swing(initial, target - initial, during, count);
                html.scrollTop = current;
                body.scrollTop = current;
                if (count < during) {
                    count++;
                    timer = setTimeout(animate, interval);
                } else {
                    isFinish = true;
                }
            };
            isFinish = false;
            timer = setTimeout(animate, interval);
        },
        status: function() {
            return isFinish;
        }
    }
})();

var nav = document.getElementById("nav");
var webfont = document.getElementById("webfont");
var yiru = function() {
    if ((html.scrollTop + body.scrollTop + html.clientHeight) > (webfont.offsetTop + 258)) {
        webfont.style.marginLeft = "0px";
        window.removeEventListener("scroll", yiru);
    }
};
window.addEventListener("scroll", yiru);
// window.onscroll不会覆盖addEventListener
window.onscroll = function () {
    var scrollbarPos = html.scrollTop || body.scrollTop;

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
        checkIndex(0);
    }
    else if ((scrollbarPos >= (btwpiece[1].offsetTop - 68)) && (scrollbarPos < (btwpiece[2].offsetTop - 68))) {
        checkIndex(1);
    }
    else if ((scrollbarPos >= (btwpiece[2].offsetTop - 68)) && (scrollbarPos < (btwpiece[3].offsetTop - 68))) {
        checkIndex(2);
    }
    else if ((scrollbarPos >= (btwpiece[3].offsetTop - 68)) && (scrollbarPos < (btwpiece[4].offsetTop - 68))) {
        checkIndex(3);
    }
    else if ((scrollbarPos >= (btwpiece[4].offsetTop - 68)) && (scrollbarPos < (btwpiece[5].offsetTop - 68))) {
        checkIndex(4);
    }
    else if ((scrollbarPos >= (btwpiece[5].offsetTop - 68)) && (scrollbarPos < (btwpiece[6].offsetTop - 68))) {
        checkIndex(5);
    }
    else {
        checkIndex(6);
    }
};

//锚链接
for (var i = 0; i < anchorItem.length; i++) {
    anchorItem[i].index = i;
    anchorItem[i].onclick = function () {
        if (anchor.status() && this.index != pageNum) {
            if (this.index == 0) {
                anchor.slide(0);
            } else {
                anchor.slide(btwpiece[this.index].offsetTop - 68);
            }
        }
    };
}


//轮播图
function fadeFrame(element) {
    var during = 1000 * 60/1000;
    var interval = 1000/60;
    var timer = null;
    function swing(b, c, d, t) {
        return b + c * (0.5 - Math.cos(Math.PI * t/d) / 2);
    }
    return function(target) {
        var count = 1;
        var initial = parseFloat(element.style.opacity);
        var animate = function() {
            var current = swing(initial, target-initial, during, count).toFixed(4);
            element.style.opacity = current.toString();
            if (count < during) {
                count++;
                timer = setTimeout(animate, interval);
            }
        };
        clearTimeout(timer);
        timer = setTimeout(animate, interval);
    };
}
var bannerItem = document.getElementById("banner").getElementsByTagName("li");
var btnItem = document.getElementById("btn").getElementsByTagName("li");
var lastIndex = 0;
var curIndex = 0;
var picFade = function() {
    bannerItem[lastIndex].style.opacity = "0";
    bannerItem[curIndex].style.opacity = "1";
    // bannerItem[lastIndex].fade(0);
    // bannerItem[curIndex].fade(1);
    btnItem[lastIndex].removeAttribute("class");
    btnItem[curIndex].className = "on";
};

for (var i = 0; i < btnItem.length; i++) {
    btnItem[i].index = i;
    // btnItem[i].onclick = function () {
    btnItem[i].onmouseenter = function () {
        if (this.index != curIndex) {
            lastIndex = curIndex;
            curIndex = this.index;
            picFade();
        }
    };
    // bannerItem[i].fade = fadeFrame(bannerItem[i]);
}

var runpic = document.getElementById("runpic");
var playTimer = null;
var switchIndex = function(end, start, dir) {
    lastIndex = curIndex;
    if (curIndex == end) {
        curIndex = start;
    }
    else {
        curIndex = curIndex + dir;
    }
    picFade();
};
var autoPlay = function() {
    playTimer = setInterval(function () {
        switchIndex(bannerItem.length-1, 0, 1);
    }, 4000);
};
runpic.onmouseenter = function () {
    clearInterval(playTimer);
};
runpic.onmouseleave = function () {
    autoPlay();
};
autoPlay();



/*
// class="weixin" id="weixin"
// class="wxpng" id="wxpng" style="opacity: 0;"
var weixin = document.getElementById("weixin");
var wxpng = document.getElementById("wxpng");
weixin.onmouseenter = function () {
    wxpng.style.opacity = "1";
};
weixin.onmouseleave = function () {
    wxpng.style.opacity = "0";
};
// 突然发现直接用id也能获取到dom元素，各大浏览器好早就支持这个操作了，但还不是标准规范
*/
