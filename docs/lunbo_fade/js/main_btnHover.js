// 淡入淡出轮播
(function() {
    var banner = document.getElementById("banner");
    var pics = document.getElementById("pics").getElementsByTagName("li");
    var btns = document.getElementById("btns").getElementsByTagName("li");
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var lastIndex = 0;
    var curIndex = 0;
    var interval = 1000/60;
    var duration = 400/interval;
    var playTimer = null;
    var isAutoPlay = true;

    function fadeOut(index) {
        pics[index].isNeedOut = true;
        // 只有淡入完成时才可以淡出
        if (!pics[index].isNeedIn) {
            var count = 1;
            var draw = function() {
                // 这里的1是淡入的目标透明度，（-1）是淡出的目标透明度减去淡入的目标透明度
                var curFace = 1 + (-1) * (0.5 - Math.cos(Math.PI * count/duration) / 2);
                pics[index].style.opacity = curFace.toString();
                if (count < duration) {
                    count++;
                    pics[index].timer = setTimeout(draw, interval);
                } else {
                    pics[index].isNeedOut = false;
                    // 如果需要自动播放，在这里去调用自动播放函数
                    if (isAutoPlay && (index == lastIndex)) {
                        autoPlay();
                    }
                }
            };

            pics[index].timer = setTimeout(draw, interval);
        }
    }

    function fadeIn(index) {
        var count = 1;
        var beginFace = parseFloat(pics[index].style.opacity);
        // 这里的1是淡入的目标透明度
        var changeFace = 1 - beginFace;
        var draw = function() {
            var curFace = beginFace + changeFace * (0.5 - Math.cos(Math.PI * count/duration) / 2);
            pics[index].style.opacity = curFace.toString();
            if (count < duration) {
                count++;
                pics[index].timer = setTimeout(draw, interval);
            } else {
                pics[index].isNeedIn = false;
                //如果需要淡出，在这里去调用淡出函数
                if (pics[index].isNeedOut) {
                    fadeOut(index);
                }
            }
        };

        // 无论之前是淡入还是淡出，都直接推掉，开始淡入
        clearTimeout(pics[index].timer);
        // 如果之前在淡出，强行设置淡出为完成状态
        pics[index].isNeedOut = false;
        pics[index].isNeedIn = true;
        pics[index].timer = setTimeout(draw, interval);
    }

    function picFade() {
        btns[lastIndex].style.backgroundImage = "url(images/yuan.png)";
        btns[curIndex].style.backgroundImage = "url(images/yuan_hover.png)";
        pics[lastIndex].style.zIndex = "0";
        pics[curIndex].style.zIndex = "1";
        fadeIn(curIndex);
        fadeOut(lastIndex);
    }

    function autoPlay() {
        // 只有先前索引位置淡出完成才可以自动播放
        if (!pics[lastIndex].isNeedOut) {
            playTimer = setTimeout(function() {
                lastIndex = curIndex;
                if(lastIndex == btns.length-1) {
                    curIndex = 0;
                }
                else {
                    curIndex++;
                }
                picFade();
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
        lastIndex = curIndex;
        if(lastIndex == 0) {
            curIndex = btns.length-1;
        }
        else {
            curIndex--;
        }
        picFade();
    };

    next.onclick = function() {
        lastIndex = curIndex;
        if(lastIndex == btns.length-1) {
            curIndex = 0;
        }
        else {
            curIndex++;
        }
        picFade();
    };

    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onmouseenter = function() {
            if (this.index != curIndex) {
                lastIndex = curIndex;
                curIndex = this.index;
                picFade();
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