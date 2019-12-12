chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var method = request.method;
    var text = request.text;
    if (!method)
    {
        console.error( "Failed request", request, sender, sendResponse);
        return;
    }

    //console.log("background.js: " + (sender.tab ?  "tab.id: " + sender.tab.id  : "from the extension") + "; Method: " + method );

    if (method == "backgroundCopy")
        {
            message.innerText = request.text;
            //Give the text element focus
            message.focus();

            document.execCommand('SelectAll');
            document.execCommand("Copy", false, null);
        }

    if (method == "requestLocalStorage" ) {
        if ( sender.tab && sender.tab.id )
            chrome.tabs.sendMessage(sender.tab.id,{ method: "responseLocalStorage", local_storage: localStorage });
        else
             console.error( "Failed method:", method, ";Sender:", sender);
    }
});

