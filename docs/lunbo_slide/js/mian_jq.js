// 淡入淡出轮播
(function() {
    var $banner = $("#banner");
    var $pics = $("#pics");
    var $btns = $("#btns > li");
    var $prev = $("#prev");
    var $next = $("#next");
    var lastIndex = $btns.length-1;
    var curIndex = 0;
    var unitOffset = parseInt($pics.css("left"));
    var playTimer = null;
    var isSlided = true;
    var isAutoPlay = true;

    // 如果不需要无限滚动，那么offset统一在内部设置即可，且不需要再判断临界状态
    // var targetLeft = initLeft + unitOffset * (curIndex - lastIndex);
    function picSlide(offset) {
        var initLeft = parseInt($pics.css("left"));
        var targetLeft = initLeft + offset;
        $btns.eq(curIndex).css("backgroundImage", "url(images/yuan_hover.png)");
        $btns.eq(lastIndex).css("backgroundImage", "url(images/yuan.png)");
        isSlided = false;
        $pics.animate({left: targetLeft + "px"}, function() {
            if (targetLeft == (unitOffset * ($btns.length+1))) {
                $pics.css("left", unitOffset + "px")
            }
            if (targetLeft == 0) {
                $pics.css("left", unitOffset * $btns.length + "px")
            }
            isSlided = true;
            if (isAutoPlay) {
                autoPlay();
            }
        });
    }

    function autoPlay() {
        if (isSlided) {
            playTimer = setTimeout(function() {
                lastIndex = curIndex;
                if(lastIndex == $btns.length-1) {
                    curIndex = 0;
                }
                else {
                    curIndex++;
                }
                picSlide(unitOffset);
            }, 3000);
        }
    }

    $prev.on({
        "mouseenter": function() {
            $prev.css("backgroundImage", "url(images/prev_hover.png)");
        },
        "mouseleave": function() {
            $prev.css("backgroundImage", "url(images/prev.png)");
        },
        "click": function() {
            if (isSlided) {
                lastIndex = curIndex;
                if(lastIndex == 0) {
                    curIndex = $btns.length-1;
                }
                else {
                    curIndex--;
                }
                picSlide(unitOffset * (-1));
            }
        }
    });

    $next.on({
        "mouseenter": function() {
            $next.css("backgroundImage", "url(images/next_hover.png)");
        },
        "mouseleave": function() {
            $next.css("backgroundImage", "url(images/next.png)");
        },
        "click": function() {
            if (isSlided) {
                lastIndex = curIndex;
                if(lastIndex == $btns.length-1) {
                    curIndex = 0;
                }
                else {
                    curIndex++;
                }
                picSlide(unitOffset);
            }
        }
    });

    $btns.on("click", function() {
        var _index = $(this).index();
        if ((_index != curIndex) && isSlided) {
            lastIndex = curIndex;
            curIndex = _index;
            picSlide(unitOffset * (curIndex - lastIndex));
        }
    });

    $banner.on({
        "mouseenter": function() {
            isAutoPlay = false;
            clearTimeout(playTimer);
        },
        "mouseleave": function() {
            isAutoPlay = true;
            autoPlay();
        }
    });

    autoPlay();
})();