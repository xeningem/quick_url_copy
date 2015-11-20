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

function StringToSend(document_root) {
    // TODO: Возмоность выбора порядка полей
    var url = window.location.href;
    var box = document_root.getElementById("copy-box");
    
    textMsg = ( box ? box.value : window.document.title ) + "\n " + url;
    var issues = document_root.getElementById("issue_actions_container");
    if ( issues )
    {
        textMsg += "\nRevisions:";
        var tables = issues.getElementsByTagName("table");
        for( var i = 0; i < tables.length; i++ ) {
            if ( rev_info = LoadRevisionInfoFromTable( tables[i] ) )
                textMsg += " " + rev_info;
        }
    }
    return textMsg;
}

chrome.extension.sendMessage({
    method: "getSource",
    source: StringToSend(document)
});



