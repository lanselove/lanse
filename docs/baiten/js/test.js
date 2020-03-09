/*
* 每次只激活两个动画对象
只能等这一段动画完成才能开始下一段。监听点击事件还好，如果监听悬浮事件，用户频繁切换时就会有按钮失效的感觉
*/
var banner = (function() {
    var during = 1000 * 60/1000;
    var interval = 1000/60;
    var timer = null;
    var isFinish = true;
    function swing(b, c, d, t) {
        return b + c * (0.5 - Math.cos(Math.PI * t/d) / 2);
    }
    return {
        fade: function() {
            var count = 1;
            var initial = parseFloat(bannerItem[curIndex].style.opacity);
            var changed = 1 - initial;
            var animate = function() {
                var current = swing(initial, changed, during, count).toFixed(4);
                bannerItem[lastIndex].style.opacity = (1-current).toString();
                bannerItem[curIndex].style.opacity = current.toString();
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
    };
})();


/*
* 每个动画对象各自激活
每个动画对象都有自己的状态池，用户频繁切换按钮时也能无缝衔接
*/
function Fade(ele) {
    this.during = 1000 * 60/1000;
    this.interval = 1000/60;
    this.timer = null;
    this.element = ele;
}
Fade.prototype = {
    swing: function(b, c, d, t) {
        return b + c * (0.5 - Math.cos(Math.PI * t/d) / 2);
    },
    frame: function(target) {
        var count = 1;
        var initial = parseFloat(this.element.style.opacity);
        var that = this;
        var animate = function() {
            var current = that.swing(initial, target-initial, that.during, count).toFixed(4);
            that.element.style.opacity = current.toString();
            if (count < that.during) {
                count++;
                that.timer = setTimeout(animate, that.interval);
            }
        };
        clearTimeout(this.timer);
        this.timer = setTimeout(animate, this.interval);
    },
    comeIn: function() {
        this.frame(1);
    },
    goOut: function() {
        this.frame(0);
    }
};
