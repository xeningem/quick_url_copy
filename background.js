function copy_text() {
    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    },
    function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.extension.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
            console.error(message.innerText);
        }
    }); 
}

chrome.browserAction.onClicked.addListener(function(tab) {
    //console.log("chrome.browserAction.onClicked");
    chrome.runtime.sendMessage({
        method: "backgroundCopy"
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    if (!method)
    {
        console.error( "Failed request", request, sender, sendResponse);
        return;
    }

    //console.log("background.js: " + (sender.tab ?  "tab.id: " + sender.tab.id  : "from the extension") + "; Method: " + method );

    if (method == "backgroundCopy")
        copy_text();

    if (method == "requestLocalStorage" ) {
        if ( sender.tab && sender.tab.id )
            chrome.tabs.sendMessage(sender.tab.id,{ method: "responseLocalStorage", local_storage: localStorage });
        else
             console.error( "Failed method:", method, ";Sender:", sender);
    }

    if (method == "getSource") {
        message.innerText = request.source;
        //Give the text element focus
        message.focus();

        document.execCommand('SelectAll');
        document.execCommand("Copy", false, null);
        //console.log("Copy finished");
    }
});

