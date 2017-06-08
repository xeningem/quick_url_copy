// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                html += node.outerHTML;
                break;
            case Node.TEXT_NODE:
                html += node.nodeValue;
                break;
            case Node.CDATA_SECTION_NODE:
                html += '<![CDATA[' + node.nodeValue + ']]>';
                break;
            case Node.COMMENT_NODE:
                html += '<!--' + node.nodeValue + '-->';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                // (X)HTML documents are identified by public identifiers
                html += "<!DOCTYPE "
                    + node.name
                    + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
                    + (!node.publicId && node.systemId ? ' SYSTEM' : '') 
                    + (node.systemId ? ' "' + node.systemId + '"' : '')
                    + '>\n';
                break;
        }
        node = node.nextSibling;
    }
    return html;
}

function GetCell( trs, i, j )
{
    return trs[i].getElementsByTagName("td")[j].innerText;
}

function LoadRevisionInfoFromTable( table )
{
    if ( tbody = table.getElementsByTagName("tbody")[0] )
    {
        var trs = tbody.getElementsByTagName("tr");
        return GetCell( trs, 1, 1);
    }
}

function getRevisionInfo(document_root) {
    var issues = document_root.getElementById("issue_actions_container");
    var tables = issues && issues.getElementsByTagName("table");
    var result = "";
    if (tables && tables.length > 0)
    {
        result += "\nRevisions:";
        for( var i = 0; i < tables.length; i++ ) {
            if ( rev_info = LoadRevisionInfoFromTable( tables[i] ) )
                result += " " + rev_info;
        }
    }
    return result;
}

function StringToSend(document_root, rules) {
    // TODO: Возмоность выбора порядка полей
    var url = window.location.href;
    var host = window.location.hostname
    var box = document_root.getElementById("copy-box");
    var title = ( box ? box.value : window.document.title ) 

    console.log(rules, url, host)

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
        console.log("replaced", rules, url, host)
    }

    var textMsg = title + "\n " + url;
    textMsg += getRevisionInfo(document_root);

    return textMsg;
}


chrome.storage.sync.get(['rules'], function(values) {
    // Notify that we saved.
    console.log('rules', values)
    chrome.extension.sendMessage({
        method: "getSource",
        source: StringToSend(document, values['rules'])
    });
});

