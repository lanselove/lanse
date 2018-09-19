var isNormal = "getElementsByClassName" in document;
// 也可以这么写
// var isNormal = !!document.getElementsByClassName;

// 兼容getElementsByClassName函数
function getElementsByClassStr(idObj, classStr) {
    if (isNormal){
        return idObj.getElementsByClassName(classStr);
    } else{
        var elements = new Array();
        var children = idObj.getElementsByTagName("*");
        for (var i = 0; i < children.length; i++) {
            var classArr = children[i].className.split(" ");
            for (var j = 0; j < classArr.length; j++) {
                if (classArr[j] == classStr) {
                    elements.push(children[i]);
                    break;
                }
            }
        }
        return elements;
    }
}

(function() {
    var menuItem = document.getElementById("menu").children;

    for (var i = 0; i < menuItem.length; i++) {
        menuItem[i].onmouseenter = function() {
            this.className = "menuhover";
            // 原先已经有class就
            // this.className = this.className.concat(" menuhover");
        };
        menuItem[i].onmouseleave = function() {
            this.className = "";
            // 原先已经有class就
            // this.className = this.className.replace(" menuhover", "");
        }
    }
})();