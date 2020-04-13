(function() {
// 已废弃的html标签<marquee>可以直接创建滚动文字(见: https://blog.csdn.net/CamilleZJ/article/details/90752128)
function Marquee(opt) {
    this.element = opt.element;
    this.speed = opt.speed || 100;  // 默认100px/1s
    this.final = opt.final;
    this.init();
}
Marquee.prototype = {
    init: function() {
        var childs = banner.children;
        this.rollPix = this.element.scrollWidth;
        this.element.appendChild(childs[0].cloneNode(true));
        this.timer = null;
        this.interval = 10;
        this.count = 1;
        // 根据自身的宽来计算运动时长
        this.duration = Math.round((100/this.speed) * this.rollPix);  // ((this.rollPix/100)/(this.speed/100))*1000/this.interval
        this.pending = false;
        console.log(this);
    },
    move: function() {
        var that = this;
        // var initial = 0;
        var changed = this.rollPix;
        var count = this.count;
        var during = this.duration;
        var animate = function() {
            var current = changed*(count/during);
            that.element.scrollLeft = current;
            if (count < during) {
                count++;
                that.count = count;
                that.timer = setTimeout(animate, that.interval);
            } else {
                that.element.scrollLeft = 0;
                that.count = 1;
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
        this.pending = false;
        if (this.final) this.final();
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner1");
var marquee = new Marquee({
    element: banner,
    speed: 70,
    final: function() {
        console.log("我们的歌");
        marquee.move();
    }
});
banner.onmouseenter = function() {
    marquee.suspend();
};
banner.onmouseleave = function() {
    marquee.proceed();
};
marquee.move();
// console.log(crabs);


/*
思路：在文字容器身上进行移动，每次移动的距离为"文字容器的宽度"
借助scrollLeft，就可以不用定位布局了
见: 原生JS实现公告栏文字横向滚动(通告栏) - https://blog.csdn.net/zhangzeshan/article/details/83588979
*/
})();



(function() {
function Gallery(opt) {
    this.element = opt.element;
    this.speed = this.setting[(opt.speed) ? opt.speed : "normal"];
    this.init();
}
Gallery.prototype = {
    setting: {"slow": 1000, "normal": 800, "fast": 600},
    init: function() {
        var fragment = document.createDocumentFragment();
        var childs = this.element.children;
        var unitWid = childs[0].clientHeight;
        this.length = childs.length;
        for (var i = 0; i < this.length; i++) {
            fragment.appendChild(childs[i].cloneNode(true));
        }
        this.element.appendChild(fragment);
        this.unitPix = unitWid*(-1);
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
            var current = that.current + that.unitPix*(0.5 - Math.cos(Math.PI * that.count/that.during) / 2);
            that.element.style.marginTop = current.toFixed(3) + "px";
            if (that.count < that.during) {
                that.count++;
                that.timer = setTimeout(animate, that.interval);
            } else {
                that.current = current;
                that.reseat();
                that.count = 1;
                that.pending = false;
                that.timer = setTimeout(function() {
                    that.move();
                }, 1000);
            }
        };
        this.pending = true;
        this.timer = setTimeout(animate, this.interval);
    },
    reseat: function() {
        if (this.current <= this.unitPix*this.length) {
            this.element.style.marginTop = "0px";
            this.current = 0;
        }
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
    speed: "slow"
});
banner.onmouseenter = function() {
    crap.suspend();
};
banner.onmouseleave = function() {
    crap.proceed();
};
crap.move();
})();
