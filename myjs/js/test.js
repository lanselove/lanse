var box = document.getElementById("box");

box.addEventListener("click", function() {
    superagent.get('http://fm.taihe.com/dev/api/').query({
        tn: 'playlist',
        id: 'public_tuijian_ktv'
    }).end(function (error, response) {
        if (error) return;
        console.log(response);
    });
});

// http://fm.taihe.com/dev/api/?tn=playlist&id=public_tuijian_ktv&hashcode=3ac0f90fa4cc63b1085d7de7f6f98b32&_=1535037869250
/*
box.addEventListener("click", function() {
    superagent.post('http://www.kugou.com/yy/index.php').query({
        r: 'play/getdata',
        hash: "AE866A5C526E4183E84C93088F428B3B"
    }).end(function (error, response) {
        if (error) return;
        console.log(response);
    });
});
*/

/*
box.addEventListener("click", function() {
    superagent.get('https://jirenguapi.applinzi.com/fm/getSong.php').query({
        "channel": "public_tuijian_ktv"
    }).end(function (error, response) {
        if (error) return;
        console.log(response);
    });
});
*/


// console.log(new Date().getTime());

/*
var test = {
    name: '戴智豪dzh',
    info: '20个江南'
};
// 中文转unicode
var strU = JSON.stringify(test).replace(/[\u4e00-\u9fa5]/g, function(str) {
    return '\\u' + str.charCodeAt(0).toString(16);  // 如 江 南 转换成 \u6c5f 和 \u5357
});
console.log(strU);

// unicode转中文
var strZ = strU.replace(/\\u+.{4}/g, function(str) {
    return String.fromCharCode(parseInt(str.slice(-4), 16).toString(10));   // 如 \u6c5f 和 \u5357 转换成 江 和 南
});
console.log(strZ);

// 字符串转对象时，unicode会自动转中文
console.log(JSON.parse(strU));
*/