//无限滚动轮播
(function() {
    var banner = document.getElementById("banner");
    var pics = document.getElementById("pics");
    var btns = document.getElementById("btns").getElementsByTagName("li");
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var lastIndex = 0;
    var curIndex = 0;
    var interval = 1000/60;
    var duration = 400/interval;       // 400是动画单位时间
    var unitOffset = parseInt(pics.style.left);     //单位位移
    var playTimer = null;
    var isSlided = true;
    var isAutoPlay = true;

    // 如果不需要无限滚动，那么offset统一在内部设置即可，且不需要再判断临界状态
    // var offset = unitOffset * (curIndex - lastIndex);
    function picSlide(offset) {
        var count = 1;
        var moveTimer = null;
        var initLeft = parseInt(pics.style.left);
        var move = function() {
            var curLeft = initLeft + offset * (0.5 - Math.cos(Math.PI * count/duration) / 2);
            pics.style.left = curLeft + "px";
            if (count < duration) {
                count++;
                moveTimer = setTimeout(move, interval);
            } else {
                if (curLeft == (unitOffset * (btns.length+1))) {
                    pics.style.left = unitOffset + "px";
                }
                if (curLeft == 0) {
                    pics.style.left = unitOffset * btns.length + "px";
                }
                isSlided = true;
                if (isAutoPlay) {
                    autoPlay();
                }
            }
        };

        btns[lastIndex].style.backgroundImage = "url(images/yuan.png)";
        btns[curIndex].style.backgroundImage = "url(images/yuan_hover.png)";
        isSlided = false;
        moveTimer = setTimeout(move, interval);
    }

    function autoPlay() {
        if (isSlided) {
            playTimer = setTimeout(function() {
                lastIndex = curIndex;
                if(lastIndex == btns.length-1) {
                    curIndex = 0;
                }
                else {
                    curIndex++;
                }
                picSlide(unitOffset);
            }, 3000);
        }
    }

    prev.onmouseenter = function() {
        prev.style.backgroundImage = "url(images/prev_hover.png)";
    };
    prev.onmouseleave = function() {
        prev.style.backgroundImage = "url(images/prev.png)";
    };
    next.onmouseenter = function() {
        next.style.backgroundImage = "url(images/next_hover.png)";
    };
    next.onmouseleave = function() {
        next.style.backgroundImage = "url(images/next.png)";
    };

    prev.onclick = function() {
        if (isSlided) {
            lastIndex = curIndex;
            if(lastIndex == 0) {
                curIndex = btns.length-1;
            }
            else {
                curIndex--;
            }
            picSlide(unitOffset * (-1));
        }
    };

    next.onclick = function() {
        if (isSlided) {
            lastIndex = curIndex;
            if(lastIndex == btns.length-1) {
                curIndex = 0;
            }
            else {
                curIndex++;
            }
            picSlide(unitOffset);
        }
    };

    for (var i = 0;i < btns.length;i++) {
        btns[i].index = i;
        btns[i].onclick = function() {
            if ((this.index != curIndex) && isSlided) {
                lastIndex = curIndex;
                curIndex = this.index;
                picSlide(unitOffset * (curIndex - lastIndex));
            }
        };
    }

    autoPlay();
    banner.onmouseenter = function() {
        isAutoPlay = false;
        clearTimeout(playTimer);
    };
    banner.onmouseleave = function() {
        isAutoPlay = true;
        autoPlay();
    };
})();