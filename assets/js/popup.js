function requestMsg() {

    if (eksiCookie.userData == null) {
        window.open("https://eksisozluk.com/giris", '_blank');
        return false;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', domainUrl + 'mesaj');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var list = getMessageList(xhr.responseText),
                unreadCount = 0;
            list.forEach(function (a, b) {
                if (a.unread) {
                    unreadCount++;
                }
            });
            renderContainer(list);
        }
    };
    xhr.send();
}

function init() {
    requestMsg();
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});