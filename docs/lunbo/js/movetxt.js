(function() {
// 已废弃的html标签<marquee>可以直接创建滚动文字(见: https://blog.csdn.net/CamilleZJ/article/details/90752128)
// 横播文字
// 匀速移动无需运动函数(记录每次的current值以暂停继续) + 整段循环(克隆首位子元素，结束时复位)
function Marquee(opt) {
    this.element = opt.element;
    this.speed = opt.speed || 100;  // 默认100px/1s
    this.infinite = (typeof(opt.infinite)=="undefined") ? true : opt.infinite;
    this.init();
}
Marquee.prototype = {
    init: function() {
        var childs = banner.children;
        this.rollPix = (-1) * this.element.scrollWidth;
        this.element.appendChild(childs[0].cloneNode(true));
        this.timer = null;
        this.interval = 10;
        this.step = (-1) * this.speed/100;  // speed*(interval/1000)
        this.current = this.step;
        this.pending = false;
        console.log(this);
        var that = this;
        this.timer = setTimeout(function() {
            that.move();
        }, 1000);
    },
    move: function() {
        var that = this;
        var animate = function() {
            if (that.current > that.rollPix) {
                that.element.style.left = that.current + "px";
                that.current += that.step;
                that.timer = setTimeout(animate, that.interval);
            } else {
                that.element.style.left = "0px";
                that.current = that.step;
                that.pending = false;
                that.next();
            }
        };
        this.pending = true;
        this.timer = setTimeout(animate, this.interval);
    },
    suspend: function() {
        clearTimeout(this.timer);
    },
    proceed: function() {
        this.move();
    },
    next: function() {
        if (this.infinite) this.move();
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner1");
var marquee = new Marquee({
    element: banner,
    speed: 70,
    infinite: true
});

banner.onmouseenter = function() {
    marquee.suspend();
};
banner.onmouseleave = function() {
    marquee.proceed();
};

/*
思路：在文字容器身上进行移动，每次移动的距离为"文字容器的宽度"
借助scrollLeft，就可以不用定位布局了。但别用scrollLeft动画，耗性能
见: 原生JS实现公告栏文字横向滚动(通告栏) - https://blog.csdn.net/zhangzeshan/article/details/83588979
*/
})();



(function() {
// 上滚文字
// 运动函数plus(记录每次的count值以暂停继续) + 有停顿的单段循环(克隆节点，临界复位)
function Gallery(opt) {
    this.element = opt.element;
    this.unitPix = opt.unitPix;
    this.speed = this.setting[(opt.speed) ? opt.speed : "normal"];
    this.spacing = opt.spacing || 1000;
    this.init();
}
Gallery.prototype = {
    setting: {"slow": 1000, "normal": 800, "fast": 600},
    init: function() {
        var fragment = document.createDocumentFragment();
        var childs = this.element.children;
        this.length = childs.length;
        for (var i = 0; i < this.length; i++) {
            fragment.appendChild(childs[i].cloneNode(true));
        }
        this.element.appendChild(fragment);
        this.timer = null;
        this.interval = 25;
        this.during = this.speed/this.interval;
        this.current = 0;
        this.count = 1;
        this.pending = false;
        console.log(this);
    },
    move: function() {
        var that = this;
        // console.log(that.count, that.current);
        var animate = function() {
            var current = that.current + that.unitPix*(0.5 - Math.cos(Math.PI * that.count/that.during) / 2);    // Sine.easeInOut
            that.element.style.top = current.toFixed(3) + "px";
            if (that.count < that.during) {
                that.count++;
                that.timer = setTimeout(animate, that.interval);
            } else {
                that.current = current;
                that.reseat();
                that.count = 1;
                that.pending = false;
                that.play();
            }
        };
        this.pending = true;
        this.timer = setTimeout(animate, this.interval);
    },
    reseat: function() {
        if (this.current <= this.unitPix*this.length) {
            this.element.style.top = "0px";
            this.current = 0;
        }
    },
    play: function() {
        var that = this;
        this.timer = setTimeout(function() {
            that.move();
        }, this.spacing);
    },
    suspend: function() {
        clearTimeout(this.timer);
    },
    proceed: function() {
        clearTimeout(this.timer);
        this.move();
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner2");
var crap = new Gallery({
    element: banner,
    unitPix: -25,
    speed: "slow",
    spacing: 1500
});

banner.onmouseenter = function() {
    crap.suspend();
};
banner.onmouseleave = function() {
    crap.proceed();
};

crap.play();
})();
