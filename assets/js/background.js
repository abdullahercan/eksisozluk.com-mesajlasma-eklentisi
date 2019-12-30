var domainUrl = "https://eksisozluk.com/";
var userAgent = "Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+";
var ba = chrome.browserAction;
var eksiCookie = {};
var login = false;

function getCookies() {
    var data = {};
    chrome.cookies.get({ "url": domainUrl, "name": "a" }, function (cookie) {
        if (cookie) {
            data.userData = cookie.value;
            login = true;
        }
    });
    return data;
}

eksiCookie = getCookies();

function setUnread(unreadItemCount) {
    ba.setBadgeBackgroundColor({ color: [255, 0, 0, 128] });
    if (unreadItemCount > 0) {
        ba.setBadgeText({ text: '' + unreadItemCount });
    } else {
        ba.setBadgeText({ text: '' });
    }
}

function checkMsgBox() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', domainUrl + 'mesaj');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var match = xhr.responseText.match(/<article\b[^>]*>(?:(?=([^<]+))\1|<(?!article\b[^>]*>))*?<\/article>/g),
                unreadCount = 0;
            if (match) {
                for (var i = 0; match.length > i; i++) {
                    var result = /<article class="unread">/g.exec(match[i]);
                    if (result) {
                        unreadCount++;
                    }
                }
            }
            setUnread(unreadCount);
        }
    };
    xhr.send();
}

setInterval(function () {
    if (login) {
        checkMsgBox();
    }
}, 5000);

checkMsgBox();

chrome.webRequest.onBeforeSendHeaders.addListener(function (info) {
    var headers = info.requestHeaders;
    var headerCheck = true;

    if (eksiCookie.userData === '') {
        headerCheck = false;
    }

    if (headerCheck) {
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i];
            if (header.name.toLowerCase() == 'x-requested-with') {
                headerCheck = false;
            }
        }
    }

    if (headerCheck) {
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i];
            if (header.name.toLowerCase() == 'referer') {
                if (!header.value.startsWith(domainUrl)) {
                    headerCheck = false;
                }
            }
            if (header.name.toLowerCase() == 'user-agent' && headerCheck) {
                header.value = userAgent;
            }
            if (header.name.toLowerCase() == 'cookie' && headerCheck) {
                var cookies = header.value;
                cookies = "a=" + eksiCookie.userData + ";";
                +cookies;
                header.value = cookies;
            }
        }
    }

    return { requestHeaders: headers };
}, {
    urls: ["*://*.eksisozluk.com/*"],
    types: ["xmlhttprequest"]
}, ["blocking", "requestHeaders"]);