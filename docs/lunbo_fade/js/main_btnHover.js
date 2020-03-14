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
        btns[index].onclick = function() {
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

