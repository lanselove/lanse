function StudentSet() {
    // 集合元素的容器，以数组来表示
    this.elements = new Array();
}

// 判断集合是否为空
StudentSet.prototype.isEmpty = function() {
    return this.elements.length == 0;
}

// 添加一个新元素
StudentSet.prototype.add = function(obj) {
    if(obj == null) {
        return false;
    }

    this.elements.push(obj);
    return true;
}

// 删除一个元素
StudentSet.prototype.delete = function(obj) {
    if(obj == null) {
        return false;
    }

    for(var i=0; i<this.elements.length; i++){
        if(this.elements[i] == obj) {
            this.elements.splice(i-1, 1);     //delete elements[i]
            return true;
        }
    }
}

// 判断元素是否存在集合中
StudentSet.prototype.has = function(obj) {
    if(this.isEmpty()) {
        return false;
    }

    if(obj == null) {
        return false;
    }

    for(var i=0; i<this.elements.length; i++){
        if(this.elements[i] == obj){
            return true;
        }
    }

    return false;
}

//清空集合
StudentSet.prototype.clear = function() {
    this.elements = new Array();
}

var stuSet = new StudentSet();
var sb = {
    '姓名': '戴智豪',
    '年龄': 19
}
var hh = null;

stuSet.add(sb);
console.log(stuSet.has(sb));
stuSet.delete(sb);
console.log(stuSet.has(sb));


/* nodejs控制台输入
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {
    process.stdin.pause();
    res = chunk.trim();
});
*/