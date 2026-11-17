var appHelper = function appHelper() {


}





/* 
播放聲音
*/
appHelper.playSound = function (url) {
    var audio = new Audio(url);
    audio.play();
}


/*
將時間差轉成 00:00:21 的顯示格式
*/
appHelper.timeToHHMMSS = function (ts) {
    ts = ts / 1000;
    var h = Math.round(ts / 60 / 60);
    if (h < 10) h = "0" + h;
    var m = Math.round(ts / 60) % 60;
    if (m < 10) m = "0" + m;
    var s = Math.round(ts) % 60;
    if (s < 10) s = "0" + s;
    return h + ":" + m + ":" + s;
};

/*
將時間轉成 09:42:51.482 的顯示格式
*/
appHelper.dateToHHMMSSFFF = function (d) {

    var h = d.getHours();
    if (h < 10) h = "0" + h;

    var m = d.getMinutes();
    if (m < 10) m = "0" + m;
    
    var s = d.getSeconds();
    if (s < 10) s = "0" + s;

    var f = (d.getMilliseconds() / 1000).toFixed(3);
    f = f.substr(f.indexOf('.'));

    return h + ":" + m + ":" + s + f;
};

/*
將時間轉成 09:42:51 的顯示格式
*/
appHelper.dateToHHMMSS = function (d) {

    var h = d.getHours();
    if (h < 10) h = "0" + h;

    var m = d.getMinutes();
    if (m < 10) m = "0" + m;

    var s = d.getSeconds();
    if (s < 10) s = "0" + s;
    
    return h + ":" + m + ":" + s;
};

/*
將時間轉成不同時間部分的補零字串物件, 欄位: year, month, day, hour, minute, second, millisecond
*/
appHelper.dateTimeToPaddingObject = function (d) {

    var YYYY = d.getFullYear();

    var MM = d.getMonth() + 1;
    if (MM < 10) MM = "0" + MM;

    var DD = d.getDate();
    if (DD < 10) DD = "0" + DD;

    var hh = d.getHours();
    if (hh < 10) hh = "0" + hh;

    var mm = d.getMinutes();
    if (mm < 10) mm = "0" + mm;

    var ss = d.getSeconds();
    if (ss < 10) ss = "0" + ss;

    var fff = d.getMilliseconds;
    if (fff < 10) {
        fff = "00" + fff;
    } else if (fff < 100) {
        fff = "0" + fff;
    }

    var o = {
        year: YYYY.toString(),
        month: MM.toString(),
        day: DD.toString(),
        hour: hh.toString(),
        minute: mm.toString(),
        second: ss.toString(),
        millisecond: fff.toString()
    };

    return o;
}


/*
 取亂數 min 到 max
*/
appHelper.getRnd = function (min, max) {
    var v = Math.floor(Math.random() * (max - min + 1)) + min;
    return v;
}

/*
 取亂數 min 到 max
*/
appHelper.getRndFloat = function (min, max) {
    var v = Math.random() * (max - min) + min;
    return v;
}

/*
 產生一個根據高精度時間產生的隨機 GUID
*/
appHelper.createGuid = function () {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


/*
HTML5 Canvas 的 requestAnimationFrame 相容多瀏覽器版
*/
appHelper.requestAnimationFrame = function (cb) {
    var func = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
        };
    return func(cb)
};

/*
HTML5 Canvas 的 cancelAnimationFrame 相容多瀏覽器版
*/
appHelper.cancelAnimationFrame = function (handlerId) {
    var func = window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        };
    func(handlerId);
};

appHelper.enabledFullScreen = function (enabled) {

    var isFullScreen = window.innerHeight == screen.height;
    if (typeof (enabled) == "undefined") {
        return isFullScreen;
    }

    if (enabled) {
        // Enabled FullScreen
        var doc = window.document;
        var docEl = doc.documentElement;
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
    }
    else {
        // Cancel FullScreen
        var doc = window.document;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        cancelFullScreen.call(doc);
    }

    return isFullScreen;
}

// 將 Image 轉成 DataURL
// outputFormat 預設 : image/jpeg (選項)
// level 為圖片品質, 其值為 : 0.00 ~ 1.00 (選項)
// targetWidth 轉換後的圖片寬度 (選項)
// targetHeight 轉換後的圖片高度 (選項)
// isZoom 是否使用 Zoom 功能, 設定為 true 時, targetWidth 與 targetHeight 必須要指定, 此時圖片寬高不一定填滿 targetWidth 或 targetHeight
appHelper.imageToDataUrl = function (image, outputFormat, level, targetWidth, targetHeight, isZoom) {

    if (typeof (outputFormat) == "undefined")
        outputFormat = "image/jpeg";

    var canvas = document.createElement('CANVAS');
    var g = canvas.getContext('2d');
    var dataUrl = null;

    var w = image.naturalWidth;
    var h = image.naturalHeight;
    if (typeof (targetWidth) != "undefined") {
        w = targetWidth;
        h = image.naturalHeight * targetWidth / image.naturalWidth;
    }

    if (typeof (targetHeight) != "undefined") {
        h = targetHeight;
        w = image.naturalWidth * targetHeight / image.naturalHeight;
    }

    if (typeof (targetWidth) != "undefined" && typeof (targetHeight) != "undefined") {
        w = targetWidth;
        h = targetHeight;
    }

    if (isZoom == true && typeof (targetWidth) != "undefined" && typeof (targetHeight) != "undefined") {
        w = targetWidth;
        h = image.naturalHeight * targetWidth / image.naturalWidth;
        if (h > targetHeight) {
            h = targetHeight;
            w = image.naturalWidth * targetHeight / image.naturalHeight;
        }
    }

    canvas.width = w;
    canvas.height = h;
    g.drawImage(image, 0, 0, w, h);

    if (typeof (level) == "undefined") {
        dataUrl = canvas.toDataURL(outputFormat);
    } else {
        dataUrl = canvas.toDataURL(outputFormat, level);
    }

    return dataUrl;
}

// 將 DataUrl 轉成 Image
appHelper.dataUrlToImage = function (dataUrl, callback) {
    var img = document.createElement("IMG");

    var imgOnLoad = (function (img, cb) {
        var inner_callback = cb;
        var inner_img = img;
        return function () {
            inner_callback(inner_img);
        }
    })(img, callback);

    img.onload = imgOnLoad;
    img.src = dataUrl;
}

appHelper.numberToSizeString = function (size) {

    if (size < 1024) {
        return size + " B";
    }

    if (size >= 1024 && size < 1024 * 1024) {
        var s = size / 1024;
        return s.toFixed(2) + " KB";
    }

    var str = (size / 1024 / 1024).toFixed(2) + " MB";
    return str;
}


appHelper.showToast = function(message, duration = 3000) {
    // 1. 自動注入 CSS 樣式 (修改為頂部定位)
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
      .toast-box {
        position: fixed; top: 50px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.85); color: white; padding: 10px 20px;
        border-radius: 8px; z-index: 10000; font-family: sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: toast-top-in 0.4s, toast-top-in 0.4s reverse ${duration / 1000 - 0.4}s forwards;
      }
      @keyframes toast-top-in { 
        from { opacity: 0; top: 0; } 
        to { opacity: 1; top: 50px; } 
      }
    `;
        document.head.appendChild(style);
    }

    // 2. 建立並顯示 Toast
    const toast = document.createElement('div');
    toast.className = 'toast-box';
    toast.innerText = message;
    document.body.appendChild(toast);

    // 3. 時間到自動移除
    setTimeout(() => toast.remove(), duration);
}


appHelper.htmlEncode = function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

appHelper.htmlDecode = function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

// 從目前 window 的 URL 取出參數值
appHelper.getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    var sParameterName;
    var i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            // Some iOS not support decodeURIComponent() in CHINESE WORD
            //return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            return sParameterName[1] === undefined ? true : unescape(sParameterName[1]);
        }
    }
};

/*
檢查目前瀏覽器是否為 FireFox
*/
appHelper.isFireFox = function () {
    var isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isFireFox;
}

/*
檢查目前裝置是否為 iOS
*/
appHelper.isIOS = function () {

    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

/*
比對來源字串, 前面是否有某個字串
*/
appHelper.stringStartsWith = function (source, startWith) {

    if (source.substring(startWith, startWith.length) === startWith) {
        return true;
    }

    return false;
}

/*
使用空白字元, 切割出多個 token
*/
appHelper.stringSpaceSplit = function (data) {
    var str = data.trim();                  // 截掉頭尾空白
    var str = str.replace(/\s\s+/g, ' ');   // 將多個空白併成一個
    var tokenList = str.split(' ');
    return tokenList;
}

/*
使用空白字元, 切割出多個 token, 並且支援雙引號    
*/
appHelper.parseToken = function (content) {
    // Ex:
    // FUNC 速度 " $$距離$$ / $$時間$$ "
    // => ["FUNC", "速度", " $$距離$$ / $$時間$$ "]

    var list = [];
    var index = 0;
    var begin = false;
    var quoteChar = "";
    var token = "";
    while (index < content.length) {
        var ch = content[index];

        // 如果還沒有 capture token
        if (begin == false) {
            if (ch != ' ' && ch != '\t' && ch != '\"') {
                begin = true;
                quoteChar = "";
                token = ch;
            }

            if (ch == ' ' || ch == '\t') {
            }

            if (ch == "\"") {
                begin = true;
                quoteChar = '\"';
            }

            index++;
            continue;
        }

        // 如果已經開始 capture token
        if (begin == true) {

            // 雙引號擷取
            if (quoteChar == '\"') {
                if (ch != '\"') {
                    token += ch;
                }

                // 碰到 ["] 結束擷取
                if (ch == '\"') {
                    list.push(token);
                    begin = false;
                    quoteChar = "";
                    token = "";
                }
                index++;
                continue;
            }

            // 一般擷取
            if (quoteChar == "") {
                if (ch != ' ' && ch != '\t' && ch != '\"') {
                    token += ch;
                }

                // 碰到空白 結束擷取
                if (ch == ' ' || ch == '\t') {
                    list.push(token);
                    begin = false;
                    token = "";
                }

                // 碰到 ["] 結束擷取, 並開始新的擷取
                if (ch == '\"') {
                    list.push(token);
                    token = "";
                    begin = true;
                    quoteChar = '\"';
                }

                index++;
                continue;
            }
        }
    }

    // 如果是最後的 Token
    if (token != "")
        list.push(token);

    return list;
}




// 儲存 StockPackage
appHelper.saveStockPackage = function(o) {
    // savedData:
    //{
    //    "twStockIdList": [
    //        "t00",
    //        "2330"
    //    ],
    //    "stockQIdList": [
    //        "美元/台幣"
    //    ],
    //    "lastTime": "2026-02-05T02:07:56.897Z",
    //    "data": [
    //        {
    //            "DataSource": "TwStock",
    //            "StockId": "t00",
    //            "StockName": "發行量加權股價指數",
    //            "CurrentPrice": 31871.69,
    //            "PreviousClosePrice": 32289.81
    //        },
    //        {
    //            "DataSource": "TwStock",
    //            "StockId": "2330",
    //            "StockName": "台積電",
    //            "CurrentPrice": 1760,
    //            "PreviousClosePrice": 1785
    //        },
    //        {
    //            "DataSource": "StockQ",
    //            "StockId": "美元/台幣",
    //            "StockName": "美元/台幣",
    //            "CurrentPrice": 31.644,
    //            "PreviousClosePrice": 31.682
    //        }
    //    ],
    //    "autoUpdate": 300,
    //    scheduleList: [
    //        { itemName: "吃飯通知", triggerTime: "11:50", autoClose: false, itemText: "準備該吃飯囉, 吃飯前先去上廁所一下 !", lastTriggerTime: "2026-02-11T01:50:49.458Z" }
    //   ]
    //}
    
    var json = JSON.stringify(o);
    localStorage.setItem("ALLSTOCK_SAVE1", json);
}

// 讀取 StockPackage
appHelper.loadStockPackage = function() {
    var stockPackage = {};
    try {
        var json = localStorage.getItem("ALLSTOCK_SAVE1");
        var o = JSON.parse(json);

        if (typeof (o.lastTime) != "undefined") {
            // 解序列化 lastTime 屬性
            o.lastTime = new Date(o.lastTime);
        }

        // 解序列化 scheduleList 裡的 lastTriggerTime 屬性
        if (typeof (o.scheduleList) != "undefined") {
            for (var i = 0; i < o.scheduleList.length; i++) {
                var item = o.scheduleList[i];
                item.lastTriggerTime = new Date(item.lastTriggerTime);
            }
        }


        stockPackage = o;

    } catch (e) {
    }

    return stockPackage;
}


appHelper.validTimeFormat = function(str) {
    // 檢查時間格式是否錯誤
    // 合法的時間 H:M , Ex: 9:4,09:04,15:1,23:10
    // 非法回傳 "", 合法回傳補 0 的日期格式, Ex: 10:05

    var items = str.split(':');
    if (items.length != 2)
        return "";

    var HH = parseInt(items[0], 10);
    var MM = parseInt(items[1], 10);
    if (isNaN(HH) || isNaN(MM))
        return "";

    if (HH < 0 || HH > 23)
        return "";
    if (MM < 0 || MM > 59)
        return "";

    if (HH < 10) HH = "0" + HH;
    if (MM < 10) MM = "0" + MM;

    var t = HH + ":" + MM;
    return t;
}


appHelper.validDateFormat = function (str) {
    // 檢查時間格式是否錯誤
    // 合法的日期 Y/M/D, Ex: 2026/3/6, 2026/03/07
    // 非法回傳 "", 合法回傳補 0 的日期格式, Ex: 2026/03/06

    var items = str.split('/');
    if (items.length != 3)
        return "";

    var YYYY = parseInt(items[0], 10);
    var MM = parseInt(items[1], 10);
    var DD = parseInt(items[2], 10);

    if (isNaN(YYYY) || isNaN(MM) || isNaN(DD))
        return "";

    if (YYYY < 1)
        return "";
    if (MM < 1 || MM > 12)
        return "";
    if (DD < 1 || DD > 31)
        return "";

    var d0 = new Date(YYYY + "/" + MM + "/" + DD);

    var D_YYYY = d0.getFullYear();
    var D_MM = d0.getMonth() + 1;
    var D_DD = d0.getDate();

    if (D_MM < 10) D_MM = "0" + D_MM;
    if (D_DD < 10) D_DD = "0" + D_DD;

    var dStr = D_YYYY + "/" + D_MM + "/" + D_DD;

    return dStr;
}


appHelper.validDateTimeFormat = function (str) {
    // 檢查是否合乎日期加時間的格式
    // 合法的時間:  Y/m/D H:M (Ex: 2026/3/5 8:2)
    // 非法回傳 "", 合法回傳補 0 的日期時間格式, Ex: 2026/03/05 08:02)

    // 先去除多餘的空白，只留一個，並去除頭尾空白
    str = str.replace(/\s+/g, ' ').trim();

    var items = str.split(' ');
    if (items.length != 2)
        return "";

    var dateStr = items[0]; // 取出日期部分
    var timeStr = items[1]; // 取出時間部分

    var date = appHelper.validDateFormat(dateStr);
    var time = appHelper.validTimeFormat(timeStr);

    if (date == "" || time == "")
        return "";

    var str = date + " " + time;

    return str;
}



// 檢查現在的時間是否應該要觸發通知
appHelper.checkNotifyTrigger = function(now, timeString, lastTriggerTime) {

    if (typeof (lastTriggerTime) != "undefined" && lastTriggerTime != null && lastTriggerTime != "") {
        var lastTime = lastTriggerTime;

        // 必須是已經觸發過，才能檢查日期
        if (lastTime.getTime() != 0) {

            // 檢查 YYY/MM/DD 的 DD 是否相同，來當作當天是否已經顯示過通知 (雖然隔月可能有誤判斷的可能，不過在這邊不重要)
            if (now.getDate() == lastTime.getDate()) {
                return false;
            }
        }
    }

    // 如果是 DateTime 格式(直接比對現在時間是否超過觸發時間, 超過就觸發)
    var dateTime = appHelper.validDateTimeFormat(timeString);
    if (dateTime != "") {

        // 如果已經觸發過，則不觸發(除非使用者把最後觸發時間清除)
        if (typeof (lastTriggerTime) != "undefined" && lastTriggerTime != null && lastTriggerTime != "") {
            return false;
        }

        var d1 = new Date(dateTime);
        if (now.getTime() > d1.getTime()) {
            return true;
        }
        return false;
    }
        

    // 計算通知的時間在一天中的分鐘數
    var notifyMinute = 0;
    var items = timeString.split(':');
    if (items.length == 2) {
        var HH = parseInt(items[0], 10);
        var MM = parseInt(items[1], 10);
        if (!isNaN(HH) && !isNaN(MM)) {
            notifyMinute = HH * 60 + MM;
        }
    }

    var nowMinute = now.getHours() * 60 + now.getMinutes();

    // 如果現在時間大於等於通知時間，則觸發
    if (nowMinute >= notifyMinute)
        return true;

    return false;
}

// 顯示通知
appHelper.showNotify = function (title, body, autoClose) {


    var notify = new Notification(title, {
        body: body,
        tag: title,
        renotify: true,
        requireInteraction: true,
        silent: false
    });

    notify.onclick = function () {
        notify.close();
    }

    if (autoClose == true) {
        // 10 秒後關閉通知
        setTimeout(function () {
            notify.close();
        }, 10 * 1000);
    }

}


