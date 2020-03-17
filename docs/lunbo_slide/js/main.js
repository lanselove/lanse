//无限滚动轮播
function BeeSlide(opt) {
    this.element = opt.element;
    this.length = opt.length;
    this.speed = this.setting[(opt.speed)?opt.speed:"normal"];
    this.DURING = this.speed * 60/1000;
    this.DELAY = 1000/60;
    this.pending = false;
    this.final = opt.final;
    this.mode = (opt.type == "infinite") ? true : false;
    this.unitPix = opt.unitPix;
    if (this.mode) this.reStyle();
}
BeeSlide.prototype = {
    setting: {"fast":200,"normal":400,"slow":600},
    reStyle: function() {
        var childs = this.element.children;
        this.element.style.left = this.unitPix + "px";
        this.element.style.width = (-1)*this.unitPix * (this.length+2) + "px";
        this.element.insertBefore(childs[this.length-1].cloneNode(true), childs[0]);
        this.element.appendChild(childs[1].cloneNode(true));
    },
    slide: function(offset) {
        var that = this;
        var timer = null;
        var initLeft = parseInt(this.element.style.left);
        var count = 1;
        var move = function() {
            var curLeft = initLeft + offset * (0.5 - Math.cos(Math.PI * count/that.DURING) / 2);
            that.element.style.left = curLeft + "px";
            if (count < that.DURING) {
                count++;
                timer = setTimeout(move, that.DELAY);
            } else {
                if (that.mode) {
                    if (curLeft == (that.unitPix * (that.length+1))) {
                        that.element.style.left = that.unitPix + "px";
                    }
                    if (curLeft == 0) {
                        that.element.style.left = that.unitPix * that.length + "px";
                    }
                }
                that.next();
            }
        };
        this.pending = true;
        timer = setTimeout(move, that.DELAY);
    },
    next: function() {
        this.pending = false;
        if (this.final) this.final(this);
    },
    done: function() {
        return !this.pending;
    }
};


var banner = document.getElementById("banner");
var pics = document.getElementById("pics");
var btns = document.getElementById("btns").getElementsByTagName("i");
var lastIndex = 0;
var curIndex = 0;
var unitOffset = (-1) * banner.clientWidth;     //单位位移
var playTimer = null;
var isAutoPlay = true;
var slider = new BeeSlide({
    element: pics,
    length: 5,
    speed: "slow",
    type: "infinite",
    unitPix: unitOffset,
    final: function(bee) {
        if (isAutoPlay) autoPlay();
    }
});
// 如果不需要无限滚动，那么offset统一在内部设置即可，且不需要再判断临界状态
var picSlide = function(offset) {
    // var offset = unitOffset * (curIndex - lastIndex);
    btns[lastIndex].className = "";
    btns[curIndex].className = "active";
    slider.slide(offset);
};
var autoPlay = function() {
    playTimer = setTimeout(function() {
        lastIndex = curIndex++;
        if(lastIndex == btns.length-1) {
            curIndex = 0;
        }
        picSlide(unitOffset);
    }, 3000);
};

for (var i = 0;i < btns.length;i++) {
    btns[i].index = i;
    btns[i].onclick = function() {
        if ((this.index != curIndex) && slider.done()) {
            lastIndex = curIndex;
            curIndex = this.index;
            picSlide(unitOffset * (curIndex - lastIndex));
        }
    };
}

banner.onmouseenter = function() {
    isAutoPlay = false;
    clearTimeout(playTimer);
};
banner.onmouseleave = function() {
    isAutoPlay = true;
    if (slider.done()) autoPlay();
};
autoPlay();

var prev = document.getElementById("prev");
var next = document.getElementById("next");
prev.onmouseenter = function() {
    this.className = "arrow active";
};
prev.onmouseleave = function() {
    this.className = "arrow";
};
next.onmouseenter = function() {
    this.className = "arrow active";
};
next.onmouseleave = function() {
    this.className = "arrow";
};
prev.onclick = function() {
    if (slider.done()) {
        lastIndex = curIndex--;
        if(lastIndex == 0) {
            curIndex = btns.length-1;
        }
        picSlide(unitOffset * (-1));
    }
};
next.onclick = function() {
    if (slider.done()) {
        lastIndex = curIndex++;
        if(lastIndex == btns.length-1) {
            curIndex = 0;
        }
        picSlide(unitOffset);
    }
};

var aiex = window.screen.width;
if (aiex < 600) {
    banner.style.height = aiex*2/3 + "px";
    var childs = pics.children;
    for (var i = 0; i < childs.length; i++) {
        childs[i].style.width = (-1)*unitOffset + "px";
    }
    // 在移动端基本没有不无限滚动的，所以只需对于无限滚动分析
    var startX,moveX,curLeft;
    var invalid = false;
    banner.addEventListener("touchstart", function() {
        var touch = event.touches[0];
        startX = touch.pageX;
        curLeft = unitOffset * (curIndex+1);
        invalid = true;
        isAutoPlay = false;
        clearTimeout(playTimer);
    });
    banner.addEventListener("touchmove", function() {
        var touch = event.touches[0];
        moveX = Math.round(touch.pageX-startX);
        if (Math.abs(moveX) < 10) return;
        pics.style.left = curLeft+moveX + "px";
        invalid = false;
    });
    banner.addEventListener("touchend", function() {
        if (invalid) return;
        if (moveX > 10){
            lastIndex = curIndex--;
            if(lastIndex == 0) {
                curIndex = btns.length-1;
            }
            picSlide(unitOffset * (-1) - moveX);
        } else if (moveX < -10) {
            lastIndex = curIndex++;
            if(lastIndex == btns.length-1) {
                curIndex = 0;
            }
            picSlide(unitOffset - moveX);
        }
    });
}
