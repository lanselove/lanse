// 渐隐渐显轮播
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
        var initial = (window.MSIE) ? parseFloat(this.element.style.filter.match(/opacity=([\d.]+)/)[1])/100 : parseFloat(this.element.style.opacity);
        var changed = target-initial;
        var count = 1;
        var animate = function() {
            var current = that.swing(initial, changed, that.DURING, count);
            // console.log("第"+that.index+"张", current, count);
            if (window.MSIE) {
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
JS实现自动轮播图效果(自适应屏幕宽度+手机触屏滑动)
https://www.jb51.net/article/116527.htm
文档加载前动态添加style的好处是可以在layout前定义好样式，但要多费功夫处理js。
<script type="text/javascript">
  var device = window.screen.width;
  if (device < 768) {
      var style = document.createElement("style");
      var bies = device*2/3;
      style.type = "text/css";
      style.innerHTML = ".banner{height:" + bies + "px;}";
      document.head.append(style);
  }
</script>
*/
// console.log(document.head);
// console.log(document.body);
// 文档加载后更改内联样式速度慢可能影响到布局
// banner.style.height = pics[0].offsetHeight + "px";
var aiex = window.screen.width;
if (aiex<600) {
    banner.style.height = aiex*2/3 + "px";
    var startX,endX,moveX;
    var invalid = false;
    banner.addEventListener("touchstart", function() {
        var touch = event.touches[0];
        startX = touch.pageX;
        invalid = true;
        isAutoPlay = false;
        clearTimeout(playTimer);
    });
    banner.addEventListener("touchmove", function() {
        var touch = event.touches[0];
        endX = touch.pageX;
        invalid = false;
    });
    banner.addEventListener("touchend", function() {
        if (invalid) return;
        moveX = endX-startX;
        if(moveX>50){
            prev.onclick();
        } else if(moveX<-50){
            next.onclick();
        }
    });
}
