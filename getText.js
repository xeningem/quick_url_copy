function getJiraTaskInfo(document_root) {
    var issues = document.querySelectorAll('div.ghx-selected')
    if (issues.length > 0)
    {
        var x = issues[0]
        var ghxIssueKey = x.attributes["data-issue-key"]?.textContent
        var ghxSummary = x.querySelector(".ghx-summary")?.textContent
        var ghxIssueLink = x.querySelector("a")?.href
        return "[" + ghxIssueKey+ "] " + ghxSummary + "\n" + ghxIssueLink;
    }


    var issueKeyVal = document_root.getElementById("issuekey-val")
    if (!issueKeyVal){
        return "";
    }

    var summaryVal = document_root.getElementById("summary-val")
    if (!summaryVal){
        return "";
    }

    var issue = issueKeyVal.children[0]


    return "[" + issue.textContent + "] " + summaryVal.textContent + "\n" + issue.href;
}

function export2csv(tableElement, separator=',', firstColumn=null) {
    let data = "";
    const tableData = [];
    const rows = tableElement.querySelectorAll("tr");
    let i = 0;
    for (const row of rows) {
      const rowData = [];
      if (firstColumn){
          if (i == 0){
            rowData.push('"' + firstColumn + '+');
        }
      }
      for (let [index, column] of row.querySelectorAll(" td").entries()) {
          if (column.querySelector("nobr")){
              column = column.querySelector("nobr");
          }

          if (column.innerText.includes(",")) {
            rowData.push('"' + column.innerText + '"');
          } else {
            rowData.push(column.innerText);
          }
  
      }
      if (rowData.length==0){
          continue; 
      }
      tableData.push(rowData.join(separator));
    }
    data += tableData.join("\r\n");
    return data;
}

function getCikInfo(document_root, title, url) {
    var row_info = document_root.querySelector("body > table:nth-child(3) > tbody > tr:nth-child(1) > td")
    if (row_info)
    {
        return title + ': ' + row_info.textContent.trim() + "\n" + url;
    }

    return ""
}


function StringToSend(document_root, rules, izbirkomMode) {
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
    var utm_marks = ["fbclid", "utm_campaign", "utm_medium", "utm_source", "utm_term", "utm_content", "utm_term", ];
    for (var i = 0; i < utm_marks.length; i++) {
        url_obj.searchParams.delete(utm_marks[i]);
    }

    if (url.includes(".izbirkom.ru")){
        console.log("THIS IS IZBIRKOM", izbirkomMode);
        var textResult =  ""
        const pageBreadCrumbs = Array.from(document.querySelectorAll("ul.breadcrumb > li"))?.slice(1)?.map(x=> x.textContent)?.join(" - ")?.replace(/(\r\n|\n|\r|\t|\u2002⁄\u2002)/gm, "") 
        if (izbirkomMode == 0 || izbirkomMode == 1){
            textResult = (pageBreadCrumbs || title) + " \n" + url; 
        }

        if (izbirkomMode == 0){
            return textResult;
        }

 
        if (izbirkomMode == 1){
            const electionDate = Array.from(document.querySelectorAll('td'))
            ?.find(el => el.textContent.includes('Дата голосования'))?.textContent || "";

            const commisionInfo = document.querySelector('td[width="30%"]')?.parentElement?.textContent || "";

            textResult += " \n" + commisionInfo.replace(/(\r\n|\n|\r)/gm, " ") 
            + " \n" + electionDate.replace(/(\r\n|\n|\r)/gm, " ") + " \n";
        }

        var cikDataTable = document.querySelector("div.table-responsive > table");
        if (cikDataTable){
            textResult += export2csv(cikDataTable, '\t');
        }

        var cikFixedColumnsDataTable = document.querySelector("table.table-fixed-columns");
        if (cikFixedColumnsDataTable){
            textResult += export2csv(cikFixedColumnsDataTable, '\t');
        }

        return textResult;
    }


    var url = url_obj.toString();
    var host_test = host.replace('www.', '')

    if (rules && rules[host_test]){
        var rule = rules[host_test]
        if (rule.urlSearch){
            var re_url = new RegExp(rule.urlSearch)
            if (url.match(re_url)){
                url = url.replace(re_url, rule.urlReplace)
            }
        }

        if (rule.titleSearch){
            var re_title = new RegExp(rule.titleSearch)
            if (title.match(re_title)){
                title = title.replace(re_title, rule.titleReplace)
            }
        }
    }

    var textMsg = title + " \n" + url;
    return textMsg;
}
