(function() {
// 长廊轮播
// 运动函数 + 外部决定的单段循环(克隆节点，临界复位)
function Gallery(opt) {
    this.element = opt.element;
    this.unitPix = opt.unitPix;
    this.speed = this.setting[(opt.speed) ? opt.speed : "normal"];
    this.shows = opt.shows;
    this.final = opt.final;
    this.init();
}
Gallery.prototype = {
    setting: {"slow": 1300, "normal": 1100, "fast": 900},
    init: function() {
        var fragment = document.createDocumentFragment();
        var childs = this.element.children;
        this.length = childs.length;
        for (var i = 0; i < this.length; i++) {
            fragment.appendChild(childs[i].cloneNode(true));
        }
        this.element.style.width = this.unitPix*(-1)*this.length*2 + "px";
        this.element.appendChild(fragment);
        this.interval = 10;
        this.duration = this.speed/this.interval;
        this.step = Math.round((this.unitPix/this.duration)*100)/100;
        this.current = 0;
        this.pending = false;
        console.log(this);
    },
    moving: function() {
        var that = this;
        var timer = null;
        var current = this.current;
        var target = this.current + this.unitPix;
        var animate = function() {
            current += that.step;
            if (current > target) {
                that.element.style.left = current + "px";
                timer = setTimeout(animate, that.interval);
            } else {
                that.element.style.left = target + "px";
                that.current = target;
                that.reseat();
                that.pending = false;
                that.next();
            }
        };
        this.pending = true;
        timer = setTimeout(animate, this.interval);
    },
    move: function(changed) {
        var that = this;
        var timer = null;
        var count = 1;
        var during = Math.round(this.duration/4);
        var animate = function() {
            var current = that.current + changed * Math.sin((Math.PI/2) * count/during);  // Sine.easeOut
            that.element.style.left = current.toFixed(3) + "px";
            if (count < during) {
                count++;
                timer = setTimeout(animate, that.interval);
            } else {
                that.current = current;
                that.reseat();
                that.pending = false;
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
    moveAll: function() {
        this.move(this.unitPix*this.shows);
        /*
        -1100+(-440): -440px
        */
    },
    moveAllRev: function() {
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
    moveOne: function() {
        this.move(this.unitPix);
    },
    moveOneRev: function() {
        if (this.current == 0) {
            this.current = this.unitPix*this.length;
            this.element.style.left = this.current + "px";
        }
        this.move(this.unitPix*(-1));
    },
    next: function() {
        if (this.final) this.final();
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner1");
var pics = document.getElementById("pics1");
var prev = document.getElementById("prev1");
var next = document.getElementById("next1");
var isMobile = (window.screen.width < 767);
var keeping = true;
var gall = new Gallery({
    element: pics,
    unitPix: isMobile ? -174 : -220,
    speed: "slow",
    shows: isMobile ? 2 : 3,
    final: function() {
        if (keeping) this.moving();
    }
});

banner.onmouseenter = function() {
    keeping = false;
};
banner.onmouseleave = function() {
    keeping = true;
    if (gall.done()) gall.moving();
};

prev.onclick = function() {
    if (gall.done()) gall.moveOneRev();
};
next.onclick = function() {
    if (gall.done()) gall.moveOne();
};

gall.moving();

/*
思路：每次单独以一张图片的距离进行一次完整的移动，结束后立马自动开启下一次，逐个衔接起来达到循环播放的效果，暂停时就停止自动开启下一个，而且不影响当前这次移动走完，这样暂停时还可以保证视野中展示的图片都是完整的。
较上一版本优化：
自动播放与按钮切换执行不同的动画。即，自动播放对应"moving"方法，匀速移动；按钮切换对应"move"方法，先快后慢移动。这样，它除了用作动态的展示图组，还可以用于静态的展示图组。
*/
})();



(function() {
// 长廊轮播选中放大
// 运动函数变体(拖拽时运动不是特定的，初始值和时长都要重新计算)
function GallerySelect(opt) {
    this.element = opt.element;
    this.unitPix = opt.unitPix;
    this.speed = opt.speed || 600;
    this.final = opt.final;
    this.init();
}
GallerySelect.prototype = {
    init: function() {
        this.interval = 10;
        this.duration = this.speed/this.interval;
        this.pending = false;
        console.log(this);
    },
    move: function(began, changed) {
        var that = this;
        var timer = null;
        var count = 1;
        var during = Math.round(Math.abs(changed/this.unitPix)*this.duration);
        console.log(began, changed, during);
        var animate = function() {
            var current = began + changed*(0.5 - Math.cos(Math.PI * count/during) / 2);  // Sine.easeInOut
            that.element.style.left = current.toFixed(3) + "px";
            if (count < during) {
                count++;
                timer = setTimeout(animate, that.interval);
            } else {
                that.pending = false;
                that.next();
            }
        };
        this.pending = true;
        timer = setTimeout(animate, this.interval);
    },
    next: function() {
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
var isMobile = (window.screen.width < 767);
console.log(banner.clientWidth);
var areaWid = banner.clientWidth;
var curLeft = (isMobile) ? (areaWid-220)/2-180 : (areaWid-252)/2-220;
var unitOffset = (isMobile) ? -180 : -220;
pics.style.left = curLeft + "px";
pics.style.display = "block";
// 元素display为none时无法获取到clientWidth之类的值
// 通过框架模块化添加DOM树就不用考虑clientWidth失效，自适应时首次渲染的left值跳动的问题了，完全可以先根据屏幕尺寸设定好值再添加到HTML中。
var lastIndex = 0;
var curIndex = 1;
var items = pics.children;
var notFinished = false;
var setFinished = function() {
    notFinished = false;
};
var stagePic = function() {
    items[lastIndex].className = "";
    items[curIndex].className = "active";
    setTimeout(setFinished, 150);  // 需要加上css动画(增减宽高)的时间
};
var gall = new GallerySelect({
    element: pics,
    unitPix: unitOffset,
    speed: 400,
    final: stagePic
});
/*
items[0].onclick = function() {
    console.log("巴拉");
    this.style.transform = "perspective(800px) translateZ(42px)";
};
// 采用Z轴放大图片会失真，增大尺寸才叫放大
*/

prev.onclick = function() {
    if (notFinished || curIndex == 0) return;
    lastIndex = curIndex--;
    notFinished = true;
    gall.move(curLeft, unitOffset*(-1));
    curLeft -= unitOffset;
};
next.onclick = function() {
    if (notFinished || curIndex == items.length-1) return;
    lastIndex = curIndex++;
    notFinished = true;
    gall.move(curLeft, unitOffset);
    curLeft += unitOffset;
};

banner.onmouseenter = function() {
    this.className = "banner2 hover";
};
banner.onmouseleave = function() {
    this.className = "banner2";
};

if (isMobile) {
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
        gall.move(curLeft+paces, (curIndex-lastIndex)*unitOffset-paces);
        curLeft += (curIndex-lastIndex)*unitOffset;
    });
    // 思路：先计算出滑动了多少个单位，得出最终应该停留在哪一张图片，然后从拖动结束的位置移动到那里即可。还有注意拖动到达边界时不能再引起移动。
}


/*
https://www.bilibili.com/blackboard/activity-unicomopenbeta-m2.html
人家用伸缩和平移做的。。
*/
})();
