/*
* 专为无聊人士快速切换而生
就两个点：1、可以快速切换，2、停靠点淡入的元素不被前面元素遮盖
1、点击新按钮时直接开始新一段动画，不等待前一段结束并且不清除前一段，由每个元素自己结束自身的动画
2、最好的办法是通过更改z-index值使停靠点元素位置靠前，但突然更改z-index值元素会闪现，所以只能想办法削弱反向快速切换的缓慢感，那就是快速切换的情况下，元素的淡出需等待自身透明度达到某个值才能执行，这样处于过渡位置的元素透明度既不会低到背景泛白，又不会遮住停靠点元素。
*/
// 原理就是延迟淡出的执行时间，通过外部更改期限值强制定时器结束，然后在next函数中执行需要的下一步动作
// 之前的想法是，在淡入过程中总是检测是否能够淡出，淡出的执行则决定于淡入给的标志，但这样淡入淡出得分开写，而且不好添加结束时动作
// (function() {})();
function BeeFade(opt) {
    this.element = opt.element;
    this.index = opt.index;
    this.DELAY = 1000/60;
    this.DURING = this.setting[(opt.speed)?opt.speed:"normal"] * 60/1000;
    this.BREAK = Math.round(this.DURING * 30/100);
    this.duration = this.DURING;
    this.timer = null;
    this.waitOut = false;
    this.pending = false;
    this.final = opt.final;
}
BeeFade.prototype = {
    setting: { "slow": 1000, "normal": 800, "fast": 600 },
    swing: function(b, c, d, t) {
        return b + c * Math.sin((Math.PI/2) * t/d);  // Sine.easeOut
    },
    fadeTo: function(target) {
        var that = this;
        var initial = (window.mise) ? parseFloat(this.element.style.filter.match(/opacity=([\d.]+)/)[1])/100 : parseFloat(this.element.style.opacity);
        var changed = target-initial;
        var count = 1;
        var animate = function() {
            var current = that.swing(initial, changed, that.DURING, count);
            // console.log("第"+that.index+"张", current, count);
            if (window.mise) {
                that.element.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + current*100 + ")";
            } else {
                that.element.style.opacity = current.toString();
            }
            if (count < that.duration) {
                count++;
                that.timer = setTimeout(animate, that.DELAY);
            } else {
                that.next();
            }
        };
        this.timer = setTimeout(animate, this.DELAY);
    },
    fadeIn: function() {
        clearTimeout(this.timer);
        this.waitOut = false;
        this.pending = true;
        this.duration = this.DURING;
        this.fadeTo(1);
    },
    fadeOut: function() {
        if (this.pending) {
            this.waitOut = true;
            this.duration = this.BREAK;
        } else {
            this.pending = true;
            this.fadeTo(0);
        }
    },
    next: function() {
        if (this.waitOut) {
            this.waitOut = false;
            this.duration = this.DURING;
            this.fadeTo(0);
        } else {
            this.pending = false;
            if (this.final) {
                this.final(this);
            }
        }
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner");
var pics = document.getElementById("pics").getElementsByTagName("li");
var btns = document.getElementById("btns").getElementsByTagName("i");
var lastIndex = 0;
var curIndex = 0;
var playTimer = null;
var isAutoPlay = true;
var beeSet = [];
var picFade = function() {
    btns[lastIndex].className = "";
    btns[curIndex].className = "active";
    beeSet[lastIndex].fadeOut();
    beeSet[curIndex].fadeIn();
    // setTimeout(function() {
    //     console.log(beeSet[lastIndex].element.style.cssText);
    // }, 30);
};
var autoPlay = function() {
    playTimer = setTimeout(function() {
        lastIndex = curIndex++;
        if(lastIndex == btns.length-1) {
            curIndex = 0;
        }
        picFade();
    }, 3000);
};

for (var i = 0; i < pics.length; i++) {
    beeSet[i] = new BeeFade({
        element: pics[i],
        index: i,
        speed: "slow",
        final: function(bee) {
            if (isAutoPlay && bee.index == lastIndex) autoPlay();
        }
    });
    (function(index) {
        btns[index].onmouseenter = function() {
            if (index != curIndex) {
                lastIndex = curIndex;
                curIndex = index;
                picFade();
            }
        };
    })(i);
}

banner.onmouseenter = function() {
    isAutoPlay = false;
    clearTimeout(playTimer);
};
banner.onmouseleave = function() {
    isAutoPlay = true;
    if (beeSet[lastIndex].done()) autoPlay();
};
autoPlay();

var prev = document.getElementById("prev");
var next = document.getElementById("next");
prev.onmouseenter = function() {
    prev.style.backgroundPosition = "-55px -5px";
};
prev.onmouseleave = function() {
    prev.style.backgroundPosition = "-5px -5px";
};
next.onmouseenter = function() {
    next.style.backgroundPosition = "-55px -105px";
};
next.onmouseleave = function() {
    next.style.backgroundPosition = "-5px -105px";
};
prev.onclick = function() {
    lastIndex = curIndex--;
    if(lastIndex == 0) {
        curIndex = btns.length-1;
    }
    picFade();
};
next.onclick = function() {
    lastIndex = curIndex++;
    if(lastIndex == btns.length-1) {
        curIndex = 0;
    }
    picFade();
};


/*
js字符串转译函数？
var ko = {
    fadeTo: function(bo) {console.log(bo + "波")},
    lol: function() {this.fadeTo(3)},
    next: function() {
        var exec = new Function("this.fadeTo(3);console.log(this)");
        exec.call(this);
        // 需注意函数内部的作用域
    }
};
js对象创建私有属性？
JavaScript基础对象创建模式之私有属性和方法
https://www.cnblogs.com/Bryran/p/3976143.html

js 可选参数？
关于JS的可选参数，该知道的都在这里了
https://www.jianshu.com/p/55fc2be7e0f0

原生js轮播图了解一下？【思路示范】
https://www.w3xue.com/exp/article/201810/3732.html
*/



/*
// 元素执行完淡入再执行淡出【jQuery动画属于这种情况】
// 由于定位的影响，顺序靠后的元素即使透明度低于前面的元素依然靠前显示，导致反向快速切换图片时淡出的元素会遮住淡入的元素。提高活动元素的z-Index虽然可以消除这个影响，但突然更改z-Index时元素会闪现。
    var lastIndex = 0;
    var curIndex = 0;
    var interval = 1000/60;
    var duration = 600/interval;
    var playTimer = null;
    var isAutoPlay = true;

    function fadeOut(index) {
        pics[index].iswaitOut = true;
        // 只有淡入完成时才可以淡出
        if (pics[index].mayOut) {
            var count = 1;
            var beginFace = parseFloat(pics[index].style.opacity);
            var draw = function() {
                var curFace = beginFace + (0-beginFace) * (0.5 - Math.cos(Math.PI * count/duration) / 2);
                // if (index == 3) console.log(curFace);
                pics[index].style.opacity = curFace.toFixed(4).toString();
                if (count < duration) {
                    count++;
                    pics[index].timer = setTimeout(draw, interval);
                } else {
                    pics[index].iswaitOut = false;
                    // 如果需要自动播放，在这里去调用自动播放函数
                    if (isAutoPlay && (index == lastIndex)) {
                        autoPlay();
                    }
                }
            };

            clearTimeout(pics[index].timer);
            pics[index].timer = setTimeout(draw, interval);
        }
    }

    function fadeIn(index) {
        var count = 1;
        var beginFace = parseFloat(pics[index].style.opacity);
        var draw = function() {
            var curFace = beginFace + (1-beginFace) * (0.5 - Math.cos(Math.PI * count/duration) / 2);
            // if (index == 3) console.log(curFace);
            pics[index].style.opacity = curFace.toFixed(4).toString();
            if (count < duration) {
                count++;
                pics[index].timer = setTimeout(draw, interval);
            }
            if (curFace > 0.2) {
                pics[index].mayOut = true;
                //如果需要淡出，在这里去调用淡出函数
                if (pics[index].iswaitOut) {
                    fadeOut(index);
                }
            }
        };

        // 无论之前是淡入还是淡出，都直接推掉，开始淡入
        clearTimeout(pics[index].timer);
        // 如果之前在淡出，强行设置淡出为完成状态
        pics[index].iswaitOut = false;
        pics[index].mayOut = false;
        pics[index].timer = setTimeout(draw, interval);
    }

    banner.onmouseleave = function() {
        isAutoPlay = true;
        // 只有先前索引位置淡出完成才可以自动播放
        if (!pics[lastIndex].iswaitOut) {
            autoPlay();
        }
    };
*/



/*
// 每个元素自身的淡入淡出接力交替。只是用户快速切换时中间元素透明度太低导致中途背景泛白【css3动画属于这种情况】
    function fadeOut(index) {
        var count = 1;
        var beginFace = parseFloat(pics[index].style.opacity);
        var draw = function() {
            var curFace = beginFace + (0-beginFace) * (0.5 - Math.cos(Math.PI * count/duration) / 2);
            pics[index].style.opacity = curFace.toFixed(4).toString();
            if (count < duration) {
                count++;
                pics[index].timer = setTimeout(draw, interval);
            } else {
                pics[index].iswaitOut = false;
                // 如果需要自动播放，在这里去调用自动播放函数
                if (isAutoPlay && (index == lastIndex)) {
                    autoPlay();
                }
            }
        };
        // 无论之前是淡入还是淡出，都直接推掉，开始淡入
        clearTimeout(pics[index].timer);
        // 不管淡入与否，强行设置淡入为完成状态
        pics[index].isNeedIn = false;
        pics[index].iswaitOut = true;
        pics[index].timer = setTimeout(draw, interval);
    }

    function fadeIn(index) {
        var count = 1;
        var beginFace = parseFloat(pics[index].style.opacity);
        var draw = function() {
            var curFace = beginFace + (1-beginFace) * (0.5 - Math.cos(Math.PI * count/duration) / 2);
            pics[index].style.opacity = curFace.toFixed(4).toString();
            if (count < duration) {
                count++;
                pics[index].timer = setTimeout(draw, interval);
            } else {
                pics[index].isNeedIn = false;
            }
        };
        // 无论之前是淡入还是淡出，都直接推掉，开始淡入
        clearTimeout(pics[index].timer);
        // 不管淡出与否，强行设置淡出为完成状态
        pics[index].iswaitOut = false;
        pics[index].isNeedIn = true;
        pics[index].timer = setTimeout(draw, interval);
    }
*/

