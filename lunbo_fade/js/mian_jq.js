// 淡入淡出轮播
(function() {
    var $banner = $("#banner");
    var $pics = $("#pics > li");
    var $btns = $("#btns > li");
    var $prev = $("#prev");
    var $next = $("#next");
    var lastIndex = $btns.length-1;
    var curIndex = 0;
    var playTimer = null;
    var isAutoPlay = true;

    function picFade() {
        $btns.eq(curIndex).css("backgroundImage", "url(images/yuan_hover.png)");
        $btns.eq(lastIndex).css("backgroundImage", "url(images/yuan.png)");
        $pics.eq(curIndex).fadeIn();
        $pics.eq(lastIndex).fadeOut(function() {
            if (isAutoPlay && ($(this).index() == lastIndex)) {
                autoPlay();
            }
        });
    }

    function autoPlay() {
        if ($pics.eq(lastIndex).css("display") == "none") {
            playTimer = setTimeout(function() {
                lastIndex = curIndex;
                if(lastIndex == $btns.length-1) {
                    curIndex = 0;
                }
                else {
                    curIndex++;
                }
                picFade();
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
            lastIndex = curIndex;
            if(lastIndex == 0) {
                curIndex = $btns.length-1;
            }
            else {
                curIndex--;
            }
            picFade();
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
            lastIndex = curIndex;
            if(lastIndex == $btns.length-1) {
                curIndex = 0;
            }
            else {
                curIndex++;
            }
            picFade();
        }
    });

    $btns.on("mouseenter", function() {
        var _index = $(this).index();
        if (_index != curIndex) {
            lastIndex = curIndex;
            curIndex = _index;
            picFade();
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