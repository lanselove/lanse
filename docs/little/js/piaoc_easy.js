function flutter(element, speed) {
    function shift(target) {
        var val = 0;
        var step = 1;
        var turn = true;
        return function() {
            val = val + step*(turn?1:-1);
            if(val < 0) {
                turn = true;
                val = 0;
            }
            if(val > target) {
                turn = false;
                val = target;
            }
            return val;
        };
    }
    var bdyu = (document.compatMode == "BackCompat") ? document.body : document.documentElement;
    var gen_x = shift(bdyu.clientWidth-element.offsetWidth);
    var gen_y = shift(bdyu.clientHeight-element.offsetHeight);
    var timer = null;
    var delay = speed || 28;
    var move = function() {
        element.style.left = gen_x() + "px";
        element.style.top = gen_y() + "px";
        timer = setTimeout(move, delay);
    };
    element.onmouseenter = function() {
        clearTimeout(timer);
    };
    element.onmouseleave = function() {
        timer = setTimeout(move, delay);
    };
    timer = setTimeout(move, delay);
}

var obju = document.getElementById("adu");
flutter(obju, 30);

var closebtn = obju.children[obju.children.length-1];
closebtn.onclick = function() {
    obju.parentNode.removeChild(obju);
};



/*
var obju=document.getElementById("adu");
var bdyu = document.documentElement;
var xu = 0; // 横向位移
var yu = 0; // 纵向位移
var xinu = true;    // 是否从左往右
var yinu = true;    // 是否从右往左
var stepu = 1;  // 单位位移
var timer = null;
// var delayu = 28;
var delayu = 36;

// document.compatMode表示当前文档的渲染模式
// 等于BackCompat（混杂模式）时，浏览器客户区宽度是document.body.clientWidth
// 等于CSS1Compat（标准模式）时，浏览器客户区宽度是document.documentElement.clientWidth
if (document.compatMode == "BackCompat") {
    bdyu = document.body;
}

function floatADu() {
    var Ru= bdyu.clientWidth-obju.offsetWidth;   // 可视窗口横向总距离（不包括纵向滚动条宽度）减去div的宽度
    var Bu = bdyu.clientHeight-obju.offsetHeight;    // 可视窗口纵向总距离（不包括横向滚动条高度）减去div的高度

    obju.style.left = xu + "px";
    obju.style.top = yu + "px";

    xu = xu + stepu*(xinu?1:-1);
    if(xu < 0) {
        xinu = true;
        xu = 0;
    }
    if(xu > Ru) {
        xinu = false;
        xu = Ru;
    }
    yu = yu + stepu*(yinu?1:-1);
    if(yu < 0) {
        yinu = true;
        yu = 0;
    }
    if(yu > Bu) {
        yinu = false;
        yu = Bu;
    }
}

function play() {
    timer = setInterval("floatADu()", delayu);
}

// window.navigator.userAgent.indexOf("MSIE") == -1可以检测到不是IE10及以下版本得其他浏览器
if ("addEventListener" in window) {
    window.addEventListener('load', play);
} else {
    window.attachEvent('onload', play);
}
obju.onmouseover = function() {
    clearInterval(timer);
};
obju.onmouseout = function() {
    play();
};
*/