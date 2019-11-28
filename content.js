// console.log("Load content.js")

function load_option(local_storage, id, pref) {
    local_storage = local_storage || localStorage;
    var favorite = local_storage["favorite_" + id];
    if (!favorite) {
        return pref;
    }
    if (favorite == "none") return false;
    if (favorite == id) return true;

    return favorite;
}

var isOnCtrl = true
var isOnShift = false
var isOnAlt = true
var isWhichKey = "C"
var rules = {
    'www.dw.com': {
        host: "www.dw.com",
        titleReplace: "$1",
        titleSearch: "(.*) (\\| .*){3}",
        urlReplace: "$1/$3",
        urlSearch: "(http:\\/\\/www\\.dw\\.com\\/.*)\\/(.*)\\/(.*)"
    }
}

function isOn(isOnKey, key) {
    return (isOnKey == key)
}

function isCopyKey(event) {
    result = isOn(isOnCtrl, event.ctrlKey) && isOn(isOnShift, event.shiftKey) && isOn(isOnAlt, event.altKey) && (String.fromCharCode(event.which) == isWhichKey);

    return result
}

function restore_options(local_storage) {
    console.log("restore_options", local_storage);

    isOnCtrl = load_option(local_storage, "ctrlKey", true);
    isOnShift = load_option(local_storage, "shiftKey", false);
    isOnAlt = load_option(local_storage, "altKey", true);
    isWhichKey = load_option(local_storage, "whichKey", "C");

}

function getJiraTaskInfo(document_root) {
    var issueKeyVal = document_root.getElementById("issuekey-val")
    if (!issueKeyVal){
        return "";
    }

    var summaryVal = document_root.getElementById("summary-val")
    if (!summaryVal){
        return "";
    }

    var issue = issueKeyVal.children[0]


    return issue.textContent + " " + summaryVal.textContent + "\n" + issue.href;
}


function StringToSend(document_root, rules) {
    // TODO: Возмоность выбора порядка полей
    var url = window.location.href;
    var host = window.location.hostname
    var box = document_root.getElementById("copy-box");
    var title = ( box ? box.value : window.document.title )

    if(document_root.getElementById("jira") != null){
        var issue_info = getJiraTaskInfo(document_root)
        if(issue_info){
            return issue_info
        }
    } 


    if (rules && rules[host]){
        rule = rules[host]
        var re_url = new RegExp(rule.urlSearch)
        if (url.match(re_url)){
            url = url.replace(re_url, rule.urlReplace)
        }

        var re_title = new RegExp(rule.titleSearch)
        if (title.match(re_title)){
            title = title.replace(re_title, rule.titleReplace)
        }
    }

    var textMsg = title + "\n " + url;

    return textMsg;
}


document.addEventListener('keydown', function(event) {
    // Ctrl+Alt+C
    if (isCopyKey(event)) {
        // Dispatch a custom message, handled by your extension
        // console.log("Keydown:" + event + " " + event.which);


        var textToSend = StringToSend(document, null)

        navigator.clipboard.writeText(textToSend)
          .catch(err => {
            // This can happen if the user denies clipboard permissions:
            console.error('Could not copy text: ', err);
          });
    }
},
true); // <-- True is important

chrome.runtime.sendMessage({ method: "requestLocalStorage" });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log(request);
    if (request.method == "responseLocalStorage" ) {
        var l_s = request.local_storage;
        if (  l_s["saved"] )
        {
            restore_options(l_s);
        }

}
});

 chrome.storage.sync.get(['rules'], function(values) {
    if(!values["rules"]){
         chrome.storage.sync.set({'rules': rules}, function(values) {
        });
    }

        });

// Нужно добавить сохранение tab.id для того, чтобы при сохранении настроек
// обновлять вкладки
