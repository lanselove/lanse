// 淡入淡出轮播
(function() {
    var $banner = $("#banner");
    var $pics = $("#pics > li");
    var $btns = $("#btns > i");
    var $prev = $("#prev");
    var $next = $("#next");
    var lastIndex = $btns.length-1;
    var curIndex = 0;
    var playTimer = null;
    var isAutoPlay = true;

    function picFade() {
        $btns.eq(curIndex).addClass("active");
        $btns.eq(lastIndex).removeClass("active");
        $pics.eq(curIndex).fadeIn();
        $pics.eq(lastIndex).fadeOut(function() {
            if (isAutoPlay && ($(this).index() == lastIndex)) {
                autoPlay();
            }
        });
        // console.log($pics.get(lastIndex));
        // setTimeout(function() {
        //     console.log($pics.eq(lastIndex).attr("style"));
        // }, 30);
    }

    function autoPlay() {
        playTimer = setTimeout(function() {
            lastIndex = curIndex++;
            if(lastIndex == $btns.length-1) {
                curIndex = 0;
            }
            picFade();
        }, 3000);
    }

    $prev.on({
        "mouseenter": function() {
            $(this).addClass("active");
        },
        "mouseleave": function() {
            $(this).removeClass("active");
        },
        "click": function() {
            lastIndex = curIndex--;
            if(lastIndex == 0) {
                curIndex = $btns.length-1;
            }
            picFade();
        }
    });

    $next.on({
        "mouseenter": function() {
            $(this).addClass("active");
        },
        "mouseleave": function() {
            $(this).removeClass("active");
        },
        "click": function() {
            lastIndex = curIndex++;
            if(lastIndex == $btns.length-1) {
                curIndex = 0;
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
            if ($pics.eq(lastIndex).css("display") == "none") autoPlay();
        }
    });

    autoPlay();
})();