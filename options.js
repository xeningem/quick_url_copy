var options = ["ctrlKey", "altKey", "shiftKey", "whichKey"]

// Saves options to localStorage.
function get_selector( id )
{
    var select = document.getElementById( id );
    var value = select.children[select.selectedIndex].value;
    return value;
}

function set_selector( id, favorite )
{
    var select = document.getElementById( id );

    for (var i = 0; i < select.children.length; i++) {
        var child = select.children[i];
        if (child.value == favorite) {
            child.selected = "true";
            break;
        }
    }
}

function save_option(opts, id)
{
    opts[id ] = get_selector( id );
}

function load_option(opts, id)
{
    var favorite = opts[id];
    if (!favorite) {
        return;
    }
    set_selector( id, favorite )
}


function save_options() {
    var opts = {};
    for (var i = 0; i < options.length; i++) {
        var id = options[i]
            // console.log("i:" + i + " = " + id )
            save_option(opts, id)
    }
    opts["rules"] = load_rules()
    opts["saved"] = true

    localStorage["quick_url_copy"] = JSON.stringify(opts, null, '\t');
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var jsonOpts = localStorage["quick_url_copy"];
    if(!jsonOpts) {
        return;
    }
    var opts = JSON.parse(jsonOpts);
    for (var i = 0; i < options.length; i++) {
        var id = options[i];
        load_option(opts, id)
    }
    var rules = opts["rules"]
    if (rules){
        [].forEach.call(rules, restore_rule)
    }
}

function restore_rule(rule)
{
    var el = add_new_rule()
    var elems = el.querySelectorAll('input');
    [].forEach.call(elems, function(obj) {
        obj.value = rule[obj.name]
    });
}

function add_new_rule(){
    var defRule = document.getElementById("defaultRule");
    var c = defRule.children[0].cloneNode(true);
    var rulesNodes = document.querySelector('#rules');
    var child = rulesNodes.appendChild(c.cloneNode(true));
    child.querySelector('.deleteRule').addEventListener('click', delete_rule);
    return child;
}

function load_rules()
{
    var rules = [];
    var loadRule = function(el){
        var elems = el.querySelectorAll('input');
        var dict = {};

        [].forEach.call(elems, function(obj) {
            dict[obj.name]= obj.value;
        });

        if (Object.keys(dict).length !== 0 && dict.host.length > 0)
        {
            rules.push(dict);
        }
    };

    var rulesElements = document.querySelector('#rules').children;
    [].forEach.call(rulesElements, loadRule)
    console.log(rules)
    return rules
}

function delete_rule(el){
    var elem = el.currentTarget
    var div = elem.parentNode
    div.parentNode.removeChild(div)
    console.log(el, div)
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#addRule').addEventListener('click', add_new_rule);
document.querySelector('#loadRules').addEventListener('click', load_rules);

