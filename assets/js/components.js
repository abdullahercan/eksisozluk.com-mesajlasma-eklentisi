function getListId(data) {
    var result = /<input type="checkbox" name="threadId" value="(.*?),(.*?)" \/>/g.exec(data);

    if (result == null)
        return false;

    return result[1];
}

function getUserName(data) {
    var result = /<h2>(.*?)<small>(.*?)<\/small><\/h2>/g.exec(data);

    if (result == null)
        return false;

    return result[1].trim();
}

function getMessage(data) {
    var result = /<p\b[^>]*>(?:(?=([^<]+))\1|<(?!p\b[^>]*>))*?<\/p>/g.exec(data);

    if (result == null)
        return false;

    return result[1].trim();
}

function getMessageStatus(data) {
    var result = /<article class="unread">/g.exec(data);
    return result == null ? false : true;
}

function getDate(data) {
    var result = /<time datetime="(.*?)" title="(.*?)">(.*?)<\/time>/g.exec(data);

    if (result == null)
        return false;

    return {
        date: result[1],
        display: result[3],
    };
}

function getMessageList(data) {
    var match = data.match(/<article\b[^>]*>(?:(?=([^<]+))\1|<(?!article\b[^>]*>))*?<\/article>/g);

    var msgListData = [];
    for (let i = 0; i < match.length; i++) {
        var msgData = {
            id: getListId(match[i]),
            unread: getMessageStatus(match[i]),
            userName: getUserName(match[i]),
            message: getMessage(match[i]),
            date: getDate(match[i])
        };

        msgListData.push(msgData);
    }

    return msgListData;
}

function renderListView(data) {

    var listView,
        listViewItem;

    listView = document.createElement("ul");
    listView.className = "msgList";

    for (var i = 0; data.length > i; i++) {

        // listViewItem
        listViewItem = document.createElement("li");
        if (data[i].unread) {
            listViewItem.className = "unread";
        }

        //profilePic
        profilePic = document.createElement("div");
        profilePic.className = "profilePic";
        profilePic.innerHTML = "<i></i>";

        //listMeta
        listMeta = document.createElement("div");
        listMeta.className = "listMeta";

        //listHead
        listHead = document.createElement("div");
        listHead.className = "listHead";

        //userName
        userName = document.createElement("div");
        userName.className = "userName";
        userName.innerHTML = data[i].userName;

        //date
        date = document.createElement("div");
        date.className = "date";
        date.innerHTML = data[i].date.display;

        //message
        message = document.createElement("div");
        message.className = "message";
        message.innerHTML = data[i].message;

        listHead.appendChild(userName);
        listHead.appendChild(date);
        listMeta.appendChild(listHead);
        listMeta.appendChild(message);
        listViewItem.appendChild(profilePic)
        listViewItem.appendChild(listMeta)

        listView.appendChild(listViewItem);
    }

    return listView;
}

function renderContainer(data) {
    var container = document.getElementById("container");
    container.appendChild(renderListView(data));
}