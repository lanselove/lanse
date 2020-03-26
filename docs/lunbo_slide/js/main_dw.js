// 淡入淡出轮播
(function() {
    function SingleIn(opt) {
        var speed = opt.speed || 800;
        var during = speed * 60/1000;
        var delay = 1000/60;
        return function(changed, enter, leave) {
            var that = this;
            var timer = null;
            var count = 1;
            var move = function() {
                var current = changed * (0.5 - Math.cos(Math.PI * count/during) / 2);
                enter.style[opt.align] = current-changed + "%";
                leave.style[opt.align] = current + "%";
                if (count < during) {
                    count++;
                    timer = setTimeout(move, delay);
                } else {
                    leave.style.cssText = "";
                    enter.style.cssText = "display: block;";
                    if (opt.final) opt.final();
                }
            };
            enter.style.cssText = "display: block; " + opt.align + ": " + (-1)*changed + "%;";
            timer = setTimeout(move, delay);
        };
    }


    var $banner = $("#banner");
    var $pics = $("#pics > li");
    var $btns = $("#btns > i");
    var $prev = $("#prev");
    var $next = $("#next");
    var lastIndex = $btns.length-1;
    var curIndex = 0;
    var playTimer = null;
    var isAutoPlay = true;
    var isSlided = true;
    // <li style="display: block;">
    var slideZ = SingleIn({
        align: "left",
        speed: 1000,
        final: function() {
            isSlided = true;
        }
    });
    var picSlide = function(offset) {
        isSlided = false;
        slideZ(offset, $pics.get(curIndex), $pics.get(lastIndex));
        $btns.eq(curIndex).addClass("active");
        $btns.eq(lastIndex).removeClass("active");
    }

    $btns.on("click", function() {
        var _index = $(this).index();
        if ((_index != curIndex) && isSlided) {
            lastIndex = curIndex;
            curIndex = _index;
            (curIndex > lastIndex) ? picSlide(-100) : picSlide(100);
        }
    });
    $prev.on({
        "mouseenter": function() {
            $prev.addClass("hover");
        },
        "mouseleave": function() {
            $prev.removeClass("hover");
        },
        "click": function() {
            if (isSlided) {
                lastIndex = curIndex--;
                if(lastIndex == 0) {
                    curIndex = $btns.length-1;
                }
                picSlide(100);
            }
        }
    });
    $next.on({
        "mouseenter": function() {
            $next.addClass("hover");
        },
        "mouseleave": function() {
            $next.removeClass("hover");
        },
        "click": function() {
            if (isSlided) {
                lastIndex = curIndex++;
                if(lastIndex == $btns.length-1) {
                    curIndex = 0;
                }
                picSlide(-100);
            }
        }
    });

    var aiex = window.screen.width;
    if (aiex < 600) {
        banner.style.height = aiex*2/3 + "px";
    }

    /*
    // jQuery的animate不同对象虽然同时定义，但可能不会同时进行，所以自定义动画方法才靠谱
    // 上一张：0~100%, -100%~0
    $pics.eq(lastIndex).animate({left: "100%"}, "slow", function() {
        $pics.eq(lastIndex).attr("style", "");
    });
    $pics.eq(curIndex).animate({left: "0px"}, "slow", function() {
        $pics.eq(curIndex).attr("style", "display: block;");
        isSlided = true;
    });
    // 下一张：0~-100%, 100%~0
    $pics.eq(lastIndex).animate({left: "-100%"}, "slow", function() {
        $pics.eq(lastIndex).attr("style", "");
    });
    $pics.eq(curIndex).animate({left: "0px"}, "slow", function() {
        $pics.eq(curIndex).attr("style", "display: block;");
        isSlided = true;
    });
    */


    /*// css3动画虽然解放了js但带来一堆其他问题。。(https://blog.csdn.net/xingxing1828/article/details/79552483)
    // <li class="xiao">
    var picSlide = function(align) {
        isSlided = false;
        $pics.eq(lastIndex).addClass("active-" + align);
        $pics.eq(curIndex).addClass("active");
        $btns.eq(curIndex).addClass("active");
        $btns.eq(lastIndex).removeClass("active");
        setTimeout(stagePic, 800);
        console.log(Date.now());
    };
    var stagePic = function() {
        console.log(Date.now());
        isSlided = true;
        $pics.eq(lastIndex).removeClass();
        $pics.eq(curIndex).attr("class", "xiao");
    };

    $pics.on("transitionend", function() {
        console.log(Date.now());
    });

    $btns.on("click", function() {
        var _index = $(this).index();
        if ((_index != curIndex) && isSlided) {
            lastIndex = curIndex;
            curIndex = _index;
            if (curIndex > lastIndex) {
                $pics.eq(curIndex).addClass("behind");
                setTimeout(function() {
                    picSlide("left");
                }, 10);
            } else {
                $pics.eq(curIndex).addClass("infront");
                setTimeout(function() {
                    picSlide("right");
                }, 10);
            }
        }
    });
    $prev.on({
        "mouseenter": function() {
            $prev.addClass("hover");
        },
        "mouseleave": function() {
            $prev.removeClass("hover");
        },
        "click": function() {
            if (isSlided) {
                lastIndex = curIndex--;
                if(lastIndex == 0) {
                    curIndex = $btns.length-1;
                }
                $pics.eq(curIndex).addClass("infront");
                // 0~100%, -100%~0
                setTimeout(function() {
                    picSlide("right");
                }, 10);
            }
        }
    });
    $next.on({
        "mouseenter": function() {
            $next.addClass("hover");
        },
        "mouseleave": function() {
            $next.removeClass("hover");
        },
        "click": function() {
            if (isSlided) {
                lastIndex = curIndex++;
                if(lastIndex == $btns.length-1) {
                    curIndex = 0;
                }
                $pics.eq(curIndex).addClass("behind");
                // 0~-100%, 100%~0
                setTimeout(function() {
                    picSlide("left");
                }, 10);
            }
        }
    });*/
})();