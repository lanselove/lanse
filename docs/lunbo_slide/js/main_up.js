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
var DURING = 800 * 60/1000;
var DELAY = 1000/60;
var pending = false;
var slideZ = function(changed, final) {
    var timer = null;
    var count = 1;
    var move = function() {
        var current = changed * (0.5 - Math.cos(Math.PI * count/DURING) / 2);
        $pics.eq(curIndex).css("top", current-changed + "%");
        $pics.eq(lastIndex).css("top", current + "%");
        if (count < DURING) {
            count++;
            timer = setTimeout(move, DELAY);
        } else {
            pending = false;
            if (final) final();
        }
    };
    pending = true;
    timer = setTimeout(move, DELAY);
};
var done = function() {
    return !this.pending;
};
var picSlide = function(offset) {
    isSlided = false;
    slideZ(offset, stagePic);
    $pics.eq(curIndex).css({"display":"block", "top": (-1)*offset + "%"});
    $btns.eq(curIndex).addClass("active");
    $btns.eq(lastIndex).removeClass("active");
}
var stagePic = function() {
    isSlided = true;
    $pics.eq(lastIndex).attr("style", "");
    $pics.eq(curIndex).attr("style", "display: block;");
};

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
