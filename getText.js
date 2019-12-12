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

    // Remove UTM marks
    var url_obj = new URL(window.location.href);
    var utm_marks = ["fbclid", "utm_campaign", "utm_medium", "utm_source"];
    for (var i = 0; i < utm_marks.length; i++) {
        url_obj.searchParams.delete(utm_marks[i]);
    }

    var url = url_obj.toString();

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

    var textMsg = title + " \n" + url;

    return textMsg;
}
