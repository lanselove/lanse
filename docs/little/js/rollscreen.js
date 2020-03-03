/*
* 平滑滚动思路
首先要知道设置DOM中哪个属性才能改变页面的滚动位置，就是documentElement对象的"scrollTop"属性，通过它可以与滚动条相联系
然后就是如何以动画的方式滚动了，其实与轮播图原理一样，核心就是一个定时执行的函数，通过反复执行函数中规定的动作产生逐帧动画的效果
这个函数的逻辑可以想象成一个数学意义上的函数: 横座标是时间，纵座标是偏移量，斜率代表速度变化。速度变化又可以另建一个曲线分析，横座标是帧数，纵座标是偏移量的百分比。然后把两者结合，剩下的就是把属性往里面填了。
*/

// getElementsByClassName IE6、7不支持，IE6须用document.body滚动
var pieces = document.getElementsByClassName("piece");
var pagings = document.getElementsByClassName("paging");
var docu = document.documentElement;
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
                docu.scrollTop = swing(docu.scrollTop, target - docu.scrollTop, during, count);
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
    if (docu.scrollTop < pieces[0].offsetTop) {
        console.log("你在第0页");
    } else if ((docu.scrollTop >= pieces[0].offsetTop) && (docu.scrollTop < pieces[1].offsetTop)) {
        check(0);
    } else if ((docu.scrollTop >= pieces[1].offsetTop) && (docu.scrollTop < pieces[2].offsetTop)) {
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
            // document.documentElement.scrollTop = pieces[index].offsetTop;
            if (anchor.status()) {
                anchor.slide(pieces[index].offsetTop);
            }
        });
    })(i);
}
