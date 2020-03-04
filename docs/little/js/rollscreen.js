var browser = document.querySelector(".browser");

function getBroswer(){
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    browser.innerHTML = "浏览器标识: " + ua + ",&emsp;渲染模式: " + document.compatMode + '<br>';
    var s;
    (s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1] :
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.edge) return { broswer : "Edge", version : Sys.edge };
    if (Sys.ie) return { broswer : "IE", version : Sys.ie };
    if (Sys.firefox) return { broswer : "Firefox", version : Sys.firefox };
    if (Sys.chrome) return { broswer : "Chrome", version : Sys.chrome };
    if (Sys.opera) return { broswer : "Opera", version : Sys.opera };
    if (Sys.safari) return { broswer : "Safari", version : Sys.safari };

    return { broswer : "", version : "0" };
}

var abc = getBroswer();
// alert("broswer: " + abc.broswer + " version: " + abc.version);
var fragment = document.createDocumentFragment();
var uEle = document.createElement('span');
uEle.innerHTML = "browser: " + abc.broswer + ",&emsp;version: " + abc.version;
uEle.className = "info";
fragment.appendChild(uEle);
browser.appendChild(uEle);



/*
* 平滑滚动思路
首先要知道设置DOM中哪个属性才能改变页面的滚动位置，就是documentElement对象的"scrollTop"属性，通过它可以与滚动条相联系
然后就是如何以动画的方式滚动了，其实与轮播图原理一样，核心就是一个定时执行的函数，通过反复执行函数中规定的动作产生逐帧动画的效果
这个函数的逻辑可以想象成一个数学意义上的函数: 横座标是时间，纵座标是偏移量，斜率代表速度变化。速度变化又可以另建一个曲线分析，横座标是帧数，纵座标是偏移量的百分比。然后把两者结合，剩下的就是把属性往里面填了。
*/

// getElementsByClassName IE6、7不支持，IE6须用document.body滚动
var pieces = document.getElementsByClassName("piece");
var pagings = document.getElementsByClassName("paging");
var html = document.documentElement;
var body = document.body;
var pageNum = 0;
var check = function(num) {
    if (pageNum != num) {
        pagings[pageNum].className = "paging";
        pagings[num].className = "paging focus";
        pageNum = num;
    }
};
var anchor = (function() {
    var during = 400 * 30/1000;
    var interval = 1000/30;
    var timer = null;
    var isFinish = true;
    var swing = function(b, c, d, t) {
        return b + c * (0.5 - Math.cos(Math.PI * t/d) / 2);
    };
    return {
        slide: function(target) {
            var count = 0;
            var animate = function() {
                html.scrollTop = swing(html.scrollTop, target - html.scrollTop, during, count);
                body.scrollTop = swing(body.scrollTop, target - body.scrollTop, during, count);
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

window.onscroll = function() {
    var _scrollTop = html.scrollTop || body.scrollTop;
    if (_scrollTop < pieces[0].offsetTop) {
        console.log("你在第0页");
    } else if ((_scrollTop >= pieces[0].offsetTop) && (_scrollTop < pieces[1].offsetTop)) {
        check(0);
    } else if ((_scrollTop >= pieces[1].offsetTop) && (_scrollTop < pieces[2].offsetTop)) {
        check(1);
    } else {
        check(2);
    }
};

for (var i = 0; i < pieces.length; i++) {
    (function(index) {
        pieces[index].addEventListener("click", function() {
            console.log(this.offsetTop, index+1);
        });
        pagings[index].addEventListener("click", function() {
            if (anchor.status() && pageNum != index) {
                anchor.slide(pieces[index].offsetTop);
            }
        });
    })(i);
}
