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
    'dw.com': {
        host: "dw.com",
        titleReplace: "$1",
        titleSearch: "(.*) (\\| .*){3}",
        urlReplace: "$1/$3",
        urlSearch: "(.*)\/(.*)\/(.*)"
    },
    'medium.com': {
        host: "medium.com",
        urlReplace: "$1/$3",
        urlSearch: "(.*)\/(.*)(-(?:.(?!-))+)$"
    },
    'trello.com': {
        host: "trello.com",
        titleReplace: "$1",
        titleSearch: "(.*) \\| (.*)",
        urlReplace: "$1/$2",
        urlSearch: "(.*)\/(.*)\/(.*)"
    },
    'youtube.com': {
        host: "youtube.com",
        titleReplace: "$1",
        titleSearch: "^(?:\(.*\) )?(.*)(?:- YouTube)$",
    },
}

function isOn(isOnKey, key) {
    return (isOnKey == key)
}

function isCopyKey(event) {
    console.log("event.which", event.which, event);     
    result = isOn(isOnCtrl, event.ctrlKey) && isOn(isOnShift, event.shiftKey) && (isOn(isOnAlt, event.metaKey) || isOn(isOnAlt, event.altKey)) && (String.fromCharCode(event.which) == isWhichKey);
    return result
}

function restore_options(local_storage) {
    console.log("restore_options", local_storage);

    isOnCtrl = load_option(local_storage, "ctrlKey", true);
    isOnShift = load_option(local_storage, "shiftKey", false);
    isOnAlt = load_option(local_storage, "altKey", true);
    isWhichKey = load_option(local_storage, "whichKey", "C");

}



document.addEventListener('keydown', function(event) {
    // Ctrl+Alt+C
    if (isCopyKey(event)) {
        // Dispatch a custom message, handled by your extension
        // console.log("Keydown:" + event + " " + event.which);


        var textToSend = StringToSend(document, rules)

        if (navigator.clipboard){
        navigator.clipboard.writeText(textToSend)
          .catch(err => {
            // This can happen if the user denies clipboard permissions:
            console.error('Could not copy text: ', err);

          });
      }else{
        chrome.runtime.sendMessage({
                method: "backgroundCopy",
                text: textToSend
        });
      }
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
