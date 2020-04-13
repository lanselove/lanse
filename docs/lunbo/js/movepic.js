(function() {
function Gallery(opt) {
    this.element = opt.element;
    this.shows = opt.shows;
    this.speed = this.setting[(opt.speed) ? opt.speed : "normal"];
    this.init();
}
Gallery.prototype = {
    setting: {"slow": 1300, "normal": 1100, "fast": 900},
    init: function() {
        var fragment = document.createDocumentFragment();
        var childs = this.element.children;
        var unitWid = childs[0].clientWidth;
        this.length = childs.length;
        for (var i = 0; i < this.length; i++) {
            fragment.appendChild(childs[i].cloneNode(true));
        }
        this.unitPix = unitWid*(-1);
        this.element.style.width = unitWid*this.length*2 + "px";
        this.element.appendChild(fragment);
        this.interval = 10;
        this.during = this.speed/this.interval;
        this.current = 0;
        this.keeping = true;
        this.pending = false;
        console.log(this);
    },
    move: function(changed) {
        var that = this;
        var timer = null;
        var count = 1;
        var animate = function() {
            var current = that.current + changed*(count/that.during);
            that.element.style.left = current.toFixed(3) + "px";
            if (count < that.during) {
                count++;
                timer = setTimeout(animate, that.interval);
            } else {
                that.current = current;
                that.reseat();
                that.next();
            }
        };
        this.pending = true;
        timer = setTimeout(animate, this.interval);
    },
    reseat: function() {
        var total = this.unitPix*this.length;
        if (this.current <= total) {
            this.current -= total;
            this.element.style.left = this.current + "px";
        }
    },
    movingAll: function() {
        this.move(this.unitPix*this.shows);
        /*
        -1100+(-440): -440px
        */
    },
    movingAllRev: function() {
        if (this.current > this.unitPix*this.shows) {
            this.current += this.unitPix*this.length;
            this.element.style.left = this.current + "px";
        }
        this.move(this.unitPix*(-1)*this.shows);
        /*
        -660px: 前面刚好有三张不用动
        -440px: -1100+(-440)
        */
    },
    movingOne: function() {
        this.move(this.unitPix);
    },
    movingOneRev: function() {
        if (this.current == 0) {
            this.current = this.unitPix*this.length;
            this.element.style.left = this.current + "px";
        }
        this.move(this.unitPix*(-1));
    },
    suspend: function() {
        this.keeping = false;
    },
    proceed: function() {
        this.keeping = true;
        if (this.done()) this.movingOne();
    },
    next: function() {
        if (this.keeping) {
            this.movingOne();
        } else {
            this.pending = false;
        }
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner1");
var pics = document.getElementById("pics1");
var prev = document.getElementById("prev1");
var next = document.getElementById("next1");
var gall = new Gallery({
    element: pics,
    shows: (window.screen.width > 767) ? 3 : 2,
    speed: "slow"
});

banner.onmouseenter = function() {
    gall.suspend();
};
banner.onmouseleave = function() {
    gall.proceed();
};

prev.onclick = function() {
    if (gall.done()) gall.movingAllRev();
};
next.onclick = function() {
    if (gall.done()) gall.movingAll();
};

gall.movingOne();

/*
一开始我是想每次移动完总长度的，但发现这样做的话，每次暂停后都要重新计算下一次距离呢，速率也不能按整段的给，所以得每次单独以一张图片的距离进行一次完整的移动，结束后立马自动开启下一次，逐个衔接起来达到循环播放的效果，暂停时就停止自动开启下一个，而且不影响当前这次移动走完，这样暂停时还可以保证视野中展示的图片都是完整的。
*/
})();



(function() {
// 长廊轮播选中放大
function GallerySelect(opt) {
    this.element = opt.element;
    this.speed = opt.speed || 600;
    this.unitPix = opt.unitPix;
    this.final = opt.final;
    this.init();
}
GallerySelect.prototype = {
    init: function() {
        this.interval = 10;
        this.duration = this.speed/this.interval;
        // this.current = parseFloat(pics.style.left);
        this.pending = false;
        console.log(this);
    },
    move: function(changed) {
        var that = this;
        var timer = null;
        var initial = parseFloat(pics.style.left);
        var count = 1;
        var during = Math.round(Math.abs(changed/this.unitPix)*this.duration);
        console.log(initial, changed, during);
        var animate = function() {
            var current = initial + changed*(count/during);
            that.element.style.left = current.toFixed(3) + "px";
            if (count < during) {
                count++;
                timer = setTimeout(animate, that.interval);
            } else {
                // that.current = current;
                that.next();
            }
        };
        this.pending = true;
        timer = setTimeout(animate, this.interval);
    },
    showprev: function() {
        this.move(this.unitPix*(-1));
    },
    shownext: function() {
        this.move(this.unitPix);
    },
    next: function() {
        this.pending = false;
        if (this.final) this.final();
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner2");
var pics = document.getElementById("pics2");
var prev = document.getElementById("prev2");
var next = document.getElementById("next2");
var lastIndex = 0;
var curIndex = 1;
var items = pics.children;
var isMobile = (window.screen.width < 767);
console.log(banner.clientWidth);
var areaWid = banner.clientWidth;
var curLeft = (isMobile) ? (areaWid-220)/2-180 : (areaWid-252)/2-220;
var unitOffset = (isMobile) ? -180 : -220;
pics.style.left = curLeft + "px";
pics.style.display = "block";
/*var unitOffset = items[0].clientWidth*(-1);
var curLeft;
if (window.screen.width < 767) {
    pics.style.left = (banner.clientWidth-items[1].clientWidth)/2 - items[0].clientWidth + "px";
}
curLeft = parseFloat(pics.style.left);*/
// 元素display为none时无法获取到clientWidth之类的值
// 通过框架模块化添加DOM树就不用考虑clientWidth失效，自适应时首次渲染的left值跳动的问题了，完全可以先根据屏幕尺寸设定好值再添加到HTML中。
var notFinished = false;
var setFinished = function() {
    notFinished = false;
};
var stagePic = function() {
    items[lastIndex].className = "";
    items[curIndex].className = "active";
    setTimeout(setFinished, 200);
};

var gall = new GallerySelect({
    element: pics,
    speed: 400,
    unitPix: unitOffset,
    final: stagePic
});
items[0].onclick = function() {
    console.log("巴拉");
    this.style.transform = "perspective(800px) translateZ(42px)";
};

prev.onclick = function() {
    if (notFinished || curIndex == 0) return;
    lastIndex = curIndex--;
    notFinished = true;
    gall.showprev();
    curLeft -= unitOffset;
};
next.onclick = function() {
    if (notFinished || curIndex == items.length-1) return;
    lastIndex = curIndex++;
    notFinished = true;
    gall.shownext();
    curLeft += unitOffset;
};

banner.onmouseenter = function() {
    this.className = "banner2 hover";
};
banner.onmouseleave = function() {
    this.className = "banner2";
};
var start, index, paces, isValid;
banner.addEventListener("touchstart", function() {
    var touch = event.touches[0];
    console.log(touch);
    start = touch.pageX;
    isValid = false;
});
banner.addEventListener("touchmove", function() {
    if (notFinished) return;  // 如果正在动画则先缓一会再一起算
    var touch = event.touches[0];
    var endX = Math.round(touch.pageX-start);
    index = curIndex + Math.round(endX/unitOffset);
    if (index < 0) {
        index = 0;
        return;
    }
    if (index > items.length-1) {
        index = items.length-1;
        return;
    }
    paces = endX;
    pics.style.left = (curLeft+paces) + "px";
    isValid = true;
});
banner.addEventListener("touchend", function() {
    if (!isValid) return;
    lastIndex = curIndex;
    curIndex = index;
    console.log(lastIndex, curIndex, paces);
    gall.move((curIndex-lastIndex)*unitOffset-paces);
    curLeft += (curIndex-lastIndex)*unitOffset;
});
// 思路就是计算出滑动了多少个单位，得出最终应该停留在哪一张图片，然后从拖动结束的位置移动到那里即可。还有注意拖动到达边界时不能再引起移动。

/*
https://www.bilibili.com/blackboard/activity-unicomopenbeta-m2.html
人家用伸缩和旋转做的。。
*/
})();
