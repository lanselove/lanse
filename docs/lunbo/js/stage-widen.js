console.log("好玩，好玩");

var banner = document.getElementById("banner");
var pics = document.getElementById("pics");
var prev = document.getElementById("prev");
var next = document.getElementById("next");
var btns = document.getElementById("btns").getElementsByTagName("i");
var items = pics.children;
var picNums = items.length;
var lastIndex = picNums-1;
var curIndex = 0;
var indexPool = {
    subs: [],
    get: function(i) {
        return this.subs[i+2];
    }
};
var motion_turn = true;
var notFinished = false;
var setFinished = function() {
    btns[lastIndex].className = "";
    btns[curIndex].className = "active";
    notFinished = false;
};
var showPrev = function() {
    items[indexPool.get(curIndex+2)].className = "active";
    items[indexPool.get(curIndex+1)].className = "active behind closer";
    items[curIndex].className = "active toward closest bigger";
    items[indexPool.get(curIndex-1)].className = "active before";
    motion_turn = false;
    setTimeout(stagePic, 400);
};
var showNext = function() {
    items[indexPool.get(curIndex-2)].className = "active";
    items[indexPool.get(curIndex-1)].className = "active before closer";
    items[curIndex].className = "active toward closest bigger";
    items[indexPool.get(curIndex+1)].className = "active behind";
    motion_turn = true;
    setTimeout(stagePic, 400);
};
var showTar = function() {
    items[indexPool.get(curIndex-1)].className = "active before";
    items[curIndex].className = "active toward closer bigger";
    items[indexPool.get(curIndex+1)].className = "active behind";
    setTimeout(setFinished, 400);
};
var stagePic = function() {
    items[indexPool.get((motion_turn)?curIndex-2:curIndex+2)].className = "";
    items[indexPool.get((motion_turn)?curIndex-1:curIndex+1)].className = "active " + ((motion_turn)?"before":"behind");
    items[curIndex].className = "active toward closer bigger";
    setFinished();
};

banner.onmouseenter = function() {
    this.className = "banner hover";
};
banner.onmouseleave = function() {
    this.className = "banner";
};

prev.onclick = function() {
    if (notFinished) return;
    lastIndex = curIndex--;
    if (lastIndex == 0) curIndex = picNums-1;
    notFinished = true;
    items[curIndex].className = "active before closest";
    items[indexPool.get(curIndex-1)].className = "active";
    setTimeout(showPrev, 10);
};
next.onclick = function() {
    if (notFinished) return;
    lastIndex = curIndex++;
    if (curIndex == picNums) curIndex = 0;
    notFinished = true;
    items[curIndex].className = "active behind closest";
    items[indexPool.get(curIndex+1)].className = "active";
    setTimeout(showNext, 10);
};

indexPool.subs.push(picNums-2, picNums-1);
for (var i = 0; i < picNums; i++) {
    indexPool.subs.push(i);
    (function(index) {
        btns[index].onclick = function() {
            var gap = index - curIndex;
            if (gap == 1 || gap == 1-picNums) {
                next.onclick();
                return;
            }
            if (gap == -1 || gap == picNums-1) {
                prev.onclick();
                return;
            }
            if (notFinished || index == curIndex) return;
            lastIndex = curIndex;
            curIndex = index;
            items[indexPool.get(lastIndex-1)].className = "";
            items[lastIndex].className = "";
            items[indexPool.get(lastIndex+1)].className = "";
            notFinished = true;
            items[indexPool.get(curIndex-1)].className = "active";
            items[curIndex].className = "active closer";
            items[indexPool.get(curIndex+1)].className = "active";
            setTimeout(showTar, 10);
        };
    })(i);
}
indexPool.subs.push(0, 1);
console.log(indexPool);

// 超出边界的索引如何循环到起点
