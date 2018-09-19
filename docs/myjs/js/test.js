var box = document.getElementById("box");
var data = document.getElementById("data");
var GetRadiosonglist = function(msg) {
    console.log(msg);
};
var MusicJsonCallback = function(msg) {
    console.log(msg);
};
var MusicJsonCallback_lrc = function(msg) {
    console.log(msg);
};

function getRadio(radio_id) {
    $.ajax({
        url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Referer', 'https://y.qq.com/portal/player_radio.html');
        },
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        type: 'get',
        data: {
            platform: 'yqq',
            format: 'jsonp',
            callback: 'GetRadiosonglist',
            data: '{"songlist":{"module":"pf.radiosvr","method":"GetRadiosonglist","param":{"id":' + radio_id + ',"firstplay":1,"num":10}}}'
        }
    });
}

// 获取歌曲vkey，必须设置callback（callback指定的是处理数据的函数）因为jsonp请求返回的状态是失败
function getSong(mid) {
    $.ajax({
        url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Referer', 'https://y.qq.com/portal/player_radio.html');
        },
        dataType: 'jsonp',
        jsonp: 'jsonpCallback',
        type: 'get',
        data: {
            platform: 'yqq',
            format: 'json',
            callback: 'MusicJsonCallback',
            cid: 205361747,
            songmid: mid,
            filename: 'C100004JaCzc1KhTrU.m4a',
            guid: 6336189520
        }
    });
}

function getLyric(mid) {
    $.ajax({
        url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Referer', 'https://y.qq.com/portal/player_radio.html');
        },
        dataType: 'jsonp',
        jsonp: 'callback',
        type: 'get',
        data: {
            platform: 'yqq',
            format: 'jsonp',
            jsonpCallback: 'MusicJsonCallback_lrc',
            songmid: mid,
            pcachetime: new Date().getTime()
        }
    });
}

box.addEventListener("click", function() {
    getRadio('199');
    // getSong('002I1e2r3xAxtv');
    getLyric('002I1e2r3xAxtv');
});



/*
box.addEventListener("click", function() {
    superagent.get('http://fm.taihe.com/dev/api/').query({
        tn: 'playlist',
        id: 'public_tuijian_ktv'
    }).end(function (error, response) {
        if (error) return;
        console.log(response);
    });
});
*/

// console.log(new Date().getTime());

/*
var test = {
    name: '儒道释dzh',
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