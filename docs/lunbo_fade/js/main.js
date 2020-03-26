var banner = document.getElementById("banner");
var pics = document.getElementById("pics");
var btns = document.getElementById("btns").getElementsByTagName("i");
var prev = document.getElementById("prev");
var next = document.getElementById("next");

var beeParty = swiper({
    type: "fade",
    speed: "slow",
    wrapLayer: banner,
    picsLayer: pics,
    ctrlBtns: btns,
    ctrlWay: "mouseenter",
    ctrlPrev: prev,
    ctrlNext: next,
    touchON: false,
    pixRatio: 2/3
});

prev.onmouseenter = function() {
    this.className = "arrow hover";
};
prev.onmouseleave = function() {
    this.className = "arrow";
};
next.onmouseenter = function() {
    this.className = "arrow hover";
};
next.onmouseleave = function() {
    this.className = "arrow";
};



/*// 淡入淡出轮播
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
    var isfaded = true;
    var isAutoPlay = true;

    function picFade() {
        var count = 1;
        var fadeTimer = null;
        var draw = function() {
            var inFace = 0.5 - Math.cos(Math.PI * count/duration) / 2;
            var outFace = 1 - inFace;
            pics[curIndex].style.opacity = inFace.toString();
            pics[lastIndex].style.opacity = outFace.toString();
            if (count < duration) {
                count++;
                fadeTimer = setTimeout(draw, interval);
            } else {
                isfaded = true;
                if (isAutoPlay) {
                    autoPlay();
                }
            }
        };

        pics[lastIndex].style.zIndex = "0";
        pics[curIndex].style.zIndex = "1";
        btns[lastIndex].style.backgroundImage = "url(images/yuan.png)";
        btns[curIndex].style.backgroundImage = "url(images/yuan_hover.png)";
        isfaded = false;
        fadeTimer = setTimeout(draw, interval);
    }

    function autoPlay() {
        if (isfaded) {
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
        if (isfaded) {
            lastIndex = curIndex;
            if(lastIndex == 0) {
                curIndex = btns.length-1;
            }
            else {
                curIndex--;
            }
            picFade();
        }
    };

    next.onclick = function() {
        if (isfaded) {
            lastIndex = curIndex;
            if(lastIndex == btns.length-1) {
                curIndex = 0;
            }
            else {
                curIndex++;
            }
            picFade();
        }
    };

    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onclick = function() {
            if ((this.index != curIndex) && isfaded) {
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
})();*/