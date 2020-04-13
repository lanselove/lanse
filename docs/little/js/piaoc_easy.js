/*
参数：
area: 活动区域对应的元素
element: 活动元素
speed: 移动1px的速率
*/
function flutter(area, element, speed) {
    // 坐标自增自减器
    function shift(target) {
        // var step = 1;  // 同时在两个方向移动1px，元素都会晃动很厉害
        var value = 0;
        return {
            turn: true,
            val: function() {
                value += (this.turn?1:-1);
                if(value == 0) this.turn = true;
                if(value == target) this.turn = false;
                return value;
            }
        };
    }
    var xVal = 0;
    var yVal = 0;
    // 活动范围 = 活动区域的可视空间 - 活动元素的占用空间
    var gen_x = shift(area.clientWidth-element.offsetWidth);
    var gen_y = shift(area.clientHeight-element.offsetHeight);
    var timer = null;
    var delay = speed || 28;
    var move_G = function() {
        xVal = gen_x.val();
        yVal = gen_y.val();
        element.style.left = xVal + "px";
        element.style.top = yVal + "px";
        timer = setTimeout(move_G, delay);
    };
    // var during = 4;  // 总时长12ms÷间隔3ms
    // 在1px内再慢放4拍从而减弱晃动感
    var move_K = function() {
        var count = 1;
        var slowmotion = function() {
            var x_changed = (count/4)*(gen_x.turn?1:-1);
            var y_changed = (count/4)*(gen_y.turn?1:-1);
            element.style.left = (xVal+x_changed) + "px";
            element.style.top = (yVal+y_changed) + "px";
            if (count < 4) {
                count++;
                setTimeout(slowmotion, 3);
            } else {
                xVal = gen_x.val();
                yVal = gen_y.val();
            }
        };
        setTimeout(slowmotion, 3);
        timer = setTimeout(move_K, delay);
    };
    // 速率(delay)超过12ms后选用慢速移动(move_K)，否则选用高速移动(move_G)
    var picked = (delay>12) ? move_K : move_G;
    element.onmouseenter = function() {
        clearTimeout(timer);
    };
    element.onmouseleave = function() {
        timer = setTimeout(picked, delay);
    };
    timer = setTimeout(picked, delay);
}

var bdyu = (document.compatMode == "BackCompat") ? document.body : document.documentElement;
var obju = document.getElementById("adu");
flutter(bdyu, obju, 22);

var closebtn = obju.children[obju.children.length-1];
closebtn.onclick = function() {
    obju.parentNode.removeChild(obju);
    obju = null;
};
// 只更改display会触发鼠标移出事件，所以删除DOM元素更有效而且彻底





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